import RSSParser from 'rss-parser';

// Define types for Feed and Topic
interface Topic {
  title: string;
  link: string;
  pubDate: string | undefined;
  source: string | undefined;
  content: string | undefined;
}

interface FeedOptions {
  url?: string;
  xml?: string;
}

class Aggregator {
  private parser: RSSParser;

  constructor() {
    this.parser = new RSSParser();
  }

  /**
   * Fetch topics from an RSS feed, either by URL or from an XML string.
   * @param options - Options object containing `url` or `xml`.
   * @returns Promise<Topic[]> - A list of parsed topics.
   */
  async fetchTopics(options: FeedOptions): Promise<Topic[]> {
    try {
      let feed;

      // Fetch and parse RSS feed based on input
      if (options.url) {
        feed = await this.parser.parseURL(options.url);
      } else if (options.xml) {
        feed = await this.parser.parseString(options.xml);
      } else {
        throw new Error('Either a URL or XML string must be provided');
      }

      // Extract topics from feed
      const topics: Topic[] = feed.items.map(item => ({
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate,
        source: feed.title || 'Unknown Source',
        content: item.content || item.contentSnippet || ''
      }));

      return topics;
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw new Error('Failed to fetch topics from RSS feed');
    }
  }
}

export default Aggregator;
