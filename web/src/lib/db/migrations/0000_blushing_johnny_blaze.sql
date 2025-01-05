CREATE TABLE `channels` (
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
CREATE UNIQUE INDEX `channels_user_name_unique` ON `channels` (`user_name`);--> statement-breakpoint
CREATE TABLE `episodes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`url` text NOT NULL,
	`thumbnail` text,
	`tags` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`channel_id` integer,
	FOREIGN KEY (`channel_id`) REFERENCES `channels`(`id`) ON UPDATE no action ON DELETE no action
);
