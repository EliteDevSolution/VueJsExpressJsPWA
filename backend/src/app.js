import express from 'express';
import 'babel-polyfill';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import env from './env';
import routes from './routes/index';
import './database/models/index';

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.options('*', cors());

app.get('/', (req, res) => res.send('App is running...'));
app.use('/api', routes);

app.listen(env.API_PORT, () => {
    console.log(`Api listening on port ${env.API_PORT}!`);
});