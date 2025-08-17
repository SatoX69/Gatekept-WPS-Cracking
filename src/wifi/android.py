#  OneShot-Extended (WPS penetration testing utility) is a fork of the tool with extra features
#  Copyright (C) 2025 chickendrop89
#
#  This program is free software; you can redistribute it and/or
#  modify it under the terms of the GNU General Public License
#  as published by the Free Software Foundation; either version 2
#  of the License, or (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.

import subprocess
import time

class AndroidNetwork:
    """Manages android Wi-Fi-related settings"""

    def __init__(self):
        self.ENABLED_SCANNING = 0

    def storeAlwaysScanState(self):
        """Stores Initial Wi-Fi 'always-scanning' state, so it can be restored on exit"""

        settings_cmd = ['settings', 'get', 'global', 'wifi_scan_always_enabled']

        try:
            is_scanning_on = subprocess.run(
                settings_cmd,
                encoding='utf-8',
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                check=True
            )
            is_scanning_on = is_scanning_on.stdout.strip()

            if is_scanning_on == '1':
                self.ENABLED_SCANNING = 1
        except subprocess.CalledProcessError:
            print('[!] Failed to get initial Wi-Fi scanning state, assuming it\'s enabled')
            self.ENABLED_SCANNING = 1

    def disableWifi(self, force_disable: bool = False, whisper: bool = False):
        """Disable Wi-Fi connectivity on Android."""

        if whisper is False:
            print('[*] Android: disabling Wi-Fi')

        wifi_disable_scanner_cmd = ['cmd', 'wifi', 'set-wifi-enabled', 'disabled']
        wifi_disable_always_scanning_cmd = ['cmd', '-w', 'wifi', 'set-scan-always-available', 'disabled']

        # Disable Android Wi-Fi scanner
        try:
            subprocess.run(wifi_disable_scanner_cmd)
        except subprocess.CalledProcessError:
            print('[!] Failed to disable Wi-Fi scanner, skipping')

        # Always scanning for networks causes the interface to be occupied by android
        if self.ENABLED_SCANNING == 1 or force_disable is True:
            try:
                subprocess.run(wifi_disable_always_scanning_cmd)
            except subprocess.CalledProcessError:
                print('[!] Failed to disable always-on Wi-Fi scanning, skipping')

        time.sleep(3)

    def enableWifi(self, force_enable: bool = False, whisper: bool = False):
        """Enable Wi-Fi connectivity on Android."""

        if whisper is False:
            print('[*] Android: enabling Wi-Fi')

        wifi_enable_scanner_cmd = ['cmd', 'wifi', 'set-wifi-enabled', 'enabled']
        wifi_enable_always_scanning_cmd = ['cmd', '-w', 'wifi', 'set-scan-always-available', 'enabled']

        # Enable Android Wi-Fi scanner
        try:
            subprocess.run(wifi_enable_scanner_cmd)
        except subprocess.CalledProcessError:
            print('[!] Failed to enable Wi-Fi scanner, skipping')

        if self.ENABLED_SCANNING == 1 or force_enable is True:
            try:
                subprocess.run(wifi_enable_always_scanning_cmd)
            except subprocess.CalledProcessError:
                print('[!] Failed to enable always-on Wi-Fi scanning, skipping')
