import { UserCommandHandler } from "../lib/middleware";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowByUserAndFeed } from "../lib/db/queries/feedFollows";
import { users } from "../lib/db/schema";

type User = typeof users.$inferSelect;

export async function handlerFollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const [url] = args;
  
  // Find the feed by URL
  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`No feed found with URL '${url}'. Use 'addfeed' to create a new feed first.`);
  }
  
  // Check if user is already following this feed
  const existingFollow = await getFeedFollowByUserAndFeed(user.id, feed.id);
  if (existingFollow) {
    throw new Error(`You are already following '${feed.name}'`);
  }
  
  // Create the feed follow record
  const feedFollow = await createFeedFollow(user.id, feed.id);
  
  // Print success message
  console.log(`You are now following '${feedFollow.feedName}'`);
  console.log(`Feed URL: ${feedFollow.feedUrl}`);
  console.log(`User: ${feedFollow.userName}`);
  console.log(`Followed at: ${feedFollow.createdAt}`);
} 