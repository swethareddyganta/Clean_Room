#!/bin/bash

while true; do
  echo "=== $(date) ==="
  echo "📊 USER PROFILES:"
  mysql -u root -pRamana1113 -e "USE clean_room_db; SELECT id, name, email, role, is_active, created_at FROM user_profiles ORDER BY created_at DESC LIMIT 5;" 2>/dev/null
  echo ""
  echo "🔐 LOGIN HISTORY:"
  mysql -u root -pRamana1113 -e "USE clean_room_db; SELECT user_name, email, success, login_time FROM login_history ORDER BY login_time DESC LIMIT 5;" 2>/dev/null
  echo ""
  echo "========================================="
  sleep 5
done 