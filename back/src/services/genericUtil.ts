import axios from "axios";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import dotenv from 'dotenv'
dotenv.config();
import googleNewsScraper, {Article} from "google-news-scraper";

class GenericUtilService {
    // Function to extract article content from a URL
    static async extractArticleFromUrl(url: string): Promise<string | null> {
        try {
            const { data } = await axios.get(url);

            const dom = new JSDOM(data);
            const document = dom.window.document;

            const reader = new Readability(document);
            const article = reader.parse();

            if (article && article.content) {
                return article.content;
            } else {
                const $ = cheerio.load(data);
                const content = $("article, .post-content, .entry-content").text().trim();

                return content || "No content found.";
            }
        } catch (error:any) {
            console.error("Error extracting article:", error.message);
            return null;
        }
    }

    static async cool_keyword_google_scraper(keywords: string[]): Promise<Article[]> {
        const articles: Article[] = await googleNewsScraper({ searchTerm: keywords.join(" ")});
        return articles
    }

    static async cool_keyword_twitter_scraper(keywords: string[]): Promise<any[]> {
        // const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
        // if (!TWITTER_BEARER_TOKEN) {
        //     throw new Error("Twitter Bearer Token is required.");
        // }
        // console.log(TWITTER_BEARER_TOKEN)
        // try {
        //     const results: any[] = [];
        //     const twitterSearchUrl = `https://api.twitter.com/2/tweets/search/recent`;

        //     // Loop through each keyword and perform a search
        //     let keyword = keywords.join(" ");
        //     const response = await axios.get(twitterSearchUrl, {
        //         headers: {
        //             Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        //         },
        //         params: {
        //             query: keyword,
        //             max_results: 10,
        //             "tweet.fields": "created_at,text,author_id",
        //         },
        //     });

        //     if (response.data.data) {
        //         const tweets = response.data.data.map((tweet: any) => ({
        //             id: tweet.id,
        //             text: tweet.text,
        //             createdAt: tweet.created_at,
        //             authorId: tweet.author_id,
        //         }));
        //         results.push(...tweets);
        //     }
        //     return results;
        // } catch (error: any) {
        //     console.error("Error fetching Twitter feeds:", error.message);
        //     return [];
        // }
        return [
            {
              id: '1860252624290799721',
              text: 'RT @KaiRuhsert: «Wer ein E-Auto kauft, setzt ein Zeichen gegen Trump», war kürzlich in der «Süddeutschen Zeitung» zu lesen.\n' +
                'KR: Die SZ hat…',
              createdAt: '2024-11-23T09:22:42.000Z',
              authorId: '417642769'
            },
            {
              id: '1860238415457059260',
              text: 'RT @KaiRuhsert: «Wer ein E-Auto kauft, setzt ein Zeichen gegen Trump», war kürzlich in der «Süddeutschen Zeitung» zu lesen.\n' +
                'KR: Die SZ hat…',
              createdAt: '2024-11-23T08:26:14.000Z',
              authorId: '225452189'
            },
            {
              id: '1860223157724234041',
              text: '«Wer ein E-Auto kauft, setzt ein Zeichen gegen Trump», war kürzlich in der «Süddeutschen Zeitung» zu lesen.\n' +
                'KR: Die SZ hat schwere wirtschaftliche Probleme. Woran das wohl liegen mag?\n' +
                'https://t.co/A6iIKb3SlO',
              createdAt: '2024-11-23T07:25:36.000Z',
              authorId: '1440893357362925570'
            },
            {
              id: '1858428642440671499',
              text: '@Lewellyn7091 @Peter_Jelinek Wie kommt man eigentlich damit klar, dass der e-auto Pionier im Team Trump ist, und sich die Ölproduktion der USA seit Amtsantritt von Obama verdoppelt hat und es da keinen Unterschied in der Politik der jeweil Präsidenten gibt? https://t.co/3pnu9RhQLf',
              createdAt: '2024-11-18T08:34:50.000Z',
              authorId: '1543873569255481344'
            },
            {
              id: '1858347749919408467',
              text: '#Trump hat mit der Ernennung seines Energieministers dann endgültig die Weichen auf 30 Jahre zurück in die Zukunft gestellt.\n' +
                '\n' +
                'Allerdings auch gegen E-Auto #Musk.\n' +
                '\n' +
                'Bin gespannt wann Musk das bemerkt und vor allem, wann er gefeuert wird.\n' +
                '\n' +
                'Und das wird er, da bin ich mir sicher.',
              createdAt: '2024-11-18T03:13:24.000Z',
              authorId: '102519200'
            },
            {
              id: '1857876245012172885',
              text: '@SZ Robert Habeck hat die E-Auto Prämie doch auch ganz kurzfristig gestrichen. War doch auch kein Problem. Warum sollte das bei Elon Musk und Donald Trump so sein?',
              createdAt: '2024-11-16T19:59:49.000Z',
              authorId: '1696997340794568705'
            }
          ]
          // TWITTER_MOCK!!!!!!
    }
}

export { GenericUtilService };
