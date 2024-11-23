import express, { Router, Request, Response, Application } from 'express';
import { basicAIService } from '../services/basicAI';
import { GenericUtilService } from '../services/genericUtil';
import { Aggregator, Topic } from '../services/aggregator';
import { Language, ArticleLength } from '../services/prompt';
const mainRouter: Router = Router();
const aggregator: Aggregator = new Aggregator();
mainRouter.get("/api", async (req: Request, res: Response) => {
    await basicAIService.generateMedia(["boy", "asian", "anime"])
    res.send("Welcome to news generator. Every requests should go through post request")
})

interface getArticlesView {
    metainfo: Topic,
    summary: string,
}
mainRouter.get("/api/getArticles", async (req: Request, res: Response) => {
    var list = ["https://rss.app/feeds/MLuDKqkwFtd2tuMr.xml",
        "https://www.autobild.de/rss/22590661.xml"]
    var result = await aggregator.fetchTopics(list);
    let length = result.length > 10 ? 10 : result.length
    for (let i = 0; i < length; i++) {
        var actual_summary = GenericUtilService.extractArticleFromUrl(result[i].link);
        result[i].content = await actual_summary || result[i].content;
    }

    var summaries = await basicAIService.summaryArticles(result);
    var combined: getArticlesView[] = [];
    for (let i = 0; i < summaries.length; i++) {
        let tmp: getArticlesView = { metainfo: result[i], summary: summaries[i] };
        combined.push(tmp);
    }
    res.send(combined);
})

mainRouter.post("/api/generateArticle", async (req: Request, res: Response) => {
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
    res.send(final_result)
})

mainRouter.post("/api/userFeedback", async (req: Request, res: Response) => {
    res.send("1337")
})

mainRouter.post("/api/publishArticle", async (req: Request, res: Response) => {
    res.send("1337")
})

export { mainRouter }