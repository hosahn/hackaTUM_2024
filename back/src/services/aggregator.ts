import RSSParser from 'rss-parser';

interface Topic {
    id: number;
    title: string;
    link: string;
    pubDate: string | undefined;
    source: string | undefined;
    content: string | undefined;
}

const blacklist = ["https://www.faz.net/", "https://www.bild.de/", "https://www.kn-online.de/", "https://www.n-tv.de/"]

class Aggregator {
    private parser: RSSParser;

    constructor() {
        this.parser = new RSSParser();
    }

    /**
     * Fetch topics from an RSS feed, either by URL string.
     * @param urls - Array of URLs to fetch RSS feeds.
     * @returns Promise<Topic[]> - A list of parsed topics.
     */
    async fetchTopics(urls: string[]): Promise<Topic[]> {
        // Use Promise.all to fetch all feeds concurrently
        const feeds = await Promise.all(urls.map(url => this.parser.parseURL(url)));
        console.log("")
        let id = 0;
        let topics: Topic[] = feeds.flatMap(feed =>
            feed.items.map(item => ({
                id: id++,
                title: item.title || 'Untitled',
                link: item.link || '',
                pubDate: item.pubDate,
                source: feed.title || 'Unknown Source',
                content: item.content || item.contentSnippet || ''
            }))
        );
        const topics_sanitized: Topic[] = topics.filter((feed) => {
            return !blacklist.some(blacklistedUrl => feed.link && feed.link.includes(blacklistedUrl));
        });

        return topics_sanitized;
    }
}

export { Aggregator, Topic };
