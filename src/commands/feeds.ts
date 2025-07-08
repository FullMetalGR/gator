import { CommandHandler } from "./commands";
import { getAllFeedsWithUsers } from "../lib/db/queries/feeds";

export async function handlerFeeds(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const feedsWithUsers = await getAllFeedsWithUsers();

  if (feedsWithUsers.length === 0) {
    console.log("No feeds found in the database.");
    return;
  }

  console.log("All feeds in the database:");
  console.log("=" .repeat(80));
  
  feedsWithUsers.forEach((feed, index) => {
    console.log(`${index + 1}. ${feed.name}`);
    console.log(`   URL: ${feed.url}`);
    console.log(`   Created by: ${feed.userName}`);
    console.log(`   Created: ${feed.createdAt}`);
    console.log(`   Updated: ${feed.updatedAt}`);
    console.log("");
  });
} 