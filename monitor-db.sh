#!/bin/bash

echo "🔍 Monitoring MySQL Database Changes..."
echo "Press Ctrl+C to stop monitoring"
echo ""

while true; do
    echo "=== $(date) ==="
    
    echo "📊 Main Database (clean_room_db):"
    mysql -u root -pRamana1113 -e "USE clean_room_db; SELECT COUNT(*) as user_count FROM user_profiles; SELECT COUNT(*) as login_count FROM login_history; SELECT COUNT(*) as form_count FROM form_submissions;" 2>/dev/null
    
    echo ""
    echo "📊 Forms Database (cleanroom_db):"
    mysql -u root -pRamana1113 -e "USE cleanroom_db; SELECT COUNT(*) as form_count FROM form_submissions;" 2>/dev/null
    
    echo ""
    echo "👥 Recent Users:"
    mysql -u root -pRamana1113 -e "USE clean_room_db; SELECT name, email, role, created_at FROM user_profiles ORDER BY created_at DESC LIMIT 5;" 2>/dev/null
    
    echo ""
    echo "🔐 Recent Login Attempts:"
    mysql -u root -pRamana1113 -e "USE clean_room_db; SELECT email, success, login_time FROM login_history ORDER BY login_time DESC LIMIT 5;" 2>/dev/null
    
    echo ""
    echo "📝 Recent Form Submissions (Main):"
    mysql -u root -pRamana1113 -e "USE clean_room_db; SELECT customer_name, project_name, created_at FROM form_submissions ORDER BY created_at DESC LIMIT 3;" 2>/dev/null
    
    echo ""
    echo "🏗️ Recent HVAC Form Submissions (Forms):"
    mysql -u root -pRamana1113 -e "USE cleanroom_db; SELECT customer_name, project_name, created_at FROM form_submissions ORDER BY created_at DESC LIMIT 3;" 2>/dev/null
    
    echo ""
    echo "⏳ Waiting 10 seconds..."
    echo "=========================================="
    sleep 10
done 