import axios from "axios";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

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
}

export { GenericUtilService };
