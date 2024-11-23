import dotenv from 'dotenv';
import axios from "axios";

dotenv.config();

const AZURE_ENDPOINT = 'https://hackatum-2024.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-01-preview&API-KEY=2bBZn5pMnk003jcxoOLmZV9lKLflifdjC8mOOSpep0wB9lIaDoAyJQQJ99AKACfhMk5XJ3w3AAABACOGPo7V&content-type=application/json';

class basicAIService{
    
    static async searchArticles(input:string){

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
}

export {basicAIService}