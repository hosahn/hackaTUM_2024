import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import { mainRouter } from './routers/mainRouter';
dotenv.config();

const app: Application = express();
app.use(mainRouter)

export {app};