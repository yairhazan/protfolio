import { db } from "@db";
import { logs, type InsertLog } from "@db/schema";

export type LogLevel = "info" | "warn" | "error";

export async function logEvent(params: {
  level: LogLevel;
  source: string;
  message: string;
  metadata?: Record<string, any>;
  userId?: number;
}) {
  const { level, source, message, metadata, userId } = params;
  
  try {
    await db.insert(logs).values({
      level,
      source,
      message,
      metadata,
      userId,
      timestamp: new Date(),
    });
    
    console.log(`[${level.toUpperCase()}] ${source}: ${message}`);
  } catch (error) {
    console.error("Failed to log event:", error);
  }
}

export async function getRecentLogs(limit = 100) {
  try {
    return await db.query.logs.findMany({
      orderBy: (logs, { desc }) => [desc(logs.timestamp)],
      limit,
    });
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return [];
  }
}
