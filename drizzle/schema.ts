import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * جدول المركبات - يحتوي على معلومات جميع وسائل النقل
 */
export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  providerId: int("providerId").notNull(),
  type: mysqlEnum("type", ["boat", "bus", "car", "electric_car"]).notNull(),
  licensePlate: varchar("licensePlate", { length: 50 }).notNull(),
  capacity: int("capacity").notNull(),
  currentLatitude: text("currentLatitude"),
  currentLongitude: text("currentLongitude"),
  status: mysqlEnum("status", ["available", "busy", "maintenance"]).default("available").notNull(),
  fuelType: mysqlEnum("fuelType", ["diesel", "electric", "hybrid"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;

/**
 * جدول الرحلات - يحتوي على معلومات جميع الرحلات
 */
export const trips = mysqlTable("trips", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  vehicleId: int("vehicleId").notNull(),
  startLatitude: text("startLatitude").notNull(),
  startLongitude: text("startLongitude").notNull(),
  startAddress: text("startAddress"),
  endLatitude: text("endLatitude"),
  endLongitude: text("endLongitude"),
  endAddress: text("endAddress"),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  distance: int("distance"), // بالمتر
  duration: int("duration"), // بالثواني
  price: int("price"), // بالفلس
  carbonEmissions: int("carbonEmissions"), // بالجرام
  rating: int("rating"), // من 1 إلى 5
  review: text("review"),
  blockchainHash: varchar("blockchainHash", { length: 255 }),
  status: mysqlEnum("status", ["pending", "active", "completed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Trip = typeof trips.$inferSelect;
export type InsertTrip = typeof trips.$inferInsert;

/**
 * جدول بيانات الحساسات - يحتوي على القراءات الحية من الأجهزة
 */
export const sensorData = mysqlTable("sensorData", {
  id: int("id").autoincrement().primaryKey(),
  vehicleId: int("vehicleId").notNull(),
  deviceId: varchar("deviceId", { length: 100 }).notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  temperature: int("temperature"), // مضروب في 100 للحفاظ على دقة عشرية
  humidity: int("humidity"), // مضروب في 100
  co2: int("co2"), // ppm
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SensorData = typeof sensorData.$inferSelect;
export type InsertSensorData = typeof sensorData.$inferInsert;

/**
 * جدول المكافآت - يحتوي على نظام YitiCoin
 */
export const rewards = mysqlTable("rewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tripId: int("tripId"),
  type: mysqlEnum("type", ["sustainable_choice", "off_peak", "loyalty", "social"]).notNull(),
  amount: int("amount").notNull(), // عدد YitiCoins
  multiplier: int("multiplier").default(100).notNull(), // مضروب في 100 (1.5 = 150)
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
  redeemed: int("redeemed").default(0).notNull(), // 0 = false, 1 = true
});

export type Reward = typeof rewards.$inferSelect;
export type InsertReward = typeof rewards.$inferInsert;