# SUBHA BILLING — Offline Mobile Use

## Recommended method: laptop + mobile on the same local network

This keeps the database on the laptop and lets the phone/tablet use SUBHA BILLING without Internet.

1. On the laptop, complete the one-time setup with `INSTALL_SUBHA_BILLING_OFFLINE.bat` while Internet is available.
2. Turn on the laptop's mobile hotspot, or connect both devices to the same Wi-Fi router. Internet is not required after the local network is established.
3. On the laptop, double-click `START_SUBHA_BILLING_LAN.bat`.
4. The black window will show the laptop IPv4 address.
5. On the phone/tablet, open Chrome and enter:
   `http://LAPTOP-IP:3000`
   Example: `http://192.168.137.1:3000`
6. Keep the laptop's SUBHA BILLING window open while using the phone.
7. You can use the browser's "Add to Home screen" option for quick access.

## Important

- This is local/offline networking: the Internet is not required.
- The phone does not need Node.js or Termux in this method.
- All billing data is saved in the laptop's `subha-billing.db`.
- The laptop is the main database/server.
- Make regular backups of `subha-billing.db`.
- If Windows Firewall asks for permission, allow Node.js on your private/local network.
- If the phone cannot connect, first confirm both devices are on the same Wi-Fi/hotspot and that the laptop server window is still open.

## Fully standalone Android

Running SUBHA BILLING directly on Android is also possible with Termux + Node.js, but it needs a separate Android setup and its own local database. It is not the same database as the laptop unless data is backed up/restored or synchronized.
