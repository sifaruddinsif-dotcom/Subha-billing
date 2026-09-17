# SUBHA BILLING
Professional web-based GST billing + inventory software for Stationery & FMCG.

## Included
- Admin login/JWT session
- Dashboard: sales, purchase, customers, pending payments, low stock
- GST invoices with CGST/SGST or IGST
- Automatic invoice numbering
- Products, SKU/barcode, HSN, GST, stock and minimum stock
- Customers and suppliers
- Payments and outstanding balances
- Sales/GST reports
- Invoice print / browser Save as PDF
- CSV export
- Business settings
- Responsive desktop + mobile browser UI

## Local run
1. Install Node.js 20+
2. `npm install`
3. `npm start`
4. Open `http://localhost:3000`

Default login (change before production):
- Email: `admin@subhabilling.com`
- Password: `ChangeMe123!`

## Render deployment
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables: `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- For persistent production data, mount a persistent disk and set `DB_PATH=/var/data/subha-billing.db`.

## Important production notes
This is a complete functional starter/MVP, but before public commercial use you should configure your real business/GST details, secure secrets, HTTPS, backups, user roles, and validate tax/accounting requirements with your CA.
