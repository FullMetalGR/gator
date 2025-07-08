# Gator 🐊 - RSS Feed Aggregator

Gator is a TypeScript CLI tool that allows you to aggregate RSS feeds from across the internet, store posts in a PostgreSQL database, and browse them directly in your terminal.

## Features

- **Add RSS feeds** from your favorite blogs, news sites, and podcasts
- **Follow/unfollow feeds** that other users have added
- **Continuous aggregation** - automatically fetches new posts in the background
- **Browse posts** from feeds you follow with rich formatting
- **User management** - multiple users can share feeds while maintaining their own following lists
- **Real-time updates** - posts are fetched and stored automatically

## Prerequisites

Before running Gator, you'll need:

- **Node.js** (version 18 or higher)
- **PostgreSQL** database server
- **Git** (for version control)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd gator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your configuration file:**
   
   Create a file called `.gatorconfig.json` in your home directory:
   ```bash
   # On Linux/macOS
   touch ~/.gatorconfig.json
   
   # On Windows
   type nul > %USERPROFILE%\.gatorconfig.json
   ```
   
   Add your database connection string and initial user:
   ```json
   {
     "db_url": "postgresql://username:password@localhost:5432/gator_db",
     "current_user_name": "your_username"
   }
   ```
   
   Replace the database URL with your actual PostgreSQL connection string.

4. **Set up the database:**
   ```bash
   # Generate database migrations
   npm run generate
   
   # Run migrations to create tables
   npm run migrate
   ```

## Usage

### Getting Started

1. **Register a user:**
   ```bash
   npm start register your_username
   ```

2. **Add your first RSS feed:**
   ```bash
   npm start addfeed "TechCrunch" "https://techcrunch.com/feed/"
   ```

3. **Start the aggregator to fetch posts:**
   ```bash
   npm start agg "5m"
   ```
   This will fetch posts every 5 minutes. You can use `1s`, `30s`, `1m`, `1h` etc.

4. **Browse the latest posts:**
   ```bash
   npm start browse
   ```

### Available Commands

#### User Management
- `register <username>` - Create a new user account
- `login <username>` - Switch to a different user
- `users` - List all users (current user is marked with `(current)`)
- `reset` - Delete all users and data (useful for testing)

#### Feed Management
- `addfeed <name> <url>` - Add a new RSS feed (automatically follows it)
- `feeds` - List all feeds in the database with their creators
- `follow <url>` - Follow an existing feed by URL
- `unfollow <url>` - Stop following a feed
- `following` - Show all feeds you're currently following

#### Content Browsing
- `browse [limit]` - Show latest posts from feeds you follow (default: 2 posts)
- `agg <interval>` - Start the feed aggregator (e.g., `agg "1m"` for every minute)

### Example Workflow

```bash
# 1. Register and login
npm start register alice
npm start login alice

# 2. Add some popular RSS feeds
npm start addfeed "TechCrunch" "https://techcrunch.com/feed/"
npm start addfeed "Hacker News" "https://news.ycombinator.com/rss"
npm start addfeed "Boot.dev Blog" "https://blog.boot.dev/index.xml"

# 3. Start the aggregator in one terminal
npm start agg "2m"

# 4. Browse posts in another terminal
npm start browse 5

# 5. Follow a feed that another user added
npm start follow "https://example.com/feed.xml"

# 6. Check what you're following
npm start following
```

### Configuration

The `.gatorconfig.json` file in your home directory contains:

- `db_url`: Your PostgreSQL connection string
- `current_user_name`: The currently logged-in user

The file is automatically updated when you use the `login` command.

### Database Schema

Gator uses the following main tables:
- **users** - User accounts
- **feeds** - RSS feeds with metadata
- **feed_follows** - Many-to-many relationship between users and feeds
- **posts** - Individual posts from RSS feeds

### Tips

- **Run the aggregator in the background** while using other commands in another terminal
- **Use reasonable intervals** for the aggregator (e.g., `5m` or `1h`) to avoid overwhelming RSS servers
- **Follow feeds created by other users** to discover new content
- **Use `browse` with a limit** to see more posts: `npm start browse 10`

### Stopping the Aggregator

When the aggregator is running, press `Ctrl+C` to stop it gracefully.

## Development

This project uses:
- **TypeScript** for type safety
- **Drizzle ORM** for database operations
- **PostgreSQL** for data storage
- **fast-xml-parser** for RSS parsing

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is for educational purposes. Feel free to use and modify as needed.

## Extending the Project

- Add sorting and filtering options to the browse command
- Add pagination to the browse command
- Add concurrency to the agg command so that it can fetch more frequently
- Add a search command that allows for fuzzy searching of posts
- Add bookmarking or liking posts
- Add a TUI that allows you to select a post in the terminal and view it in a more readable format (either in the terminal or open in a browser)
- Add an HTTP API (and authentication/authorization) that allows other users to interact with the service remotely
- Write a service manager that keeps the agg command running in the background and restarts it if it crashes
