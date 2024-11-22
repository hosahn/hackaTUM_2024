import express, { Router, Request, Response , Application } from 'express';
import { basicAIService } from '../services/basicAI';

const mainRouter:Router = Router();

mainRouter.get("/main", async(req:Request, res:Response)  => {
    var result = await basicAIService.searchArticles();
    res.send("Initial endpoint");
})

export { mainRouter }