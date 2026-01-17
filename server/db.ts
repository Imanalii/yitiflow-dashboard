import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== Vehicle Queries =====
export async function getAllVehicles() {
  const db = await getDb();
  if (!db) return [];
  const { vehicles } = await import("../drizzle/schema");
  return await db.select().from(vehicles);
}

export async function getVehicleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { vehicles } = await import("../drizzle/schema");
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createVehicle(vehicle: import("../drizzle/schema").InsertVehicle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { vehicles } = await import("../drizzle/schema");
  const result = await db.insert(vehicles).values(vehicle);
  return result;
}

export async function updateVehicleLocation(id: number, latitude: string, longitude: string) {
  const db = await getDb();
  if (!db) return;
  const { vehicles } = await import("../drizzle/schema");
  await db.update(vehicles).set({ currentLatitude: latitude, currentLongitude: longitude }).where(eq(vehicles.id, id));
}

// ===== Trip Queries =====
export async function getAllTrips() {
  const db = await getDb();
  if (!db) return [];
  const { trips } = await import("../drizzle/schema");
  return await db.select().from(trips);
}

export async function getTripById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { trips } = await import("../drizzle/schema");
  const result = await db.select().from(trips).where(eq(trips.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTrip(trip: import("../drizzle/schema").InsertTrip) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { trips } = await import("../drizzle/schema");
  const result = await db.insert(trips).values(trip);
  return result;
}

export async function updateTripStatus(id: number, status: "pending" | "active" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) return;
  const { trips } = await import("../drizzle/schema");
  await db.update(trips).set({ status }).where(eq(trips.id, id));
}

// ===== Sensor Data Queries =====
export async function saveSensorData(data: import("../drizzle/schema").InsertSensorData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { sensorData } = await import("../drizzle/schema");
  const result = await db.insert(sensorData).values(data);
  return result;
}

export async function getLatestSensorDataByVehicle(vehicleId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const { sensorData } = await import("../drizzle/schema");
  const { desc } = await import("drizzle-orm");
  const result = await db.select().from(sensorData).where(eq(sensorData.vehicleId, vehicleId)).orderBy(desc(sensorData.timestamp)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Reward Queries =====
export async function createReward(reward: import("../drizzle/schema").InsertReward) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { rewards } = await import("../drizzle/schema");
  const result = await db.insert(rewards).values(reward);
  return result;
}

export async function getUserRewards(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { rewards } = await import("../drizzle/schema");
  return await db.select().from(rewards).where(eq(rewards.userId, userId));
}

export async function getAllRewards() {
  const db = await getDb();
  if (!db) return [];
  const { rewards } = await import("../drizzle/schema");
  return await db.select().from(rewards);
}

export async function getRewardsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const { rewards } = await import("../drizzle/schema");
  return await db.select().from(rewards).where(eq(rewards.userId, userId));
}
