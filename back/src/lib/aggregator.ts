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
        let id = 0;

        const feeds = await Promise.all(
            urls.map(async (url) => {
                try {
                    // Attempt to parse the RSS feed
                    const feed = await this.parser.parseURL(url);
                    // Optional: Log success
                    return feed;
                } catch (error) {
                    // Handle and log parsing errors
                    console.error(`Error parsing RSS feed from ${url}:`, error);

                    // Return `null` for failed fetches
                    return null;
                }
            })
        );

        // Filter out invalid feeds (null values)
        const validFeeds = feeds.filter((feed) => feed !== null);
        // Flatten the items and sanitize the data
        let topics: Topic[] = validFeeds.flatMap(feed =>
            feed!.items.map(item => ({
                id: id++,
                title: item.title || 'Untitled',
                link: item.link || '',
                pubDate: item.pubDate,
                source: feed!.title || 'Unknown Source',
                content: item.content || item.contentSnippet || ''
            }))
        );
        // Filter out blacklisted links
        const topics_sanitized: Topic[] = topics.filter((topic) =>
            !blacklist.some(blacklistedUrl => topic.link && topic.link.includes(blacklistedUrl))
        );
        return topics_sanitized;
    }
}


export { Aggregator, Topic };
