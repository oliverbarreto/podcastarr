import { migrate } from "drizzle-orm/libsql/migrator"
import db from "./drizzle"
import * as fs from "fs/promises"
import * as path from "path"

const runMigrations = async () => {
  try {
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })

    // Run migrations
    console.log("Running migrations...")
    await migrate(db, { migrationsFolder: "./src/lib/db/migrations" })
    console.log("Migrations completed successfully!")
  } catch (error) {
    console.error("Error during database setup:", error)
    process.exit(1)
  }
}

runMigrations()
