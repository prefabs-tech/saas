import { existsSync, readFileSync } from "node:fs";

/**
 * Reads and parses pre-migration queries from a SQL file.
 * Queries should be separated by semicolons.
 *
 * @param filePath - Path to the SQL file (must have .sql extension)
 * @returns Array of SQL query strings, or empty array if file doesn't exist
 * @throws Error if file path doesn't have .sql extension
 */
const readPreMigrationQueries = (filePath: string): string[] => {
  if (!filePath.endsWith(".sql")) {
    throw new Error(
      `Pre-migration queries file must have .sql extension. Received: ${filePath}`,
    );
  }

  if (!existsSync(filePath)) {
    return [];
  }

  const fileContent = readFileSync(filePath, "utf8");

  // Split by semicolon, remove empty queries and trim whitespace
  return fileContent
    .split(";")
    .map((query) => query.trim())
    .filter((query) => query.length > 0 && !query.startsWith("--"));
};

export default readPreMigrationQueries;
