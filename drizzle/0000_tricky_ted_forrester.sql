CREATE TABLE `saves` (
	`user_id` text PRIMARY KEY NOT NULL,
	`snapshot` text NOT NULL,
	`previous` text,
	`revision` integer NOT NULL,
	`updated_at` integer NOT NULL
);
