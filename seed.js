const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const fs = require("fs");
const path = require("path");

// Load from .env.local if possible, else default
require('dotenv').config({ path: '.env.local' });

const client = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);

const dataPath = path.join(__dirname, "portfolio-data.json");
if (!fs.existsSync(dataPath)) {
  console.error("No portfolio-data.json found");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const tableName = "portfolio-data";
const ownerEmail = process.env.ADMIN_USERNAME || "admin@example.com";

async function seed() {
  console.log(`Seeding database for owner: ${ownerEmail}`);
  for (const [sectionId, sectionData] of Object.entries(data)) {
    try {
      await docClient.send(new PutCommand({
        TableName: tableName,
        Item: {
          OwnerEmail: ownerEmail,
          SectionID: sectionId,
          Data: sectionData,
          UpdatedAt: new Date().toISOString()
        }
      }));
      console.log(`Seeded section: ${sectionId}`);
    } catch (e) {
      console.error(`Error seeding ${sectionId}:`, e);
    }
  }
}

seed();
