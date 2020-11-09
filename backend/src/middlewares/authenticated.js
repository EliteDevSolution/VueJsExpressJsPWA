import jwt from 'jsonwebtoken';
import env from "../env";
import models from '../database/models/index';

const User = models.User;

const authenticated = (req, res, next) => {
    const token = req.headers['authorization'];
    jwt.verify(token, env.APP_KEY, (err, data) => {
        if (err) {
            res.json("Token not provided")
        } else {
            User.findByPk(data.id).then(user => {
                req.user = user;
                next();
            });
        }
    });
};

export default authenticated;
