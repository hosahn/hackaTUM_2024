import express, { Router, Request, Response, Application } from 'express';
import { basicAIService } from '../services/basicAI';
import { GenericUtilService } from '../services/genericUtil';
import { Aggregator, Topic } from '../services/aggregator';
import { Language, ArticleLength } from '../services/prompt';
import { Summary } from '../services/basicAI';

import bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


const mainRouter: Router = Router();
const aggregator: Aggregator = new Aggregator();
mainRouter.get("/api", jsonParser, async (req: Request, res: Response) => {
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

mainRouter.post("/api/getArticles", jsonParser,async(req:Request, res:Response)  => {
    var list = ["https://rss.app/feeds/MLuDKqkwFtd2tuMr.xml",
        "https://www.autobild.de/rss/22590661.xml"]
    var result:Topic[] = [];
    try{
    var result = await aggregator.fetchTopics(list);
    }
    catch(error:any){
        console.log("hello0")
    }

    let length = result.length > 20 ? 20 : result.length
    for(let i = 0; i < length; i++){
        try{
        var actual_summary = GenericUtilService.extractArticleFromUrl(result[i].link);
        result[i].content = await actual_summary || result[i].content;
        }
        catch(error:any){
              result.splice(i, 1); // 2nd parameter means remove one item only
        }
    }

    var summaries:Summary[] = await basicAIService.summaryArticles(result);

    var combined : getArticlesView[] = [];
    var final_list :getArticlesViewList = {"data":[], "categories":[]};
    for(let i = 0; i < summaries.length; i++){
        console.log(summaries[i].idx)
        result[summaries[i].idx].content = summaries[i].summary;
        let tmp : getArticlesView = {metainfo:result[summaries[i].idx],category:summaries[i].category};
        combined.push(tmp);
    }
    final_list.data = combined
    final_list.categories = ["Deals", "New launch", "politics", "Environment", "Company news", "Future technology", "Two-wheeler"]
    res.send(final_list);
})

mainRouter.post("/api/generateArticle", jsonParser,async (req: Request, res: Response) => {
    // var selected_urls: string[] = ["https://www.t-online.de/mobilitaet/aktuelles/id_100537168/tesla-cybercab-kommt-nach-europa-hier-sehen-sie-das-elon-musk-robotaxi.html",
    //     "https://www.chip.de/news/In-Deutschland-gibt-es-jetzt-den-ersten-reinen-Ladepark-fuer-E-Autos_185625526.html",
    //     "https://www.merkur.de/wirtschaft/das-naechste-ampel-projekt-fuer-deutschland-in-gefahr-europas-hoffnungstraeger-ist-insolvent-zr-93426508.html"
    // ];
    // var keywords: string[] = ["Technology", "Electric Vehicles", "Tesla", "Elon Musk", "Germany", "Europe"];
    // var word_count: number = 250;

    var selected_urls: string[] = req.body.urls;
    var keywords: string[] = req.body.keywords;
    var word_count: number = req.body.word_count;

    var length: ArticleLength;
    switch (word_count) {
        case 250:
            length = ArticleLength.SHORT;
            break;
        case 500:
            length = ArticleLength.MEDIUM;
            break;
        case 1000:
            length = ArticleLength.LONG;
            break;
        default:
            console.log("Invalid word count, defaulting to medium length.");
            length = ArticleLength.MEDIUM;
            break;
    }

    var result = await basicAIService.generateArticles(selected_urls, keywords, length, Language.German);
    var final_result = await basicAIService.automatedQualityCheck(result);

    var what_does_people_think = await GenericUtilService.cool_keyword_twitter_scraper(["",""])
    var evaluation = await basicAIService.evaluateOpinion(what_does_people_think)
    res.send(final_result)
})

mainRouter.post("/api/userFeedback", async (req: Request, res: Response) => {
    res.send("1337")
})

mainRouter.post("/api/generateImages", async(req:Request, res:Response) => {
    var imageList = await basicAIService.generateMedia(["e-auto", "conflict", "eco system"])
    res.send(imageList)
})

mainRouter.post("/api/publishArticle", async (req: Request, res: Response) => {
    res.send("1337")
})



mainRouter.get("/api/debug", async(req:Request,res:Response)=>{
    var list = ["https://rss.app/feeds/MLuDKqkwFtd2tuMr.xml",
        "https://www.autobild.de/rss/22590661.xml"]

    var result:Topic[] = [];
    try{
    var result = await aggregator.fetchTopics(list);
    }
    catch(error:any){
        console.log("hello0")
    }

    let length = result.length > 20 ? 20 : result.length
    for(let i = 0; i < length; i++){
        try{
        var actual_summary = GenericUtilService.extractArticleFromUrl(result[i].link);
        result[i].content = await actual_summary || result[i].content;
        }
        catch(error:any){
              result.splice(i, 1); // 2nd parameter means remove one item only
        }
    }

    var summaries:Summary[] = await basicAIService.summaryArticles(result);

    var combined : getArticlesView[] = [];
    var final_list :getArticlesViewList = {"data":[], "categories":[]};
    for(let i = 0; i < summaries.length; i++){
        result[summaries[i].idx].content = summaries[i].summary;
        let tmp : getArticlesView = {metainfo:result[summaries[i].idx],category:summaries[i].category};
        combined.push(tmp);
    }
    final_list.data = combined
    final_list.categories = ["Deals", "New launch", "politics", "Environment", "Company news", "Future technology", "Two-wheeler"]
    res.send(final_list);
})



export { mainRouter, getArticlesView }