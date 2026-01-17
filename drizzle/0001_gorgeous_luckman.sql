CREATE TABLE `rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tripId` int,
	`type` enum('sustainable_choice','off_peak','loyalty','social') NOT NULL,
	`amount` int NOT NULL,
	`multiplier` int NOT NULL DEFAULT 100,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`redeemed` int NOT NULL DEFAULT 0,
	CONSTRAINT `rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sensorData` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`deviceId` varchar(100) NOT NULL,
	`latitude` text,
	`longitude` text,
	`temperature` int,
	`humidity` int,
	`co2` int,
	`timestamp` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sensorData_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`vehicleId` int NOT NULL,
	`startLatitude` text NOT NULL,
	`startLongitude` text NOT NULL,
	`startAddress` text,
	`endLatitude` text,
	`endLongitude` text,
	`endAddress` text,
	`startTime` timestamp NOT NULL,
	`endTime` timestamp,
	`distance` int,
	`duration` int,
	`price` int,
	`carbonEmissions` int,
	`rating` int,
	`review` text,
	`blockchainHash` varchar(255),
	`status` enum('pending','active','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerId` int NOT NULL,
	`type` enum('boat','bus','car','electric_car') NOT NULL,
	`licensePlate` varchar(50) NOT NULL,
	`capacity` int NOT NULL,
	`currentLatitude` text,
	`currentLongitude` text,
	`status` enum('available','busy','maintenance') NOT NULL DEFAULT 'available',
	`fuelType` enum('diesel','electric','hybrid') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`)
);
