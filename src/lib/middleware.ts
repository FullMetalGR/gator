import { CommandHandler } from "../commands/commands";
import { readConfig } from "../config";
import { getUserByName } from "./db/queries/users";
import { users } from "./db/schema";

type User = typeof users.$inferSelect;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    // Get the current user from config
    const config = readConfig();
    const currentUserName = config.currentUserName;
    
    if (!currentUserName) {
      throw new Error("No user is currently logged in. Please use the 'login' command first.");
    }
    
    // Get the current user from database
    const currentUser = await getUserByName(currentUserName);
    if (!currentUser) {
      throw new Error(`Current user '${currentUserName}' not found in database. Please login again.`);
    }
    
    // Call the original handler with the authenticated user
    await handler(cmdName, currentUser, ...args);
  };
} 