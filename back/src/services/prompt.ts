import { GenericUtilService } from './genericUtil';

enum Language {
    English = "en",
    German = "de"
}

interface Prompt {
    language: Language;
    content: string;
}

enum ArticleLength {
    SHORT = 250,
    MEDIUM = 500,
    LONG = 1000
}

function createArticleGenerationPrompt(article_contents: string[], keywords: string[], length: number, language: Language): Prompt {
    if (language === Language.German) {
        const formattedContents = article_contents
            .map((content, index) => `${index + 1}. ${content}`)
            .join("\n");
        const prompt = `Du bist ein Autor für eine deutsche Nachrichtenwebsite für Elektrofahrzeuge. Schreibe einen Artikel mit ${length} Wörtern. Der Stil sollte ein formeller Nachrichtenbeitrag sein. Versuche die folgenden Schlüsselwörter einzubeziehen: ${keywords.join(", ")}.\n\n` +
            `Verwende die folgenden Texte als Vorlage:\n${formattedContents}`
        console.log("Prompt:", prompt);
        return { language, content: prompt };
    }

    const prompt = `You are a writer for a news website for electrical vehicles. Create a ${length} word article. The style should be a formal news post. Try to include the following keywords: ${keywords.join(", ")}`;

    return { language, content: prompt };
}


export { Language, Prompt, ArticleLength, createArticleGenerationPrompt };
