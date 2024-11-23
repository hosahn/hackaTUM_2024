import RSSParser from 'rss-parser';

interface Topic {
    id: number;
    title: string;
    link: string;
    pubDate: string | undefined;
    source: string | undefined;
    content: string | undefined;
}


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

        let id = 0;
        const topics: Topic[] = feeds.flatMap(feed =>
            feed.items.map(item => ({
                id: id++,
                title: item.title || 'Untitled',
                link: item.link || '',
                pubDate: item.pubDate,
                source: feed.title || 'Unknown Source',
                content: item.content || item.contentSnippet || ''
            }))
        );

        return topics;
    }
}

export { Aggregator };
