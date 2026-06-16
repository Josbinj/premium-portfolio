import { dynamoDb, getTableName } from "@/lib/db/dynamo";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const IS_DEV = process.env.NODE_ENV === "development";
// We default to a relative path for client-side fetching. Server-side will bypass fetch.
const API_BASE_URL = IS_DEV ? "http://localhost:3000/api" : "/api";

export async function fetchSectionData(sectionId: string) {
  if (typeof window === "undefined") {
    // SERVER-SIDE: Bypass API route and query DynamoDB directly
    try {
      const ownerEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_USERNAME || "admin@example.com";
      const { Item } = await dynamoDb.send(new GetCommand({
        TableName: getTableName("data"),
        Key: { 
          OwnerEmail: ownerEmail,
          SectionID: sectionId 
        }
      }));
      if (Item && Item.Data) {
        return { data: Item.Data };
      }
      return null;
    } catch (error) {
      console.warn(`Direct DB fetch error for ${sectionId}:`, error);
      return null; // Return null instead of crashing the page
    }
  }

  // CLIENT-SIDE: Fallback to API route
  try {
    const res = await fetch(`${API_BASE_URL}/portfolio/${sectionId}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch section ${sectionId}: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.warn(`Error fetching ${sectionId}:`, error);
    return null;
  }
}

export async function updateSectionData(sectionId: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/portfolio/${sectionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // Include Authorization header here when auth is implemented
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to update section ${sectionId}: ${res.statusText}`);
  }

  return await res.json();
}

export async function submitContactMessage(data: { name: string, email: string, subject: string, message: string }) {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to send message: ${res.statusText}`);
  }

  return await res.json();
}

export async function fetchContactMessages() {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      cache: 'no-store', // Always fetch fresh messages
      headers: {
        // Include Authorization header here
      }
    });

    if (!res.ok) {
      console.error(`Failed to fetch messages: ${res.statusText}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.warn(`Error fetching messages:`, error);
    return [];
  }
}
