-- RUN THIS SQL SCRIPT IN YOUR SUPABASE SQL EDITOR TO FIX PERMISSION ERRORS

-- Option A: Completely Disable Row Level Security (Recommended for rapid testing/dashboard)
ALTER TABLE factories DISABLE ROW LEVEL SECURITY;
ALTER TABLE machines DISABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights DISABLE ROW LEVEL SECURITY;
ALTER TABLE federated_updates DISABLE ROW LEVEL SECURITY;

-- Option B: Grant explicit select permissions to the anon and authenticated roles
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Ensure standard policies exist if you ever re-enable RLS
DROP POLICY IF EXISTS "Allow public read" ON factories;
CREATE POLICY "Allow public read" ON factories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON machines;
CREATE POLICY "Allow public read" ON machines FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON telemetry;
CREATE POLICY "Allow public read" ON telemetry FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON ai_insights;
CREATE POLICY "Allow public read" ON ai_insights FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON federated_updates;
CREATE POLICY "Allow public read" ON federated_updates FOR SELECT USING (true);
