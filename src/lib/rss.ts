import { XMLParser } from 'fast-xml-parser';

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  // Fetch the feed data
  const response = await fetch(feedURL, {
    headers: {
      'User-Agent': 'gator'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
  }

  const xmlText = await response.text();

  // Parse the XML
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  });
  
  const parsedData = parser.parse(xmlText);

  // Extract the channel field
  if (!parsedData.rss || !parsedData.rss.channel) {
    throw new Error('Invalid RSS feed: missing channel element');
  }

  const channel = parsedData.rss.channel;

  // Extract metadata
  if (!channel.title || !channel.link || !channel.description) {
    throw new Error('Invalid RSS feed: missing required channel metadata (title, link, or description)');
  }

  const title = channel.title;
  const link = channel.link;
  const description = channel.description;

  // Extract feed items
  let items: RSSItem[] = [];
  
  if (channel.item) {
    // Ensure item is an array
    const itemArray = Array.isArray(channel.item) ? channel.item : [channel.item];
    
    items = itemArray
      .filter((item: any) => 
        item.title && 
        item.link && 
        item.description && 
        item.pubDate
      )
      .map((item: any) => ({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate
      }));
  }

  // Assemble the result
  return {
    channel: {
      title,
      link,
      description,
      item: items
    }
  };
} 