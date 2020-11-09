import models from '../../database/models/index';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from "../../env";
import joi from 'joi';

export default class AuthController {
    constructor() {

    }

    static login(req, res) {
        const credential = req.body;
        models.User.findOne({ where: {email: credential.email} }).then(User => {
            if (!User) {
                return res.status(401).send({ message: "Invalid credentials!" });
            }

            if(User.status !== 1)
            {
                return res.status(401).send({
                    accessToken: null,
                    message: "User disabled!"
                });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                User.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid credentials!"
                });
            }

            var token = jwt.sign({
                id: User.id
            }, env.APP_KEY, {
                expiresIn: 86400 // 24 hours
            });

            models.User_has_role.findAll({
                attributes: [],
                where: {
                    user_id: User.id,
                },
                include: [{
                    model: models.Role,
                    attributes: ['name'],
                }],
            }).then(result => {
                let roles = [];
                result.forEach(ele => {
                    roles.push(ele.Role.name);
                });

                res.json({
                    token: token,
                    user_info: {
                        id: User.id,
                        name: User.lastname + ' ' +  User.firstname,
                        firstname: User.firstname,
                        lastname: User.lastname,
                        phone: User.phone,
                        email: User.email,
                        stauts: User.status,
                        avatar: User.avatar,
                        roles: roles
                    }
                });
            });
        });
    }

    static register(req, res) {
        const { firstname, lastname, email, password, phone } = req.body;
        const rules = {
            firstname: joi.string().min(3).required(),
            lastname: joi.string().min(1).required(),
            password: joi.string().min(6).required(),
            phone: joi.string().min(8).required(),
            email: joi.string().email({ tlds: { allow: false } })
        };
        const { error, value } = joi.validate(req.body, rules);
        if (error) {
            return res.status(421).send({
                message: "Validation Error.",
                data: res.json(error),
            });
        }
        models.User.findOne({
            where: {email: email}
        }).then(User => {
            if(User){
                return res.status(422).send({
                    message: "Email is already in use."
                });
            }

            models.User.create({ firstname: firstname, lastname:lastname, email: email, password: bcrypt.hashSync(password, 8), phone: phone }).then(User => {
                var token = jwt.sign({
                    id: User.id
                }, env.APP_KEY, {
                    expiresIn: 86400 // 24 hours
                });

                models.User_has_role.create({user_id: User.id, role_id: 2}).then(Role => {

                    models.User_has_role.findAll({
                        attributes: [],
                        where: {
                            user_id: User.id,
                        },
                        include: [{
                            model: models.Role,
                            attributes: ['name'],
                        }],
                    }).then(roles => {
                        res.json({
                            token: token,
                            user_info: {
                                id: User.id,
                                name: User.lastname + ' ' +  User.firstname ,
                                firstname: User.firstname,
                                lastname: User.lastname,
                                phone: User.phone,
                                email: User.email,
                                stauts: User.status,
                                avatar: User.avatar,
                                roles: roles
                            }
                        });
                    });
                });
            });
        });
    }
}
