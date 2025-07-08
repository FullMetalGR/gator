import { UserCommandHandler } from "../lib/middleware";
import { getFeedFollowsForUser } from "../lib/db/queries/feedFollows";
import { users } from "../lib/db/schema";

type User = typeof users.$inferSelect;

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]): Promise<void> {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  // Get all feeds the user is following
  const feedFollows = await getFeedFollowsForUser(user.id);
  
  if (feedFollows.length === 0) {
    console.log(`You are not following any feeds yet.`);
    console.log(`Use 'addfeed' to create a new feed or 'follow' to follow an existing feed.`);
    return;
  }
  
  console.log(`You are following ${feedFollows.length} feed(s):`);
  console.log("=" .repeat(60));
  
  feedFollows.forEach((follow, index) => {
    console.log(`${index + 1}. ${follow.feedName}`);
    console.log(`   URL: ${follow.feedUrl}`);
    console.log(`   Followed: ${follow.createdAt}`);
    console.log("");
  });
} 