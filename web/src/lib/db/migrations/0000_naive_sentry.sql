CREATE TABLE `users` (
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
CREATE UNIQUE INDEX `users_user_name_unique` ON `users` (`user_name`);