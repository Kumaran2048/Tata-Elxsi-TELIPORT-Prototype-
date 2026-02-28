-- Seed Data for Machine Monitoring Dashboard
-- Optimized for Supabase SQL Editor compatibility

-- 1. Create a Sample Factory (Only if it doesn't exist)
INSERT INTO factories (name, location)
SELECT 'Smart Manufacturing Hub', 'Detroit, MI'
WHERE NOT EXISTS (
    SELECT 1 FROM factories WHERE name = 'Smart Manufacturing Hub'
);

-- 2. Create Sample Machines
-- Check if machines exist first to avoid duplicates
INSERT INTO machines (factory_id, name, type, status)
SELECT f.id, m.name, m.type, m.status
FROM factories f
CROSS JOIN (
    SELECT 'CNC Lathe #3' as name, 'CNC' as type, 'Active' as status
    UNION ALL SELECT 'Hydraulic Press #1', 'Press', 'Active'
    UNION ALL SELECT 'Milling Machine #2', 'Mill', 'Active'
    UNION ALL SELECT 'Welding Robot #2', 'Robot', 'Fault'
    UNION ALL SELECT 'Compressor #4', 'Compressor', 'Active'
    UNION ALL SELECT 'Assembly Line #1', 'Line', 'Active'
) m
WHERE f.name = 'Smart Manufacturing Hub'
AND NOT EXISTS (
    SELECT 1 FROM machines WHERE name = m.name
);

-- 3. Create Sample Telemetry (Fresh readings)
INSERT INTO telemetry (machine_id, vibration, temperature, energy_kwh)
SELECT id, 2.1 + (random() * 0.5), 55.4 + (random() * 2), 12.5 FROM machines WHERE name = 'CNC Lathe #3' LIMIT 1;
INSERT INTO telemetry (machine_id, vibration, temperature, energy_kwh)
SELECT id, 2.3 + (random() * 0.5), 56.2 + (random() * 2), 13.1 FROM machines WHERE name = 'CNC Lathe #3' LIMIT 1;
INSERT INTO telemetry (machine_id, vibration, temperature, energy_kwh)
SELECT id, 1.2 + (random() * 0.3), 72.0 + (random() * 5), 45.3 FROM machines WHERE name = 'Hydraulic Press #1' LIMIT 1;
INSERT INTO telemetry (machine_id, vibration, temperature, energy_kwh)
SELECT id, 4.5 + (random() * 1.5), 88.5 + (random() * 10), 8.2 FROM machines WHERE name = 'Welding Robot #2' LIMIT 1;

-- 4. Create AI Insights
INSERT INTO ai_insights (machine_id, alert_type, prediction_message, confidence_score)
SELECT id, 'Maintenance', 'Spindle bearing showing early signs of wear.', 0.88 
FROM machines WHERE name = 'CNC Lathe #3'
AND NOT EXISTS (SELECT 1 FROM ai_insights WHERE alert_type = 'Maintenance' AND prediction_message LIKE '%Spindle%');

INSERT INTO ai_insights (machine_id, alert_type, prediction_message, confidence_score)
SELECT id, 'Fault', 'Critical overheating detected in hydraulic pump.', 0.95 
FROM machines WHERE name = 'Welding Robot #2'
AND NOT EXISTS (SELECT 1 FROM ai_insights WHERE alert_type = 'Fault' AND prediction_message LIKE '%overheating%');

-- 5. Create Sustainability Logs (Green Ledger)
INSERT INTO sustainability_logs (factory_id, energy_saved_kwh, co2_offset_kg, carbon_credits_earned)
SELECT id, 1450.5, 980.2, 12.5 FROM factories WHERE name = 'Smart Manufacturing Hub' LIMIT 1;

-- 6. Create Operator Leaderboard (Gamification)
INSERT INTO operator_leaderboard (operator_name, factory_id, uptime_score, safety_compliance_score, badges)
SELECT 'Rajesh Kumar', id, 98, 100, ARRAY['Energy Saver', 'Safety First'] FROM factories WHERE name = 'Smart Manufacturing Hub' LIMIT 1;
INSERT INTO operator_leaderboard (operator_name, factory_id, uptime_score, safety_compliance_score, badges)
SELECT 'Anita Sharma', id, 95, 98, ARRAY['Consistent Performer'] FROM factories WHERE name = 'Smart Manufacturing Hub' LIMIT 1;
