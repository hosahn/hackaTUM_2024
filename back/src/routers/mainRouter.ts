import express, { Router, Request, Response , Application } from 'express';
import { basicAIService } from '../services/basicAI';
import { Aggregator } from '../lib/aggregator';
const mainRouter:Router = Router();
const aggregator:Aggregator = new Aggregator();
mainRouter.get("/api", async(req:Request, res:Response)  => {
    res.send("Welcome to news generator. Every requests should go through post request")
})

mainRouter.post("/api/getArticles", async(req:Request, res:Response)  => {
    var list = ["https://rss.app/feeds/MLuDKqkwFtd2tuMr.xml",
        "https://www.autobild.de/rss/22590661.xml"]
    var result = await aggregator.fetchTopics(list);

    console.log(result);
    var summary = await basicAIService.searchArticles("");
    var combined;
    res.send(combined);
})

mainRouter.post("/api/generateArticle", async(req:Request, res:Response)  => {
    var result = await basicAIService.searchArticles(req.body);
    res.send("")
})

mainRouter.post("/api/publishArticle", async(req:Request,res:Response)=>{
    res.send("")
})

export { mainRouter }