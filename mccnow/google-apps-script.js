// ============================================================
// M CRITCHFIELD CONSTRUCTION — GOOGLE APPS SCRIPT
// This script receives booking form submissions and writes them
// to a Google Sheet automatically.
//
// SETUP INSTRUCTIONS (5 minutes):
// 1. Go to sheets.google.com → Create new sheet → Name it "MCC Bookings"
// 2. In the sheet, go to Extensions → Apps Script
// 3. Delete all existing code and paste THIS entire file
// 4. Click Save (floppy disk icon)
// 5. Click Deploy → New Deployment
// 6. Type: Web App
// 7. Execute as: Me
// 8. Who has access: Anyone
// 9. Click Deploy → Copy the Web App URL
// 10. Paste that URL into mccnow/index.html where it says YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add headers if this is the first row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'First Name',
        'Last Name',
        'Phone',
        'Email',
        'Service Requested',
        'Project Address',
        'Preferred Date',
        'Project Description',
        'How They Found Us',
        'Ad Source (UTM)',
        'Ad Medium',
        'Ad Campaign',
        'Ad Content',
        'Landing Page URL',
        'Status',
        'Notes'
      ]);
      
      // Style the header row
      var headerRange = sheet.getRange(1, 1, 1, 17);
      headerRange.setBackground('#F5A623');
      headerRange.setFontColor('#0A1628');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(11);
    }
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Append the new booking row
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.firstName || '',
      data.lastName || '',
      data.phone || '',
      data.email || '',
      data.service || '',
      data.address || '',
      data.preferredDate || '',
      data.description || '',
      data.source || '',
      data.utm_source || 'direct',
      data.utm_medium || 'none',
      data.utm_campaign || 'none',
      data.utm_content || 'none',
      data.landing_page || '',
      data.status || 'New Lead',
      '' // Notes column — empty for Matt to fill in
    ]);
    
    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 17);
    
    // Send email notification to Matt
    sendNotificationEmail(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Booking recorded!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotificationEmail(data) {
  // REPLACE with your actual email address
  var recipientEmail = 'matt@mccnow.net'; // Change this to your real email
  
  var subject = '🔨 New Booking Request — ' + data.firstName + ' ' + data.lastName + ' (' + data.service + ')';
  
  var body = 
    'You have a new booking request on mccnow.net!\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'CLIENT DETAILS\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Name: ' + data.firstName + ' ' + data.lastName + '\n' +
    'Phone: ' + data.phone + '\n' +
    'Email: ' + data.email + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'PROJECT DETAILS\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Service: ' + data.service + '\n' +
    'Address: ' + data.address + '\n' +
    'Preferred Date: ' + data.preferredDate + '\n' +
    'Description: ' + data.description + '\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'How They Found You: ' + data.source + '\n' +
    'Submitted: ' + data.timestamp + '\n\n' +
    'View all leads in your Google Sheet:\n' +
    'https://docs.google.com/spreadsheets/\n\n' +
    '— Sent automatically by mccnow.net';
  
  try {
    MailApp.sendEmail(recipientEmail, subject, body);
  } catch(emailError) {
    // Email failed but booking still saved to sheet
    Logger.log('Email error: ' + emailError);
  }
}

// Test function — run this manually to verify the sheet works
function testSubmission() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toLocaleString(),
        firstName: 'Test',
        lastName: 'Client',
        phone: '(724) 555-1234',
        email: 'test@example.com',
        service: 'Masonry / Stone Work',
        address: '123 Main St, Champion PA',
        preferredDate: '2026-03-01',
        description: 'Need a retaining wall built in the backyard.',
        source: 'Google Search',
        status: 'New Lead'
      })
    }
  };
  doPost(testData);
}
