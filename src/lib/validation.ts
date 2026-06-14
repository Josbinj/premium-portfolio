// Validation utilities for API routes

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export function validateContactForm(data: unknown): {
  valid: boolean;
  errors: ValidationError[];
  data?: ContactFormData;
} {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: [{ field: "body", message: "Invalid request body" }] };
  }

  const body = data as Record<string, unknown>;

  // Name
  if (!body.name || typeof body.name !== "string" || body.name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  }
  if (typeof body.name === "string" && body.name.length > 100) {
    errors.push({ field: "name", message: "Name must be under 100 characters" });
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!body.email || typeof body.email !== "string" || !emailRegex.test(body.email)) {
    errors.push({ field: "email", message: "Valid email is required" });
  }

  // Subject
  if (!body.subject || typeof body.subject !== "string" || body.subject.trim().length < 3) {
    errors.push({ field: "subject", message: "Subject must be at least 3 characters" });
  }
  if (typeof body.subject === "string" && body.subject.length > 200) {
    errors.push({ field: "subject", message: "Subject must be under 200 characters" });
  }

  // Message
  if (!body.message || typeof body.message !== "string" || body.message.trim().length < 10) {
    errors.push({ field: "message", message: "Message must be at least 10 characters" });
  }
  if (typeof body.message === "string" && body.message.length > 5000) {
    errors.push({ field: "message", message: "Message must be under 5000 characters" });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      name: (body.name as string).trim(),
      email: (body.email as string).trim().toLowerCase(),
      subject: (body.subject as string).trim(),
      message: (body.message as string).trim(),
    },
  };
}

// Simple rate limiting (in-memory, per-IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  ip: string,
  maxRequests = 5,
  windowMs = 60 * 1000 // 1 minute
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

// Sanitize input to prevent XSS
export function sanitize(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
