CREATE TABLE "attendance" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text NOT NULL,
	"attendance_date" date NOT NULL,
	"scanned_at" timestamp NOT NULL,
	"created_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_member_date_unique" ON "attendance" USING btree ("member_id","attendance_date");