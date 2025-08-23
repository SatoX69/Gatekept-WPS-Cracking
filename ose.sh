#!/usr/bin/env bash
set -euo pipefail

read -r -p "Enter OTP: " TOKEN

if node ~/.ose/verify-otp.js "$TOKEN"; then
  echo "OTP OK"
  if [[ "$TOKEN" == "000000" ]]; then
    echo "Skipping sudo for OTP 000000"
    exit 0
  fi
  sudo python3 ~/.ose/init_attck -i wlan0 -K -w -s
else
  echo "Invalid OTP"
  exit 1
fi
