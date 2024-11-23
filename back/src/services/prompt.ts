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
    const formattedContents = article_contents
        .map((content, index) => `${index + 1}. ${content}`)
        .join("\n");

    if (language === Language.German) {
        const prompt = `Du bist ein Autor für eine deutsche Nachrichtenwebsite für Elektrofahrzeuge. Schreibe einen Artikel mit ${length} Wörtern. Der Stil sollte ein formeller Nachrichtenbeitrag sein. Versuche die folgenden Schlüsselwörter einzubeziehen: ${keywords.join(", ")}.\n\n` +
            `Deine Antwort muss valides JSON sein. Es soll einen Titel haben (json: title), eine Unterüberschrift (json: subheadline), eine knappe und aufmerksamkeitserregende Einleitung (json: lead), und den eigentlichen Hauptteil (json: body).\n\n` +
            `Verwende die folgenden Texte als Vorlage:\n${formattedContents}`

        return { language, content: prompt };
    }

    const prompt = `You are a writer for a German news website about electric vehicles. Write it in english. Write an article with ${length} words. The style should be a formal news report. Try to include the following keywords: ${keywords.join(", ")}.\n\n` +
        `Your response smust be valid JSON. It should have a title (json: title), a subheadline (json: subheadline), a concise and attention-grabbing introduction (json: lead), and the main body of the article (json: body).\n\n` +
        `Use the following texts as a template:\n${formattedContents}`;

    return { language, content: prompt };
}


export { Language, Prompt, ArticleLength, createArticleGenerationPrompt };
