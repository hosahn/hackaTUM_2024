import dotenv from 'dotenv';
import axios from "axios";
import { Topic } from './aggregator';
import { GenericUtilService } from './genericUtil';
import { ArticleLength, Language, createArticleGenerationPrompt } from './prompt';
dotenv.config();

interface Summary {
    "category": string,
    "summary": string,
    "idx": number
}

interface DallEResponse {
    data: {
        url: string;
    }[];
}

const AZURE_ENDPOINT = process.env.GPT_4o || "none"
const AZURE_IMAGE_ENDPOINT = process.env.GPT_IMAGE || "none"

class basicAIService {


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
        // Limit the number of articles to process
        let length = input.length > 20 ? 20 : input.length;
        for (let i = 0; i < length; i++) {
            console.log(i)
            let text = input[i].content;
            let messages = [{ "role": "user", "content": `summarize this article: ${text}` }];

            try {
                // First API call to summarize the article
                const api_call = await axios.post(AZURE_ENDPOINT, { "messages": messages });
                let summary: string = api_call.data.choices[0]?.message?.content;

                messages.push({ "role": "system", "content": summary });
                // Second API call to evaluate the article based on 11 criteria
                messages.push({
                    "role": "user", "content": `
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
                messages.push({ "role": "user", "content": `Which of the following topics is the article primarily focused on? Deals, New launch, politics, Environment, Company news, electric cars,Future technology, Two-wheeler Answer with maximal 3 categories, seperate categories with ','` });
    
                const api_call4 = await axios.post(AZURE_ENDPOINT, { "messages": messages });
                let category: string = api_call4.data.choices[0]?.message?.content;
                category = category.toLowerCase();

                result.push({"category":category, "summary":summary, "idx":input[i].id})

            } catch (error: any) {
                continue
            }
        }

        //const clustring_result = await axios.post('http://localhost:8000/api', {data:input_clustring})
        //console.log(clustring_result)

        return result;
    }

    /**
    * Generate one image based on a prompt with size 1792x1024. In case of failure, a backup image is returned.
    * @param prompt - The prompt to generate an image from.
    * @returns string - The URL of the generated image.
    */
    static async generateSingleImage(prompt: string): Promise<string> {
        try {
            const response = await axios.post<DallEResponse>(
                AZURE_IMAGE_ENDPOINT,
                {
                    prompt: prompt,
                    n: 1,
                    size: "1792x1024"
                },
            );

            const imageUrl = response.data.data[0]?.url;
            if (imageUrl) {
                return imageUrl;
            } else {
                // TODO handle faults here so it does not crash the server
                console.error("Error: No image URL in API response");
                throw new Error("Failed to generate image");
            }
        } catch (error: any) {
            console.error('Error:', error.response?.data || error.message);
            console.log("Error occured when generating an image, respond with backup image");
            const existingImgUrl = "https://dalleprodsec.blob.core.windows.net/private/images/b24893dd-a669-468b-8915-1a1f72608d86/generated_00.png?se=2024-11-24T19%3A15%3A41Z&sig=Xm0%2BP7ZZyb11KR6eDboRlzfGkalRnGF5WzwrgD6h0qw%3D&ske=2024-11-30T17%3A06%3A49Z&skoid=e52d5ed7-0657-4f62-bc12-7e5dbb260a96&sks=b&skt=2024-11-23T17%3A06%3A49Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02";
            return existingImgUrl;
        }
    }

    static async generateMedia(keywords: string[]) {
        let imageList = []

        try {
            for (let i = 0; i < 3; i++) {
                const api_call = await axios.post(
                    AZURE_IMAGE_ENDPOINT,
                    {
                        "prompt": "electric car",
                        "n": 1,
                        "quality": "standard"
                    },
                );
                var result = api_call.data.data[0].url
                console.log(result)
                imageList.push(result);
            }
            return imageList;
        } catch (error: any) {
            console.error('Error:', error.response?.data || error.message);
        }
        return ""
    }

    static async automatedQualityCheck(result: string) {
        // TODO implement QC mecnahism
        const api_call = await axios.post(
            AZURE_ENDPOINT,
            { "messages": [{ "role": "user", "content": `please analyse this string of opinion and give me the number between 0 to 100 of positive opinion score. Don't have to analyse it, just give me the number, only number. ${result}` }], },
        );
        let summary: string = api_call.data.choices[0]?.message?.content;
        return summary;
    }
}

export { basicAIService, Summary }