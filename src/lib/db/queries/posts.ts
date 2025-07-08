import { db } from "..";
import { posts, feeds, feedFollows } from "../schema";
import { eq, desc, and } from "drizzle-orm";

export async function createPost(title: string, url: string, description: string | null, publishedAt: Date | null, feedId: string) {
  const [result] = await db.insert(posts).values({
    title: title,
    url: url,
    description: description,
    publishedAt: publishedAt,
    feedId: feedId
  }).returning();
  return result;
}

export async function getPostsForUser(userId: string, limit: number = 10) {
  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      feedName: feeds.name,
      feedUrl: feeds.url
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feeds.id, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
    .limit(limit);
  
  return result;
}

export async function getPostByUrl(url: string) {
  const [result] = await db.select().from(posts).where(eq(posts.url, url));
  return result;
} 