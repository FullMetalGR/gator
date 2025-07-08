import { setUser, readConfig } from "../config";
import { createUser, getUserByName, deleteAllUsers, getUsers } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  
  // Check if user exists in database
  const existingUser = await getUserByName(userName);
  if (!existingUser) {
    throw new Error(`User '${userName}' does not exist`);
  }
  
  setUser(userName);
  console.log("User switched successfully!");
}

export async function handlerRegister(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  
  // Check if user already exists
  const existingUser = await getUserByName(userName);
  if (existingUser) {
    throw new Error(`User '${userName}' already exists`);
  }
  
  // Create the new user
  const newUser = await createUser(userName);
  
  // Set the current user in config
  setUser(userName);
  
  // Print success message and user data
  console.log(`User '${userName}' created successfully!`);
  console.log("User data:", newUser);
}

export async function handlerReset(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  try {
    await deleteAllUsers();
    console.log("Database reset successfully! All users have been deleted.");
  } catch (error) {
    console.error("Failed to reset database:", error);
    throw new Error("Database reset failed");
  }
}

export async function handlerUsers(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const users = await getUsers();
  const config = readConfig();
  const currentUser = config.currentUserName;

  if (users.length === 0) {
    console.log("No users found.");
    return;
  }

  users.forEach(user => {
    const isCurrent = user.name === currentUser ? " (current)" : "";
    console.log(`* ${user.name}${isCurrent}`);
  });
}
