import { drizzle } from "drizzle-orm/mysql2";
import { vehicles, trips, sensorData, rewards } from "./drizzle/schema.js";
import dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// مواقع GPS حقيقية في منطقة يتي، سلطنة عُمان
// يتي هي منطقة ساحلية في محافظة ظفار
const yitiLocations = [
  { lat: "23.6345", lng: "58.5877", name: "شاطئ يتي الرئيسي" },
  { lat: "23.6289", lng: "58.5923", name: "ميناء يتي" },
  { lat: "23.6412", lng: "58.5834", name: "منطقة الفنادق" },
  { lat: "23.6378", lng: "58.5901", name: "السوق التقليدي" },
  { lat: "23.6301", lng: "58.5956", name: "محطة القوارب" },
  { lat: "23.6423", lng: "58.5812", name: "المنتزه البحري" },
  { lat: "23.6356", lng: "58.5889", name: "مركز الزوار" },
  { lat: "23.6267", lng: "58.5978", name: "الشاطئ الشمالي" },
];

async function seedData() {
  console.log("🌱 بدء إضافة البيانات التجريبية...");

  try {
    // 1. إضافة المركبات
    console.log("📦 إضافة المركبات...");
    const vehicleData = [
      {
        providerId: 1,
        type: "boat",
        licensePlate: "YT-B-001",
        capacity: 25,
        currentLatitude: yitiLocations[0].lat,
        currentLongitude: yitiLocations[0].lng,
        status: "available",
        fuelType: "diesel",
      },
      {
        providerId: 1,
        type: "boat",
        licensePlate: "YT-B-002",
        capacity: 30,
        currentLatitude: yitiLocations[1].lat,
        currentLongitude: yitiLocations[1].lng,
        status: "busy",
        fuelType: "diesel",
      },
      {
        providerId: 2,
        type: "boat",
        licensePlate: "YT-B-003",
        capacity: 20,
        currentLatitude: yitiLocations[4].lat,
        currentLongitude: yitiLocations[4].lng,
        status: "available",
        fuelType: "electric",
      },
      {
        providerId: 2,
        type: "bus",
        licensePlate: "YT-BUS-001",
        capacity: 45,
        currentLatitude: yitiLocations[2].lat,
        currentLongitude: yitiLocations[2].lng,
        status: "available",
        fuelType: "diesel",
      },
      {
        providerId: 3,
        type: "bus",
        licensePlate: "YT-BUS-002",
        capacity: 50,
        currentLatitude: yitiLocations[3].lat,
        currentLongitude: yitiLocations[3].lng,
        status: "busy",
        fuelType: "hybrid",
      },
      {
        providerId: 3,
        type: "car",
        licensePlate: "YT-C-001",
        capacity: 4,
        currentLatitude: yitiLocations[5].lat,
        currentLongitude: yitiLocations[5].lng,
        status: "available",
        fuelType: "electric",
      },
      {
        providerId: 4,
        type: "electric_car",
        licensePlate: "YT-EC-001",
        capacity: 5,
        currentLatitude: yitiLocations[6].lat,
        currentLongitude: yitiLocations[6].lng,
        status: "available",
        fuelType: "electric",
      },
      {
        providerId: 4,
        type: "car",
        licensePlate: "YT-C-002",
        capacity: 4,
        currentLatitude: yitiLocations[7].lat,
        currentLongitude: yitiLocations[7].lng,
        status: "maintenance",
        fuelType: "diesel",
      },
    ];

    for (const vehicle of vehicleData) {
      await db.insert(vehicles).values(vehicle);
    }
    console.log(`✅ تم إضافة ${vehicleData.length} مركبة`);

    // 2. إضافة الرحلات
    console.log("🚗 إضافة الرحلات...");
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    const tripData = [
      {
        userId: 1,
        vehicleId: 1,
        startLatitude: yitiLocations[0].lat,
        startLongitude: yitiLocations[0].lng,
        startAddress: yitiLocations[0].name,
        endLatitude: yitiLocations[4].lat,
        endLongitude: yitiLocations[4].lng,
        endAddress: yitiLocations[4].name,
        startTime: twoHoursAgo,
        endTime: oneHourAgo,
        distance: 2500,
        duration: 3600,
        price: 1500,
        carbonEmissions: 450,
        rating: 5,
        review: "رحلة ممتازة والقارب نظيف جداً",
        status: "completed",
      },
      {
        userId: 2,
        vehicleId: 2,
        startLatitude: yitiLocations[1].lat,
        startLongitude: yitiLocations[1].lng,
        startAddress: yitiLocations[1].name,
        endLatitude: yitiLocations[5].lat,
        endLongitude: yitiLocations[5].lng,
        endAddress: yitiLocations[5].name,
        startTime: oneHourAgo,
        distance: 1800,
        duration: 1800,
        price: 1200,
        carbonEmissions: 320,
        status: "active",
      },
      {
        userId: 3,
        vehicleId: 4,
        startLatitude: yitiLocations[2].lat,
        startLongitude: yitiLocations[2].lng,
        startAddress: yitiLocations[2].name,
        endLatitude: yitiLocations[3].lat,
        endLongitude: yitiLocations[3].lng,
        endAddress: yitiLocations[3].name,
        startTime: twoHoursAgo,
        endTime: oneHourAgo,
        distance: 1200,
        duration: 900,
        price: 500,
        carbonEmissions: 180,
        rating: 4,
        status: "completed",
      },
      {
        userId: 4,
        vehicleId: 5,
        startLatitude: yitiLocations[3].lat,
        startLongitude: yitiLocations[3].lng,
        startAddress: yitiLocations[3].name,
        endLatitude: yitiLocations[6].lat,
        endLongitude: yitiLocations[6].lng,
        endAddress: yitiLocations[6].name,
        startTime: new Date(now.getTime() - 30 * 60 * 1000),
        distance: 2100,
        duration: 1500,
        price: 800,
        carbonEmissions: 250,
        status: "active",
      },
      {
        userId: 5,
        vehicleId: 6,
        startLatitude: yitiLocations[5].lat,
        startLongitude: yitiLocations[5].lng,
        startAddress: yitiLocations[5].name,
        endLatitude: yitiLocations[7].lat,
        endLongitude: yitiLocations[7].lng,
        endAddress: yitiLocations[7].name,
        startTime: twoHoursAgo,
        endTime: oneHourAgo,
        distance: 3200,
        duration: 2400,
        price: 1800,
        carbonEmissions: 150,
        rating: 5,
        review: "سيارة كهربائية ممتازة وصديقة للبيئة",
        status: "completed",
      },
    ];

    for (const trip of tripData) {
      await db.insert(trips).values(trip);
    }
    console.log(`✅ تم إضافة ${tripData.length} رحلة`);

    // 3. إضافة بيانات الحساسات
    console.log("📡 إضافة بيانات الحساسات...");
    const sensorDataArray = [
      {
        vehicleId: 1,
        deviceId: "ESP32_YT_B_001",
        latitude: yitiLocations[0].lat,
        longitude: yitiLocations[0].lng,
        temperature: 2850,
        humidity: 6500,
        co2: 420,
        timestamp: new Date(),
      },
      {
        vehicleId: 2,
        deviceId: "ESP32_YT_B_002",
        latitude: yitiLocations[1].lat,
        longitude: yitiLocations[1].lng,
        temperature: 2920,
        humidity: 6800,
        co2: 450,
        timestamp: new Date(),
      },
      {
        vehicleId: 3,
        deviceId: "ESP32_YT_B_003",
        latitude: yitiLocations[4].lat,
        longitude: yitiLocations[4].lng,
        temperature: 2780,
        humidity: 6200,
        co2: 380,
        timestamp: new Date(),
      },
      {
        vehicleId: 4,
        deviceId: "ESP32_YT_BUS_001",
        latitude: yitiLocations[2].lat,
        longitude: yitiLocations[2].lng,
        temperature: 3100,
        humidity: 5900,
        co2: 480,
        timestamp: new Date(),
      },
      {
        vehicleId: 5,
        deviceId: "ESP32_YT_BUS_002",
        latitude: yitiLocations[3].lat,
        longitude: yitiLocations[3].lng,
        temperature: 3050,
        humidity: 6100,
        co2: 460,
        timestamp: new Date(),
      },
    ];

    for (const sensor of sensorDataArray) {
      await db.insert(sensorData).values(sensor);
    }
    console.log(`✅ تم إضافة ${sensorDataArray.length} قراءة حساسات`);

    // 4. إضافة المكافآت
    console.log("🎁 إضافة المكافآت...");
    const rewardData = [
      {
        userId: 1,
        tripId: 1,
        type: "sustainable_choice",
        amount: 50,
        multiplier: 150,
        earnedAt: new Date(),
        redeemed: 0,
      },
      {
        userId: 2,
        tripId: 2,
        type: "off_peak",
        amount: 30,
        multiplier: 120,
        earnedAt: new Date(),
        redeemed: 0,
      },
      {
        userId: 5,
        tripId: 5,
        type: "sustainable_choice",
        amount: 80,
        multiplier: 200,
        earnedAt: new Date(),
        redeemed: 0,
      },
    ];

    for (const reward of rewardData) {
      await db.insert(rewards).values(reward);
    }
    console.log(`✅ تم إضافة ${rewardData.length} مكافأة`);

    console.log("\n🎉 تم إضافة جميع البيانات التجريبية بنجاح!");
    console.log("\n📊 ملخص البيانات:");
    console.log(`   - المركبات: ${vehicleData.length}`);
    console.log(`   - الرحلات: ${tripData.length}`);
    console.log(`   - قراءات الحساسات: ${sensorDataArray.length}`);
    console.log(`   - المكافآت: ${rewardData.length}`);
    console.log("\n✨ يمكنك الآن فتح لوحة التحكم ورؤية البيانات على الخريطة!");
  } catch (error) {
    console.error("❌ خطأ في إضافة البيانات:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedData();
