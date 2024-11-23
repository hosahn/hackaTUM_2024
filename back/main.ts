import { basicAIService } from "./src/services/basicAI";

async function main() {
    console.log("Running script...");
    //const prompt = "The style should be futuristic and modern. The image should be of a car with a sleek design, preferably a sports car. The car should be electric and have a futuristic look. The background should be a cityscape with tall buildings and bright lights. The image should be high quality and visually appealing.";
    const prompt = "Create an image showing a modern, futuristic battery manufacturing plant under construction, symbolizing resilience and innovation. The scene should depict a balance of financial and industrial themes: include cranes and workers actively building a sleek, sustainable factory, with banners of major stakeholders like Volkswagen, Goldman Sachs, and BMW subtly displayed. In the background, highlight a clean, eco-friendly Scandinavian landscape with wind turbines and lush greenery. Additionally, show a digital representation of a financial lifeline, such as floating dollar symbols connecting to the plant, emphasizing the recent financial support. The atmosphere should be hopeful and forward-looking, with clear skies and sunlight shining over the facility.";
    
    //var result = await basicAIService.generateImage(prompt);
    var result = await basicAIService.generateMedia(["e-auto", "conflict", "eco system"]);
    console.log(result)
}

main().catch((error) => {
    console.error("Error running script:", error);
});