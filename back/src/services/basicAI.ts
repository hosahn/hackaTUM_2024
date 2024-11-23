import dotenv from 'dotenv';
import axios from "axios";
import { Topic } from '../lib/aggregator';
dotenv.config();

interface Summary {
    "category":string,
    "summary":string,
    "idx":number
}

const AZURE_ENDPOINT = process.env.GPT_4o || "none"
const AZURE_IMAGE_ENDPOINT = process.env.GPT_IMAGE || "none"

class basicAIService{
    static async mockOption(){
        const api_call = await axios.post(
            AZURE_ENDPOINT,
            { "messages": [{"role": "user", "content": "Give me an article about US international relationship in HTML format. Please avoid to start conversation like 'okay', just give me ONLY HTML format of this article"}], },
        );
        return api_call.data.choices[0].message.content
    }
    static async evaluateOpinion(input:string[]){
        const api_call = await axios.post(
            AZURE_ENDPOINT,
            { "messages": [{"role": "user", "content": "who will be the next president of US?"}], },
        );
    }
    static async generateArticles(input:string){

        try {
            const api_call = await axios.post(
                AZURE_ENDPOINT,
                { "messages": [{"role": "user", "content": "who will be the next president of US?"}], },
            );
    
            const responseMessage = api_call.data.choices[0].message.content;
            return responseMessage;
        } catch (error:any) {
            console.error('Error:', error.response?.data || error.message);
        }
    }

    static async summaryArticles(input: Topic[]): Promise<Summary[]> {
        input.sort((a, b) => {
            if (a.pubDate && b.pubDate) {
                const dateA = new Date(a.pubDate);
                const dateB = new Date(b.pubDate);
                return dateB.getTime() - dateA.getTime();  // Sort by most recent date
            }
            return 0;
        });
    
        let result: Summary[] = [];
    
        // Limit the number of articles to process
        let length = input.length > 15 ? 15 : input.length;
        for (let i = 0; i < length; i++) {
            let text = input[i].content;
            let messages = [{ "role": "user", "content": `summarize this article: ${text}` }];
    
            try {
                // First API call to summarize the article
                const api_call = await axios.post(AZURE_ENDPOINT, { "messages": messages });
                let summary:string  = api_call.data.choices[0]?.message?.content;
    
                messages.push({ "role": "system", "content": summary });
                // Second API call to evaluate the article based on 11 criteria
                messages.push({ "role": "user", "content": `1.Does the content provide original information, reporting, research, or analysis?
                                                            2.Does the content provide a substantial, complete, or comprehensive description of the topic?
                                                            3.Does the content provide insightful analysis or interesting information that is beyond the 4.obvious?
                                                            5.If the content draws on other sources, does it avoid simply copying or rewriting those sources, 6.and instead provide substantial additional value and originality?
                                                            7.Does the main heading or page title provide a descriptive, helpful summary of the content?
                                                            8.Does the main heading or page title avoid exaggerating or being shocking in nature?
                                                            9.Is this the sort of page you'd want to bookmark, share with a friend, or recommend?
                                                            10.Would you expect to see this content in or referenced by a printed magazine, encyclopedia, or book?
                                                            11.Does the content provide substantial value when compared to other pages in search results?
                                                            If this article meets no less than 7 of the criteria. Answer 'yes', else 'no' Please do not provide additional explanation.
                                                            ` });
    
                const api_call2 = await axios.post(AZURE_ENDPOINT, { "messages": messages });

                let responseMessage = api_call2.data.choices[0]?.message?.content;
                if (responseMessage.includes("no") || responseMessage.includes("No")) {
                    continue
                }
                if (responseMessage) {
                    console.log(responseMessage);
                    messages.push({ "role": "system", "content": responseMessage });
                } else {
                    console.error("Error: No response content in API call 3");
                    continue;
                }
    
                // Fourth API call to classify the article's primary topic
                messages.push({ "role": "user", "content": `Which of the following topics is the article primarily focused on? Deals, New launch, politics, Environment, Company news, Future technology, Two-wheeler Answer with ONLY category` });
    
                const api_call4 = await axios.post(AZURE_ENDPOINT, { "messages": messages });
                let category:string = api_call4.data.choices[0]?.message?.content;
                category = category.toLowerCase();

                result.push({"category":category, "summary":summary, "idx":i})
                
                

            } catch (error: any) {
                console.error('Error:', error.response?.data || error.message);
            }
        }
        return result;
    }
    
    static async generateMedia(keywords:string[]){
        let imageList = []

        try {
            for(let i = 0; i < 3; i++){
            const api_call = await axios.post(
                AZURE_IMAGE_ENDPOINT,
                {
                    "prompt": "electric car",
                    "n": 1,
                    "quality": "standard"
                   },
            );
            imageList.push(api_call.data.data[0].url);
            }
            return imageList;
        } catch (error:any) {
            console.error('Error:', error.response?.data || error.message);
        }
        return ""
    }

    static async automatedQualityCheck(result:string){
        // TODO implement QC mecnahism
        return result;
    }
}

export {basicAIService, Summary}