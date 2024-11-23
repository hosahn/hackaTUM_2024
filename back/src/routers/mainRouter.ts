import express, { Router, Request, Response , Application } from 'express';
import { basicAIService } from '../services/basicAI';

const mainRouter:Router = Router();

mainRouter.get("/api", async(req:Request, res:Response)  => {
    res.send("Welcome to news generator. Every requests should go through post request")
})

mainRouter.post("/api/getArticles", async(req:Request, res:Response)  => {
    var result = await basicAIService.searchArticles(req.body);
    res.send(result);
})

mainRouter.post("/api/generateArticle", async(req:Request, res:Response)  => {
    res.send("")
})

mainRouter.post("/api/publishArticle", async(req:Request,res:Response)=>{
    res.send("")
})

export { mainRouter }