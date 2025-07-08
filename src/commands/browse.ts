import { UserCommandHandler } from "../lib/middleware";
import { getPostsForUser } from "../lib/db/queries/posts";
import { users } from "../lib/db/schema";

type User = typeof users.$inferSelect;

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]): Promise<void> {
  let limit = 2; // Default limit
  
  if (args.length > 0) {
    const limitArg = parseInt(args[0], 10);
    if (isNaN(limitArg) || limitArg < 1) {
      throw new Error(`Invalid limit: ${args[0]}. Must be a positive number.`);
    }
    limit = limitArg;
  }
  
  // Get posts for the user
  const posts = await getPostsForUser(user.id, limit);
  
  if (posts.length === 0) {
    console.log("No posts found. Try following some feeds and running the aggregator!");
    return;
  }
  
  console.log(`Latest ${posts.length} posts from feeds you follow:`);
  console.log("=" .repeat(80));
  
  posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`);
    console.log(`   Feed: ${post.feedName}`);
    console.log(`   URL: ${post.url}`);
    if (post.publishedAt) {
      console.log(`   Published: ${post.publishedAt.toLocaleDateString()} ${post.publishedAt.toLocaleTimeString()}`);
    }
    if (post.description) {
      // Truncate description if it's too long
      const truncatedDesc = post.description.length > 100 
        ? post.description.substring(0, 100) + "..."
        : post.description;
      console.log(`   ${truncatedDesc}`);
    }
    console.log("");
  });
} 