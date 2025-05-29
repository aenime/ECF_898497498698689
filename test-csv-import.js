const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Function to test the CSV import
async function testCSVImport() {
  try {
    console.log('Starting CSV import test...');
    
    // Read the CSV file
    const csvPath = path.join(__dirname, 'tmp', 'demo.csv');
    const fileStream = fs.createReadStream(csvPath);
    
    // Create form data
    const form = new FormData();
    form.append('csvFile', fileStream, {
      filename: 'demo.csv',
      contentType: 'text/csv',
    });
    
    // Send request to the import API
    const response = await fetch('http://localhost:3001/api/admin/import-csv', {
      method: 'POST',
      body: form,
    });
    
    // Parse and display the response
    const result = await response.json();
    console.log('Import result:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log(`✅ Successfully imported ${result.data.successCount} products`);
      console.log(`❌ Failed to import ${result.data.errorCount} products`);
    } else {
      console.log(`❌ Import failed: ${result.error}`);
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run the test
testCSVImport();
