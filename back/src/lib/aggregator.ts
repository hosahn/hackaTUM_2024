import RSSParser from 'rss-parser';

// Define types for Feed and Topic
interface Topic {
  id:number;
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
   * Fetch topics from an RSS feed, either by URL or from an XML string.
   * @param options - Options object containing `url` or `xml`.
   * @returns Promise<Topic[]> - A list of parsed topics.
   */
  async fetchTopics(options: string[]): Promise<Topic[]> {
      let feed = [];
      for(let i = 0 ; i < options.length; i++){
        let tmp = await this.parser.parseURL(options[i]);
        feed.push(tmp) 
      }

      // Fetch and parse RSS feed based on input
      // Extract topics from feed
      var id = 0;
      const topics: Topic[] = feed.map(item => ({
        id: id++,
        title: item.title || 'Untitled',
        link: item.link || '',
        pubDate: item.pubDate,
        source: 'Unknown Source',
        content: item.content || item.contentSnippet || ''
      }));

      return topics;
  
  }
}

export {Aggregator};
