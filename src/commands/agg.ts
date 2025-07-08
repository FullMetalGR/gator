import { CommandHandler } from "./commands";
import { scrapeFeeds, parseDuration } from "../lib/aggregator";

export async function handlerAgg(cmdName: string, ...args: string[]): Promise<void> {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_between_reqs>`);
  }

  const [timeBetweenReqs] = args;
  
  try {
    const timeBetweenRequests = parseDuration(timeBetweenReqs);
    
    // Convert back to human-readable format for display
    const seconds = Math.floor(timeBetweenRequests / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const displayTime = minutes > 0 ? `${minutes}m${remainingSeconds}s` : `${seconds}s`;
    
    console.log(`Collecting feeds every ${displayTime}`);
    console.log("Press Ctrl+C to stop the aggregator");
    
    // Start the first scrape immediately
    scrapeFeeds().catch(handleError);
    
    // Set up the interval for continuous scraping
    const interval = setInterval(() => {
      scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);
    
    // Handle graceful shutdown
    await new Promise<void>((resolve) => {
      process.on("SIGINT", () => {
        console.log("\nShutting down feed aggregator...");
        clearInterval(interval);
        resolve();
      });
    });
    
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in aggregator: ${error.message}`);
    } else {
      console.error(`Error in aggregator: ${error}`);
    }
    throw error;
  }
}

function handleError(error: unknown) {
  console.error(`Aggregation error: ${error instanceof Error ? error.message : error}`);
} 