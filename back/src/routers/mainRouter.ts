import express, { Router, Request, Response, Application } from 'express';
import { basicAIService } from '../services/basicAI';
import { GenericUtilService } from '../services/genericUtil';
import { Aggregator, Topic } from '../services/aggregator';
import { Language, ArticleLength } from '../services/prompt';
import { Summary } from '../services/basicAI';

import bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

let mock_data_getArticles = {
    data: [
    {
    metainfo: {
    id: 0,
    title: "Das sind laut TÜV die besten und schlechtesten Autos",
    link: "https://www.t-online.de/mobilitaet/aktuelles/id_100536404/tuev-maengelreport-2025-das-sind-deutschlands-schlechteste-autos.html",
    pubDate: "Sat, 23 Nov 2024 17:14:52 GMT",
    source: "Automobile - Google News",
    content: "Der neue TÜV-Report 2024 basiert auf 10,2 Millionen Hauptuntersuchungen und zeigt, welche Autos in Deutschland zuverlässig sind und welche mit Mängeln auffallen. Rund 20% der Fahrzeuge wiesen erhebliche Mängel auf, und bestimmte Modelle müssen besonders beachtet werden. Bei Elektrofahrzeugen schneidet der VW e-Golf mit einer Mängelquote von 3,4% gut ab, während das Tesla Model 3 mit 14,2% den letzten Platz einnimmt. Der Honda Jazz überzeugt mit der niedrigsten Mängelquote von 2,4% unter den zwei- bis dreijährigen Autos. Im Gegensatz dazu enttäuschen Modelle wie der Tesla Model 3, Dacia Logan und Renault Twingo mit hohen Mängelquoten, insbesondere bei älteren Fahrzeugen."
    },
    category: "electric cars"
    },
    {
    metainfo: {
    id: 3,
    title: "Habeck bei Northvolt 'vorsichtig optimistisch'",
    link: "https://www.heise.de/news/Habeck-bei-Northvolt-vorsichtig-optimistisch-10128846.html",
    pubDate: "Sat, 23 Nov 2024 14:44:00 GMT",
    source: "Automobile - Google News",
    content: "The article discusses the situation regarding Northvolt, a Swedish battery manufacturer that has filed for Chapter 11 bankruptcy protection in the US. German Economic Minister Robert Habeck is cautiously optimistic about Northvolt's future, acknowledging current production issues at their Swedish plant but suggesting they are technically solvable. Despite financial difficulties, which prompted the US filing to shield against creditor claims, Northvolt is receiving fresh funds—$100 million in bridge financing from a customer and $145 million from lenders. The planned factory in Heide, Germany, remains unaffected and strategically significant. Northvolt is seen as a key player for the European automotive industry's battery supply, with stakeholders including Volkswagen, Goldman Sachs, and BMW."
    },
    category: "politics, company news, electric cars"
    },
    {
    metainfo: {
    id: 6,
    title: "Teslas Robotaxi kommt nach Europa – Wo das 'Cybercab' jetzt zu sehen ist",
    link: "https://www.t-online.de/mobilitaet/aktuelles/id_100537168/tesla-cybercab-kommt-nach-europa-hier-sehen-sie-das-elon-musk-robotaxi.html",
    pubDate: "Sat, 23 Nov 2024 12:03:10 GMT",
    source: "Automobile - Google News",
    content: "Der Artikel berichtet über Teslas Europa-Tour mit dem Prototyp des 'Cybercab,' einem Robotaxi ohne Lenkrad und Pedale, das Fahrten über eine App anbietet. Bis zum 8. Dezember wird der Prototyp in Berlin, Paris und London ausgestellt, später auch in Oslo, Stockholm und Amsterdam. Die Produktion ist für 2026 geplant, aber ein europäischer Marktstart bleibt unklar. Während in den USA Waymo, eine Google-Schwester, bereits autonome Fahrten durchführt, setzt Tesla auf ein Kamera-basiertes System, was Experten skeptisch betrachten."
    },
    category: "new launch, electric cars, future technology"
    },
    {
    metainfo: {
    id: 7,
    title: "Das nächste Ampel-Projekt für Deutschland in Gefahr: Europas Hoffnungsträger ist insolvent",
    link: "https://www.merkur.de/wirtschaft/das-naechste-ampel-projekt-fuer-deutschland-in-gefahr-europas-hoffnungstraeger-ist-insolvent-zr-93426508.html",
    pubDate: "Sat, 23 Nov 2024 09:11:00 GMT",
    source: "Automobile - Google News",
    content: "Der Artikel berichtet über den schwedischen Batteriehersteller Northvolt, der aufgrund finanzieller Schwierigkeiten Insolvenz angemeldet hat und Gläubigerschutz in den USA beantragt. Dies hat Auswirkungen auf das geplante Großprojekt in Deutschland, wo Northvolt eine Batteriefabrik in Schleswig-Holstein bauen wollte. Das Projekt verzögert sich, da der Bau nun später als geplant abgeschlossen werden soll. Northvolt kämpft mit einem Schuldenberg von 5,8 Milliarden Dollar, und es wird dringend ein neuer Investor gesucht. Trotz der Insolvenz des Mutterunternehmens sollen die Bauarbeiten in Deutschland planmäßig weitergehen, da die deutsche Tochtergesellschaft unabhängig finanziert wird. Der größte Anteilseigner von Northvolt ist Volkswagen. Auch andere große Unternehmen wie BMW haben in der Vergangenheit in Northvolt investiert, jedoch kürzlich einen milliardenschweren Auftrag zurückgezogen. Die Insolvenz stellt einen Rückschlag für die europäischen Bemühungen dar, eine unabhängige Batterieindustrie aufzubauen, um sich von den dominierenden chinesischen Herstellern zu lösen."
    },
    category: "company news, electric cars, future technology"
    },
    {
    metainfo: {
    id: 9,
    title: "Northvolt: Das Drama als Symbol einer ganzen Branche ",
    link: "https://www.welt.de/wirtschaft/plus254636744/Northvolt-Das-Drama-als-Symbol-einer-ganzen-Branche.html",
    pubDate: "Sat, 23 Nov 2024 07:48:57 GMT",
    source: "Automobile - Google News",
    content: "The article discusses the challenges faced by the battery company Northvolt, which is struggling financially and has applied for creditor protection due to its overly ambitious expansion plans. This situation reflects a broader trend in the industry, where companies have overestimated their capacities and resources. Despite the financial difficulties, there remains some hope for Northvolt's recovery and future success."
    },
    category: "company news, electric cars"
    },
    {
    metainfo: {
    id: 10,
    title: "Meilenstein für die E-Mobilität: Deutschlands erster reiner Ladepark für Elektroautos",
    link: "https://www.chip.de/news/In-Deutschland-gibt-es-jetzt-den-ersten-reinen-Ladepark-fuer-E-Autos_185625526.html",
    pubDate: "Sat, 23 Nov 2024 06:14:00 GMT",
    source: "Automobile - Google News",
    content: "Aral hat in Mönchengladbach den ersten reinen Ladepark für Elektrofahrzeuge in Deutschland eröffnet. Der Ladepark umfasst 14 ultraschnelle Ladesäulen mit einer Kapazität von bis zu 400 Kilowatt, was insgesamt 28 Ladebuchten für E-Autos ermöglicht. Zusätzlich befindet sich auf dem Gelände ein REWE To Go Smart Store, der rund um die Uhr zugänglich ist. Dieser bietet neben Einkaufsmöglichkeiten einen modernen Aufenthaltsbereich mit Sitzgelegenheiten, Toiletten und kostenlosem WLAN. Der Park wurde in Zusammenarbeit mit PPG Nordpark und Siemens Smart Infrastructure entwickelt und stellt einen bedeutenden Schritt in der Entwicklung von Aral pulse, der E-Mobilitätsmarke von Aral, dar."
    },
    category: "new launch, company news, electric cars"
    }
    ],
    categories: [
    "Deals",
    "New launch",
    "politics",
    "Environment",
    "electric cars",
    "Company news",
    "Future technology",
    "Two-wheeler"
    ]
    }


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

    
    // res.send(mock_data_getArticles)
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
        var actual_summary = await GenericUtilService.extractArticleFromUrl(result[i].link);
        result[i].content = actual_summary;
        }
        catch(error:any){
              result.splice(i, 1); // 2nd parameter means remove one item only
        }
    }

    var summaries:Summary[] = await basicAIService.summaryArticles(result);

    var combined : getArticlesView[] = [];
    var final_list :getArticlesViewList = {"data":[], "categories":[]};

    for(let i = 0; i < summaries.length; i++){
        let idxx = 0;
        for(let j = 0; j < result.length; j++){
            if (result[j].id == summaries[i].idx){
                result[j].content = summaries[i].summary
                idxx = j
            }
        }
        
        let tmp : getArticlesView = {metainfo:result[idxx],category:summaries[i].category};
        combined.push(tmp);
    }
    final_list.data = combined
    final_list.categories = ["Deals", "New launch", "politics", "Environment", "electric cars", "Company news", "Future technology", "Two-wheeler"]
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
    res.send(final_result)
})

mainRouter.post("/api/userFeedback", async (req: Request, res: Response) => {
    const feedback = await GenericUtilService.cool_keyword_twitter_scraper([""]);
    let opinion = ""
    for(let i = 0; i < feedback.length; i++){
        opinion += feedback[i].text
    }
    const evaluation = await basicAIService.automatedQualityCheck(opinion);
    res.send(evaluation)
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
        var actual_summary = await GenericUtilService.extractArticleFromUrl(result[i].link);
        result[i].content = actual_summary;
        }
        catch(error:any){
              result.splice(i, 1); // 2nd parameter means remove one item only
        }
    }

    var summaries:Summary[] = await basicAIService.summaryArticles(result);

    var combined : getArticlesView[] = [];
    var final_list :getArticlesViewList = {"data":[], "categories":[]};

    for(let i = 0; i < summaries.length; i++){
        let idxx = 0;
        for(let j = 0; j < result.length; j++){
            if (result[j].id == summaries[i].idx){
                result[j].content = summaries[i].summary
                idxx = j
            }
        }
        
        let tmp : getArticlesView = {metainfo:result[idxx],category:summaries[i].category};
        combined.push(tmp);
    }
    final_list.data = combined
    final_list.categories = ["Deals", "New launch", "politics", "Environment", "electric cars", "Company news", "Future technology", "Two-wheeler"]
    res.send(final_list);
})



export { mainRouter, getArticlesView }


