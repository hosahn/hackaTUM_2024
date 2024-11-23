import express, {Express, Request, Response, Application} from 'express';
import dotenv from 'dotenv';
import {mainRouter} from './routers/mainRouter';
import cors from 'cors'

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(mainRouter)

export {app};