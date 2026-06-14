import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDb, getTableName } from "../db/dynamo";
import { logger } from "@/lib/logger";

const RATE_LIMIT_TABLE = getTableName("rate-limits");

export async function checkRateLimit(ip: string, maxRequests: number = 5, windowSeconds: number = 300): Promise<boolean> {
  const key = `login_attempts_${ip}`;
  const now = Math.floor(Date.now() / 1000);
  
  try {
    const { Item } = await dynamoDb.send(new GetCommand({
      TableName: RATE_LIMIT_TABLE,
      Key: { Key: key }
    }));

    if (!Item) {
      await dynamoDb.send(new PutCommand({
        TableName: RATE_LIMIT_TABLE,
        Item: {
          Key: key,
          Count: 1,
          ExpiresAt: now + windowSeconds
        }
      }));
      return true;
    }

    if (Item.Count >= maxRequests) {
      if (now > Item.ExpiresAt) {
        await dynamoDb.send(new PutCommand({
          TableName: RATE_LIMIT_TABLE,
          Item: {
            Key: key,
            Count: 1,
            ExpiresAt: now + windowSeconds
          }
        }));
        return true;
      }
      logger.warn("rate_limit_exceeded", { ip, count: Item.Count });
      return false;
    }

    await dynamoDb.send(new UpdateCommand({
      TableName: RATE_LIMIT_TABLE,
      Key: { Key: key },
      UpdateExpression: "SET #c = #c + :inc",
      ExpressionAttributeNames: { "#c": "Count" },
      ExpressionAttributeValues: { ":inc": 1 }
    }));
    
    return true;
  } catch (error) {
    logger.error("rate_limit_error", { ip, error: String(error) });
    // If DynamoDB is not provisioned or there's a temporary error, fail open
    return true; 
  }
}
