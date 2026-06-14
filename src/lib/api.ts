const IS_DEV = process.env.NODE_ENV === "development";
const API_BASE_URL = IS_DEV ? "http://localhost:3000/api" : (process.env.NEXT_PUBLIC_API_URL || "https://gqi8w89tse.execute-api.us-east-1.amazonaws.com/prod/api");

export async function fetchSectionData(sectionId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/portfolio/${sectionId}`, {
      cache: 'no-store', // Always fetch fresh data to reflect admin edits immediately
    });
    
    if (!res.ok) {
      if (res.status === 404) return null; // Not found yet, use default
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
