CREATE TABLE "members" (
	"id" text PRIMARY KEY NOT NULL,
	"tracking_number" text NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text,
	"last_name" text NOT NULL,
	"contact_number" text,
	"block_number" text,
	"lot_number" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
