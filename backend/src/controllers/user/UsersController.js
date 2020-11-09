import models from '../../database/models/index';

import multiparty from 'multiparty';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import joi from 'joi';
const defaultImgPath = '/storage/user-data/default-avatar.png';
const User = models.User;

const isSuperAdmin = async (req) =>
{
    var roles = await req.user.getUser_has_roles({
        attributes: ['role_id']
    });

    var roleIds = [];
    roles.forEach(row => {
        roleIds.push(row.role_id);
    })
    return roleIds.includes(1);
}

export default class UsersController{
    constructor() {

    }

    static myInfo(req, res) {
        const myInfo = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar,
        };
        res.json(myInfo);
    }

    static async getAll(req, res) {
        const users = await User.findAll({
            include: [{
                model: models.User_has_role,
                attributes: ['role_id'],
                include:{
                    model: models.Role,
                    attributes: ['name'],
                }
            }],
        });
        res.json(users);
    }

    static async getRoles(req, res) {
        const roles = await models.Role.findAll({
            attributes: ['id', ['name', 'label']]
        });
        res.json(roles);
    }

    static async get(req, res) {
        const users = await User.findAll({
            where: [ {'id': req.params.id} ],
            include: [{
                model: models.User_has_role,
                attributes: ['role_id'],
                include:{
                    model: models.Role,
                    attributes: ['name'],
                }
            }],
        });
        res.json(users);
    }

    static async store(req, res)
    {
        const rules = {
            firstname: joi.string().min(3).required(),
            lastname: joi.string().required(),
            phone: joi.string().min(8).required(),
            password: joi.string().min(6).required(),
            email: joi.string().email({ tlds: { allow: false } }),
            role: joi.array().required()
        };

        const {error, result} = joi.validate(req.body, rules);
        if (error) {
            return res.status(421).send({
                message: error.message,
                data: res.json(error)
            });
        }

        const { firstname, lastname, email, password, phone, role } = req.body;

        User.findOne({
            where: {email: email}
        }).then(User => {
            if (User) {
                return res.status(422).send({
                    message: "Email is already in use."
                });
            }
        });

        let newUser = await User.create({ firstname: firstname, lastname:lastname, email: email, password: bcrypt.hashSync(password, 8), phone: phone });
        var roles = [];
        role.forEach(ele => {
            roles.push({user_id: newUser.id, role_id: ele.id});
        });

        let roleRes = await models.User_has_role.bulkCreate(roles);

        res.json(roleRes);
    }

    static async user_update(req, res)
    {
        const rules = {
            id: joi.number().required(),
            firstname: joi.string().min(3).required(),
            lastname: joi.string().required(),
            phone: joi.string().min(8).required(),
            password: req.body.password === "" ? "" : joi.string().min(6).required(),
            email: joi.string().email({ tlds: { allow: false } }),
            role: joi.array().required()
        };

        const {error, result} = joi.validate(req.body, rules);
        if (error) {
            return res.status(421).send({
                message: error.message,
                data: res.json(error)
            });
        }

        const { id, firstname, lastname, email, password, phone, role } = req.body;

        if(id !== 1)     //IsSuperAdmin
            await models.User_has_role.destroy({ where: {user_id: id}});

        let updateUser;
        if(password != "")
            updateUser = await User.update({ firstname: firstname, lastname:lastname, email: email, password: bcrypt.hashSync(password, 8), phone: phone }, { where: {id: id } });
        else
            updateUser = await User.update({ firstname: firstname, lastname:lastname, email: email, phone: phone }, { where: {id: id } });
        //return

        var roles = [];

        await role.forEach(ele => {
            roles.push({user_id: id, role_id: ele.id});
        });

        if(id !== 1)     //IsSuperAdmin
            await models.User_has_role.bulkCreate(roles);

        res.json(updateUser);
    }

    static async update(req, res)
    {
        var form = new multiparty.Form();
        form.parse(req, function(err, fields, files)
        {
            const rules = {
                firstname: joi.string().min(3).required(),
                lastname: joi.string().min(2).required(),
                phone: joi.string().min(8).required(),
                email: joi.string().email({ tlds: { allow: false } })
            };

            const userInfo = {};
            userInfo.firstname = fields.firstname[0];
            userInfo.lastname = fields.lastname[0];
            userInfo.phone = fields.phone[0];
            userInfo.email = fields.email[0];
            const {error, result} = joi.validate(userInfo, rules);
            if (error) {
                return res.status(421).send({
                    message: error.message,
                    data: error
                });
            }

            req.user.firstname = userInfo.firstname;
            req.user.lastname = userInfo.lastname;
            req.user.phone = userInfo.phone;
            req.user.email = userInfo.email;

            // Image upload Processor...///
            var avatar = [];
            avatar = files.photo || [];

            if(avatar.length > 0)
            {
                if(req.user.avatar !== defaultImgPath)   //Previous resource remove
                {
                    if(fs.existsSync(`./public${req.user.avatar}`))
                        fs.unlinkSync(`./public${req.user.avatar}`);
                }
                var targetFilePath = "./public/storage/user-data/" + avatar[0].originalFilename;
                var filePath = avatar[0].path;
                var buffer = fs.readFileSync(filePath);
                fs.writeFile(targetFilePath, buffer,  function (err) {
                    if (err) {
                        return res.status(422).send({
                            message: "File Upload Error",
                        });
                    }
                    req.user.avatar = "/storage/user-data/" + avatar[0].originalFilename;
                    req.user.save().then(result => {
                        res.json({
                            user_info: {
                                name: result.lastname + ' ' +  result.firstname ,
                                firstname: result.firstname,
                                lastname: result.lastname,
                                phone: result.phone,
                                email: result.email,
                                avatar: result.avatar
                            }
                        });
                    });
                });
            } else {
                req.user.save().then(result => {
                    res.json({
                        user_info: {
                            name: result.lastname + ' ' +  result.firstname ,
                            firstname: result.firstname,
                            lastname: result.lastname,
                            phone: result.phone,
                            email: result.email,
                            avatar: result.avatar
                        }
                    });
                });
            }
        });
    }

    static async changeUserStatus(req, res)
    {
        if(await isSuperAdmin(req) === false)
        {
            return res.status(421).send({
                message: 'Have no access permission!'
            });
        }
        const user = await User.findByPk(req.params.id);
        user.status = req.body.status;
        user.save().then(result => {
            res.json(result);
        });
    }

    static async delete(req, res)
    {
        if(await isSuperAdmin(req) === false)
        {
            return res.status(421).send({
                message: 'Have no access permission!'
            });
        }

        const users = await User.findByPk(req.params.id);
        users.destroy().then(result => {
            res.json(result);
        });
    }

    static resetPassword(req, res)
    {
        var oldPassword = req.user.password;
        const rules = {
            old_password: joi.string().min(6).required(),
            new_password: joi.string().min(6).required(),
            confirm_password: joi.any().valid(joi.ref('new_password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
        };

        const {error, result} = joi.validate(req.body, rules);
        if (error) {
            return res.status(422).send({
                message: error.message,
                data: error
            });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.old_password,
            oldPassword
        );

        if(!passwordIsValid)
        {
            return res.status(421).send({
                message: 'Old password is valid.',
            });
        }

        req.user.password = bcrypt.hashSync(req.body.confirm_password, 8)
        req.user.save().then(result => {
            res.json(result)
        });
    }

    static async removePhoto(req, res)
    {
        var curPhotoPath = req.user.avatar;
        if(curPhotoPath !== defaultImgPath)
        {
            if(fs.existsSync(`./public${req.user.avatar}`))
                fs.unlinkSync(`./public${req.user.avatar}`);
            req.user.avatar = defaultImgPath;
            req.user.save().then(result => {
                res.json({
                    user_info: {
                        avatar: result.avatar,
                    }
                });
            });
        } else {
            return res.status(422).send({
                message: "File Remove nothing.",
            });
        }
    }
}
