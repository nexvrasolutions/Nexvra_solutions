-- Lock down Supabase's auto-generated Data API (PostgREST / GraphQL).
--
-- The app only reaches the database from the server (Prisma, connecting as the
-- `postgres` role, which has BYPASSRLS), so it is not affected. Browsers never
-- query tables directly: the public verification page is rendered on the server
-- and selects only public fields.
--
-- Non-destructive: no data, columns or tables are changed or removed.

-- 1. Row Level Security on every table. No policies are created on purpose:
--    with RLS on and no policy, the `anon` and `authenticated` roles get no rows.
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Department" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Enrollment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Institution" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProgramTypeOption" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Student" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- 2. Remove direct access for Supabase's public API roles. Skipped on plain
--    PostgreSQL (e.g. a local shadow database), where these roles do not exist.
DO $$
DECLARE
  api_role TEXT;
BEGIN
  FOREACH api_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = api_role) THEN
      EXECUTE format('REVOKE ALL ON ALL TABLES IN SCHEMA public FROM %I', api_role);
      EXECUTE format('REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM %I', api_role);
      EXECUTE format('REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM %I', api_role);
      -- Objects created by later migrations (owned by postgres) start without access too.
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM %I', api_role);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM %I', api_role);
      EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM %I', api_role);
    END IF;
  END LOOP;
END $$;
