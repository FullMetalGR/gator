import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { eq, and } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
  // First insert the feed follow record
  const [newFeedFollow] = await db.insert(feedFollows).values({
    userId: userId,
    feedId: feedId
  }).returning();

  // Then get the feed follow with related feed and user information
  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedName: feeds.name,
      feedUrl: feeds.url,
      userName: users.name
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.id, newFeedFollow.id));

  return result;
}

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      feedName: feeds.name,
      feedUrl: feeds.url,
      userName: users.name
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));

  return result;
}

export async function getFeedFollowByUserAndFeed(userId: string, feedId: string) {
  const [result] = await db
    .select()
    .from(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)));
  
  return result;
}

export async function deleteFeedFollowByUserAndFeed(userId: string, feedId: string) {
  const [result] = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
    .returning();
  
  return result;
} 