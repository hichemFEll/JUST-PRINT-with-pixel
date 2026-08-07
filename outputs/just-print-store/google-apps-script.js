// JUST PRINT order receiver for Google Sheets.
// Paste this entire file into Extensions > Apps Script from your Google Sheet.

const SPREADSHEET_ID = '1wujGRUWuv0HMTaYt0Q2wiYYYV6JlK2xeMNUbJsggc48';
const SHEET_NAME = 'Orders';
const NOTIFICATION_EMAIL = 'hichemgdi@hotmail.com';

function doGet() {
  return ContentService.createTextOutput('JUST PRINT order receiver is online.');
}

function doPost(e) {
  try {
    const order = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received at', 'Product', 'Model', 'Size', 'Product price', 'Delivery type', 'Delivery price', 'Total', 'First name', 'Last name', 'Phone', 'Wilaya', 'Commune']);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), order.product, order.model, order.size, order.productPrice, order.deliveryType, order.deliveryPrice, order.total, order.firstName, order.lastName, order.phone, order.wilaya, order.commune]);
    if (NOTIFICATION_EMAIL) {
      MailApp.sendEmail({to: NOTIFICATION_EMAIL, subject: `New JUST PRINT order - ${order.product}`, htmlBody: `<p><b>${order.firstName} ${order.lastName}</b> placed an order.</p><p>Phone: ${order.phone}<br>Wilaya: ${order.wilaya}<br>Commune: ${order.commune}<br>Total: <b>${order.total} DA</b></p>`});
    }
    console.log(JSON.stringify(order));
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error(error.stack || error);
    throw error;
  }
}
