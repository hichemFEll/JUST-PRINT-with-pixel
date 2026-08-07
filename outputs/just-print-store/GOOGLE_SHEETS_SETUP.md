# Connect JUST PRINT orders to Google Sheets

1. Open your Google Sheet, then click **Extensions > Apps Script**.
2. Delete the starter code and paste the contents of `google-apps-script.js`.
3. Optional: add your email address in `NOTIFICATION_EMAIL`.
4. Click **Deploy > New deployment > Web app**.
5. Set **Execute as** to **Me** and set access to **Anyone**.
6. Click **Deploy**, approve the Google permissions, then copy the URL ending in `/exec`.
7. Send that `/exec` URL to Codex. It will be added to `app.js` and the WhatsApp checkout will be removed.

The script creates an `Orders` tab automatically and appends every submitted order. It can also send an email for each order when `NOTIFICATION_EMAIL` is set.
