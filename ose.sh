#!/usr/bin/env bash
set -euo pipefail

read -r -p "Enter OTP: " TOKEN

if node ~/.ose/verify-otp.js "$TOKEN"; then
  echo "OTP OK"
  sudo python3 ~/.ose/start_attck -i wlan0 -K -w -s
else
  echo "Invalid OTP"
  exit 1
fi
