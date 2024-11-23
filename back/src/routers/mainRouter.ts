import express, { Router, Request, Response , Application } from 'express';
import { basicAIService } from '../services/basicAI';
import { GenericUtilService } from '../services/genericUtil';
import { Aggregator, Topic } from '../lib/aggregator';
import { Summary } from '../services/basicAI';
const mainRouter:Router = Router();
const aggregator:Aggregator = new Aggregator();
mainRouter.get("/api", async(req:Request, res:Response)  => {
    await basicAIService.generateMedia(["boy", "asian", "anime"])
    res.send("Welcome to news generator. Every requests should go through post request")
})

interface getArticlesView {
    metainfo : Topic,
    category: string
}

interface getArticlesViewList{
    data: getArticlesView[],
    categories:string[]
}

mainRouter.post("/api/getArticles", async(req:Request, res:Response)  => {
    var list = ["https://rss.app/feeds/MLuDKqkwFtd2tuMr.xml",
        "https://www.autobild.de/rss/22590661.xml"]
    var result = await aggregator.fetchTopics(list);
    let length = result.length > 10 ? 10 : result.length
    for(let i = 0; i < length; i++){
        var actual_summary = GenericUtilService.extractArticleFromUrl(result[i].link);
        result[i].content = await actual_summary || result[i].content;
    }

    var summaries:Summary[] = await basicAIService.summaryArticles(result);

    var combined : getArticlesView[] = [];
    for(let i = 0; i < summaries.length; i++){
        result[summaries[i].idx].content = summaries[i].summary;
        let tmp : getArticlesView = {metainfo:result[i],category:summaries[i].category};
        combined.push(tmp);
    }
    res.send(combined);
})

mainRouter.post("/api/generateArticle", async(req:Request, res:Response)  => {
    // TODO var result = await basicAIService.generateArticles(req.body);
    var result = await basicAIService.generateArticles("");
    var final_result = await basicAIService.automatedQualityCheck(result);

    var what_does_people_think = await GenericUtilService.cool_keyword_twitter_scraper(["",""])
    var evaluation = await basicAIService.evaluateOpinion(what_does_people_think)
    res.send(final_result)
})

mainRouter.post("/api/userFeedback", async(req:Request, res:Response) => {
    res.send("1337")
})

mainRouter.post("/api/generateImages", async(req:Request, res:Response) => {
    var imageList = await basicAIService.generateMedia(["e-auto", "conflict", "eco system"])
    res.send(imageList)
})

mainRouter.post("/api/publishArticle", async(req:Request,res:Response)=>{
    res.send("1337")
})



mainRouter.get("/api/debug", async(req:Request,res:Response)=>{
    var list = ["https://rss.app/feeds/MLuDKqkwFtd2tuMr.xml",
        "https://www.autobild.de/rss/22590661.xml"]
    var result = await aggregator.fetchTopics(list);
    let length = result.length > 10 ? 10 : result.length
    for(let i = 0; i < length; i++){
        var actual_summary = GenericUtilService.extractArticleFromUrl(result[i].link);
        result[i].content = await actual_summary || result[i].content;
    }

    var summaries:Summary[] = await basicAIService.summaryArticles(result);

    var combined : getArticlesView[] = [];
    var final_list :getArticlesViewList = {"data":[], "categories":[]};
    for(let i = 0; i < summaries.length; i++){
        result[summaries[i].idx].content = summaries[i].summary;
        let tmp : getArticlesView = {metainfo:result[i],category:summaries[i].category};
        combined.push(tmp);
    }
    final_list.data = combined
    final_list.categories = ["Deals", "New launch", "politics", "Environment", "Company news", "Future technology", "Two-wheeler"]
    res.send(final_list);
})



export { mainRouter, getArticlesView }