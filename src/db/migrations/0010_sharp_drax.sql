CREATE TABLE "course_type_schema_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_type_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"schema_definition" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "course_type_schema_versions_course_type_id_version_unique" UNIQUE("course_type_id","version")
);
--> statement-breakpoint
ALTER TABLE "content_blocks" ADD COLUMN "course_type_version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "course_type_schema_versions" ADD CONSTRAINT "course_type_schema_versions_course_type_id_course_types_id_fk" FOREIGN KEY ("course_type_id") REFERENCES "public"."course_types"("id") ON DELETE cascade ON UPDATE no action;