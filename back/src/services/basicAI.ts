import dotenv from 'dotenv';
import axios from "axios";
import { Topic } from './aggregator';
import { GenericUtilService } from './genericUtil';
import { ArticleLength, Language, createArticleGenerationPrompt } from './prompt';
dotenv.config();

interface Summary {
    "category":string,
    "summary":string,
    "idx":number
}

const AZURE_ENDPOINT = process.env.GPT_4o || "none"
const AZURE_IMAGE_ENDPOINT = process.env.GPT_IMAGE || "none"

class basicAIService {
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
    static async generateArticles(urls: string[], keywords: string[], word_count: number, language: Language) {
        const contents = await Promise.all(urls.map(url =>
            GenericUtilService.extractArticleFromUrl(url)
        ));
        // Drop articles with no content
        const filtered_contents = contents.filter(content => content !== null) as string[];
        const prompt = createArticleGenerationPrompt(filtered_contents, keywords, word_count, Language.German);
        console.log("Prompt:", prompt.content);

        try {
            const api_call = await axios.post(
                AZURE_ENDPOINT,
                { "messages": [{ "role": "user", "content": prompt.content }], },
            );

            const responseMessage = api_call.data.choices[0].message.content;
            return responseMessage;
        } catch (error: any) {
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
        let input_clustring: string[] = [
            "Ecosystems are interconnected networks of living organisms and their physical environments, forming a balanced system of mutual dependence.",
            "Deforestation and pollution disrupt ecosystems, threatening biodiversity and natural processes.",
            "Electric cars rely on rechargeable batteries and emit no tailpipe pollutants, reducing air pollution.",
            "The transition to electric vehicles is accelerating, driven by advancements in battery technology and government incentives.",
            "CO2-neutral refers to balancing carbon emissions with removal or offsetting actions, achieving net-zero emissions.",
            "Renewable energy sources like solar and wind are essential for creating CO2-neutral energy systems.",
            "Renewable energy harnesses resources like sunlight, wind, and water to provide sustainable power without depleting Earth's reserves.",
            "Wind turbines and solar panels have become the leading symbols of the renewable energy revolution.",
            "Climate change is driven by human activities, primarily the burning of fossil fuels, leading to global temperature rise and severe weather events.",
            "Governments worldwide are adopting climate action policies to limit warming to 1.5°C as part of the Paris Agreement.",
            "Ecosystems are vital for sustaining life, providing services like clean air, water, and fertile soil.",
            "Electric cars are a cornerstone of sustainable transportation, helping reduce greenhouse gas emissions.",
            "Achieving CO2 neutrality is essential to combat climate change and create a sustainable future.",
            "Renewable energy sources, such as wind and solar, are replacing fossil fuels in the global energy mix.",
            "Deforestation and urbanization disrupt natural habitats, threatening biodiversity and ecosystem balance.",
            "Battery technology advancements are driving electric vehicle efficiency and adoption worldwide.",
            "Transitioning to CO2-neutral operations requires innovation in renewable energy and carbon offset solutions.",
            "Global warming caused by human activity is leading to more extreme weather patterns and rising sea levels.",
            "Smart grids and energy storage systems are enhancing the reliability of renewable power sources.",
            "Countries are committing to net-zero goals, aiming to reduce carbon emissions and invest in green technologies."
          ];
        // Limit the number of articles to process
        let length = input.length > 20 ? 20 : input.length;
        for (let i = 0; i < length; i++) {
            console.log(i)
            let text = input[i].content;
            let messages = [{ "role": "user", "content": `summarize this article: ${text}` }];
    
            try {
                // First API call to summarize the article
                const api_call = await axios.post(AZURE_ENDPOINT, { "messages": messages });
                let summary:string  = api_call.data.choices[0]?.message?.content;
    
                messages.push({ "role": "system", "content": summary });
                // Second API call to evaluate the article based on 11 criteria
                messages.push({ "role": "user", "content": `
                    if an article does look like an advertisement, please reply directly with "no"
                    if an article promotes a product like headset or ssd, please reply directly with "no"
                    if an article makes a "special offer", please reply directly with "no"
                    Also, if an article is not relevant to themes like electric cars or electric bikes, please reply directly with "no"
                    If it's okay, Answer 'yes', else 'no' Please do not provide additional explanation.
                    You dont have to analyse your result.` });
                const api_call2 = await axios.post(AZURE_ENDPOINT, { "messages": messages });

                let responseMessage = api_call2.data.choices[0]?.message?.content;
                if (responseMessage.includes("no") || responseMessage.includes("No")) {
                    continue
                }
                if (responseMessage) {
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

                result.push({"category":category, "summary":summary, "idx":input[i].id})
                
                input_clustring.push(summary)

            } catch (error: any) {
                continue
            }
        }

        const clustring_result = await axios.post('http://localhost:8000/api', {data:input_clustring})
        console.log(clustring_result)

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

    static async automatedQualityCheck(result: string) {
        // TODO implement QC mecnahism
        return result;
    }
}

export {basicAIService, Summary}