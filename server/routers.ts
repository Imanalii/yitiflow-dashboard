import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  vehicles: router({
    list: publicProcedure.query(async () => {
      const { getAllVehicles } = await import("./db");
      return await getAllVehicles();
    }),
    getById: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "id" in val && typeof val.id === "number") {
        return val as { id: number };
      }
      throw new Error("Invalid input: expected { id: number }");
    }).query(async ({ input }) => {
      const { getVehicleById } = await import("./db");
      return await getVehicleById(input.id);
    }),
  }),

  trips: router({
    list: publicProcedure.query(async () => {
      const { getAllTrips } = await import("./db");
      return await getAllTrips();
    }),
    getById: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "id" in val && typeof val.id === "number") {
        return val as { id: number };
      }
      throw new Error("Invalid input: expected { id: number }");
    }).query(async ({ input }) => {
      const { getTripById } = await import("./db");
      return await getTripById(input.id);
    }),
  }),

  sensors: router({
    save: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null) {
        return val as any;
      }
      throw new Error("Invalid sensor data");
    }).mutation(async ({ input }) => {
      const { saveSensorData } = await import("./db");
      return await saveSensorData(input);
    }),
    getLatestByVehicle: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "vehicleId" in val && typeof val.vehicleId === "number") {
        return val as { vehicleId: number };
      }
      throw new Error("Invalid input: expected { vehicleId: number }");
    }).query(async ({ input }) => {
      const { getLatestSensorDataByVehicle } = await import("./db");
      return await getLatestSensorDataByVehicle(input.vehicleId);
    }),
  }),

  rewards: router({
    list: publicProcedure.query(async () => {
      const { getAllRewards } = await import("./db");
      return await getAllRewards();
    }),
    getByUser: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "userId" in val && typeof val.userId === "number") {
        return val as { userId: number };
      }
      throw new Error("Invalid input: expected { userId: number }");
    }).query(async ({ input }) => {
      const { getRewardsByUser } = await import("./db");
      return await getRewardsByUser(input.userId);
    }),
    getTotalBalance: publicProcedure.input((val: unknown) => {
      if (typeof val === "object" && val !== null && "userId" in val && typeof val.userId === "number") {
        return val as { userId: number };
      }
      throw new Error("Invalid input: expected { userId: number }");
    }).query(async ({ input }) => {
      const { getRewardsByUser } = await import("./db");
      const userRewards = await getRewardsByUser(input.userId);
      const totalEarned = userRewards.reduce((sum: number, r: any) => sum + r.amount, 0);
      const totalRedeemed = userRewards.reduce((sum: number, r: any) => sum + r.redeemed, 0);
      return {
        totalEarned,
        totalRedeemed,
        balance: totalEarned - totalRedeemed,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
