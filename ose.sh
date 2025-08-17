#!/usr/bin/env bash
set -euo pipefail

read -r -p "Enter OTP: " TOKEN

if node verify-otp.js "$TOKEN"; then
  echo "OTP OK"
  sudo python3 start_attck -i wlan0 -K -w -s --dts
else
  echo "Invalid OTP"
  exit 1
fi
