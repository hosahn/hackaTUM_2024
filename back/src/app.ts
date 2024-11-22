import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import { mainRouter } from './endpoints/mainRouter';
dotenv.config();

const app: Application = express();
app.use(mainRouter)

export {app};