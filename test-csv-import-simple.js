const fs = require('fs');
const path = require('path');
const http = require('http');
const { URL } = require('url');

// Function to test the CSV import
async function testCSVImport() {
  console.log('Starting CSV import test...');
  
  // Read the CSV file
  const csvPath = path.join(__dirname, 'tmp', 'demo.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  
  // Create form data boundary
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const formData = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="csvFile"; filename="demo.csv"',
    'Content-Type: text/csv',
    '',
    fileContent,
    `--${boundary}--`
  ].join('\r\n');
  
  // Prepare the request
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/admin/import-csv',
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(formData)
    }
  };
  
  // Send the request
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          console.log('Response status:', res.statusCode);
          if (res.statusCode >= 400) {
            console.log('Error response:', data);
            resolve({ success: false, error: `HTTP error: ${res.statusCode}` });
          } else {
            const result = JSON.parse(data);
            console.log('Import result:');
            console.log(JSON.stringify(result, null, 2));
            
            if (result.success) {
              console.log(`✅ Successfully imported ${result.data.successCount} products`);
              console.log(`❌ Failed to import ${result.data.errorCount} products`);
            } else {
              console.log(`❌ Import failed: ${result.error}`);
            }
            
            resolve(result);
          }
        } catch (error) {
          console.error('Error parsing response:', error);
          reject(error);
        }
      });
    });
    
    req.on('error', (e) => {
      console.error('Request error:', e);
      reject(e);
    });
    
    // Write the form data to the request
    req.write(formData);
    req.end();
  });
}

// Run the test
testCSVImport().catch(console.error);
