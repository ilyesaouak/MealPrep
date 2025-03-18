// This script is a wrapper to run the seed-meals.js script with the correct environment variables

import { exec } from "child_process";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Read .env file
let envVars = {};
try {
  const envFile = readFileSync(join(rootDir, ".env"), "utf8");
  envFile.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      envVars[key.trim()] = value.trim();
    }
  });
} catch (error) {
  console.error("Error reading .env file:", error);
  process.exit(1);
}

// Check for required environment variables
const requiredVars = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];
for (const varName of requiredVars) {
  if (!envVars[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    console.error(
      "Please make sure your .env file contains all required variables.",
    );
    process.exit(1);
  }
}

// Build environment variables string
const envString = Object.entries(envVars)
  .map(([key, value]) => `${key}=${value}`)
  .join(" ");

// Run the seed script with environment variables
const command = `${envString} node scripts/seed-meals.js`;

console.log("Running seed script...");
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(stdout);
});
