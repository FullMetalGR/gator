import { getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds";
import { createPost, getPostByUrl } from "./db/queries/posts";
import { fetchFeed } from "./rss";
import { parseRSSDate } from "./dateUtils";

export async function scrapeFeeds() {
  // Get the next feed to fetch
  const feed = await getNextFeedToFetch();
  
  if (!feed) {
    console.log("No feeds to fetch. Add some feeds first!");
    return;
  }
  
  console.log(`\nFetching: ${feed.name} (${feed.url})`);
  
  try {
    // Mark the feed as fetched first to prevent race conditions
    await markFeedFetched(feed.id);
    
    // Fetch the RSS feed
    const rssData = await fetchFeed(feed.url);
    
    let newPostsCount = 0;
    
    // Process each post
    for (const item of rssData.channel.item) {
      try {
        // Check if post already exists
        const existingPost = await getPostByUrl(item.link);
        if (existingPost) {
          continue; // Skip if already exists
        }
        
        // Parse the published date
        const publishedAt = parseRSSDate(item.pubDate);
        
        // Create the post
        await createPost(
          item.title,
          item.link,
          item.description,
          publishedAt,
          feed.id
        );
        
        newPostsCount++;
        
      } catch (error) {
        console.error(`Error saving post "${item.title}": ${error instanceof Error ? error.message : error}`);
      }
    }
    
    console.log(`Saved ${newPostsCount} new posts from ${feed.name}`);
    
  } catch (error) {
    console.error(`Error fetching ${feed.name}: ${error instanceof Error ? error.message : error}`);
  }
}

export function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  
  if (!match) {
    throw new Error(`Invalid duration format: ${durationStr}. Use format like 1s, 1m, 1h, 1000ms`);
  }
  
  const value = parseInt(match[1], 10);
  const unit = match[2];
  
  switch (unit) {
    case 'ms':
      return value;
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
} 