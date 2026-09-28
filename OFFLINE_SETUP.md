# SUBHA BILLING — Offline Laptop Setup

## First-time setup
1. Install Node.js 20+ on the Windows laptop.
2. Download/clone this repository.
3. Double-click `INSTALL_SUBHA_BILLING_OFFLINE.bat` while Internet is available once.
4. Wait for `npm install` to finish.
5. Double-click `START_SUBHA_BILLING_OFFLINE.bat`.

## Daily offline use
- Internet is not required after setup.
- Double-click `START_SUBHA_BILLING_OFFLINE.bat`.
- Open: http://localhost:3000
- Data is stored locally in `subha-billing.db` in the project folder.

## Important
- The laptop's local database is separate from the Render database.
- Existing online Render invoices/customers/stock are not automatically copied into the laptop database.
- Keep regular copies of `subha-billing.db` as backup.
- Do not delete the database file while the application is running.

## Default login
- Email: admin@subhabilling.com
- Password: ChangeMe123!

Change the password after first login.
