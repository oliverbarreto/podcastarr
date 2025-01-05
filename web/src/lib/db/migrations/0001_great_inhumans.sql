CREATE TABLE `channel_info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_name` text NOT NULL,
	`channel_name` text,
	`channel_description` text,
	`logo_url` text,
	`personal_website` text,
	`feed_url` text,
	`author_name` text,
	`author_email` text,
	`owner_name` text,
	`owner_email` text,
	`is_explicit_content` integer DEFAULT 0 NOT NULL,
	`language` text DEFAULT 'en'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `channel_info_user_name_unique` ON `channel_info` (`user_name`);--> statement-breakpoint
DROP TABLE `channels`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_episodes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`url` text NOT NULL,
	`thumbnail` text,
	`tags` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`channel_id` integer,
	FOREIGN KEY (`channel_id`) REFERENCES `channel_info`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_episodes`("id", "title", "description", "url", "thumbnail", "tags", "created_at", "updated_at", "channel_id") SELECT "id", "title", "description", "url", "thumbnail", "tags", "created_at", "updated_at", "channel_id" FROM `episodes`;--> statement-breakpoint
DROP TABLE `episodes`;--> statement-breakpoint
ALTER TABLE `__new_episodes` RENAME TO `episodes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;