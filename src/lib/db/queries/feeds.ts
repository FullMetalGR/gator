import { db } from "..";
import { feeds, users } from "../schema";
import { eq, sql } from "drizzle-orm";

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db.insert(feeds).values({ 
    name: name, 
    url: url, 
    userId: userId 
  }).returning();
  return result;
}

export async function getFeedsByUserId(userId: string) {
  const result = await db.select().from(feeds).where(eq(feeds.userId, userId));
  return result;
}

export async function getFeedByUrl(url: string) {
  const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
  return result;
}

export async function getAllFeedsWithUsers() {
  const result = await db
    .select({
      id: feeds.id,
      name: feeds.name,
      url: feeds.url,
      createdAt: feeds.createdAt,
      updatedAt: feeds.updatedAt,
      userName: users.name,
      userId: users.id
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id));
  return result;
}

export async function markFeedFetched(feedId: string) {
  const [result] = await db
    .update(feeds)
    .set({
      lastFetchedAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(feeds.id, feedId))
    .returning();
  return result;
}

export async function getNextFeedToFetch() {
  const [result] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} NULLS FIRST, ${feeds.lastFetchedAt} ASC`)
    .limit(1);
  return result;
} 