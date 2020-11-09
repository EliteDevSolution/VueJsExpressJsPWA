import express from 'express';
import authenticated from '../middlewares/authenticated';
import UsersController from '../controllers/user/UsersController';
import AuthController from '../controllers/user/AuthController';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);


router.get('/', authenticated, (req, res) => res.send('User route here.'));

router.get('/myinfo', authenticated, UsersController.myInfo);
router.get('/getall', authenticated, UsersController.getAll);
router.get('/get_roles', authenticated, UsersController.getRoles);
router.post('/add', authenticated, UsersController.store);
router.get('/get/:id', authenticated, UsersController.get);
router.put('/update/:id', authenticated, UsersController.update);
router.put('/user_update/:id', authenticated, UsersController.user_update);
router.delete('/delete/:id', authenticated, UsersController.delete);
router.post('/resetPassword', authenticated, UsersController.resetPassword);
router.post('/change_status/:id', authenticated, UsersController.changeUserStatus);
router.delete('/removePhoto/:id', authenticated, UsersController.removePhoto);

export default router;
