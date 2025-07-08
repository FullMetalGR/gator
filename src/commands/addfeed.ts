import { UserCommandHandler } from "../lib/middleware";
import { createFeed, getFeedByUrl } from "../lib/db/queries/feeds";
import { createFeedFollow } from "../lib/db/queries/feedFollows";
import { feeds, users } from "../lib/db/schema";

type Feed = typeof feeds.$inferSelect;
type User = typeof users.$inferSelect;

export function printFeed(feed: Feed, user: User) {
  console.log("Feed created successfully!");
  console.log(`ID: ${feed.id}`);
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`User: ${user.name} (${user.id})`);
  console.log(`Created: ${feed.createdAt}`);
  console.log(`Updated: ${feed.updatedAt}`);
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]): Promise<void> {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <name> <url>`);
  }

  const [name, url] = args;
  
  // Check if feed with this URL already exists
  const existingFeed = await getFeedByUrl(url);
  if (existingFeed) {
    throw new Error(`A feed with URL '${url}' already exists`);
  }
  
  // Create the new feed
  const newFeed = await createFeed(name, url, user.id);
  
  // Automatically create a feed follow record for the current user
  const feedFollow = await createFeedFollow(user.id, newFeed.id);
  
  // Print the feed details
  printFeed(newFeed, user);
  
  // Print the follow information
  console.log(`You are now following '${feedFollow.feedName}'`);
} 