import express from 'express';
import userRoutes from './user';

const router = express.Router();

router.get('/', (req, res) => res.send('API is OK'));
router.use('/users', userRoutes);

export default router;