CREATE TABLE `location` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`lat` real NOT NULL,
	`long` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `location_slug_unique` ON `location` (`slug`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_locationLogImage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`location_log_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`location_log_id`) REFERENCES `locationLog`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_locationLogImage`("id", "key", "location_log_id", "created_at", "updated_at") SELECT "id", "key", "location_log_id", "created_at", "updated_at" FROM `locationLogImage`;--> statement-breakpoint
DROP TABLE `locationLogImage`;--> statement-breakpoint
ALTER TABLE `__new_locationLogImage` RENAME TO `locationLogImage`;--> statement-breakpoint
PRAGMA foreign_keys=ON;