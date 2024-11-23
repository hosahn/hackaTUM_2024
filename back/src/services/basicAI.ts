import dotenv from 'dotenv';
import axios from "axios";
import { Topic } from '../lib/aggregator';
dotenv.config();

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
    static async summaryArticles(input:Topic[]){
        input.sort((a, b) => {
            if (a.pubDate && b.pubDate) {
                const dateA = new Date(a.pubDate);
                const dateB = new Date(b.pubDate);
                return dateB.getTime() - dateA.getTime();
            }
            return 0; 
        });

        let result : string[] = []

        
        let length = input.length > 15 ? 15 : input.length
        for(let i = 0; i < length; i++){
            console.log(i)
            let text = input[i].content;
            try {
                const api_call = await axios.post(
                    AZURE_ENDPOINT,
                    // prompt engineering 
                    { "messages": [{"role": "user", "content": `Please get me a short summary (max. 2 sentences) of this article:${text} Don't answer with sure! or something like that. Please get straight into the point. And all of your result should be in English
                        if the articles sounds like an advertisement OR not relevant to themes like Electric autos or eco system, please answer me with string "WRONG"`
                    }], },
                );
                const responseMessage = api_call.data.choices[0].message.content;
                result.push(responseMessage);
            } catch (error:any) {
                console.error('Error:', error.response?.data || error.message);
            }
        }
        return result
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

export {basicAIService}