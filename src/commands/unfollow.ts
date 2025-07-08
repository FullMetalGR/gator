import { UserCommandHandler } from "../lib/middleware";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { deleteFeedFollowByUserAndFeed, getFeedFollowByUserAndFeed } from "../lib/db/queries/feedFollows";
import { users } from "../lib/db/schema";

type User = typeof users.$inferSelect;

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <url>`);
  }

  const [url] = args;
  
  // Find the feed by URL
  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`No feed found with URL '${url}'`);
  }
  
  // Check if user is following this feed
  const existingFollow = await getFeedFollowByUserAndFeed(user.id, feed.id);
  if (!existingFollow) {
    throw new Error(`You are not following '${feed.name}'`);
  }
  
  // Delete the feed follow record
  const deletedFollow = await deleteFeedFollowByUserAndFeed(user.id, feed.id);
  
  // Print success message
  console.log(`You have unfollowed '${feed.name}'`);
  console.log(`Feed URL: ${feed.url}`);
  console.log(`Unfollowed at: ${new Date().toISOString()}`);
} 