const IPFS = require('ipfs-http-client');

// Connect to the IPFS Desktop node
const ipfs = IPFS.create({ host: 'localhost', port: '5001', protocol: 'http' });

// Fetch a file from IPFS
const fetchFromIPFS = async (cid) => {
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
      if (response.ok) {
        const fileContent = await response.text(); // Or response.json() for JSON files
        console.log("File fetched:", fileContent);
        alert("File Content: " + fileContent);
      } else {
        console.error("Failed to fetch file from IPFS");
        alert("Error fetching file. Please check the CID.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching from IPFS.");
    }
  };

  console.log("Fetching file with CID:", cid);


// Add an event listener for the "Fetch from IPFS" button
document.getElementById('fetchButton').addEventListener('click', async () => {
    console.log('Fetch button clicked'); // Debug log
    const cid = document.getElementById('cidInput').value.trim();
    if (cid) {
        await fetchFromIPFS(cid);
    } else {
        alert('Please enter a CID.');
    }
});

async function testConnection() {
    try {
        const version = await ipfs.version();
        console.log('Connected to IPFS:', version);
        alert('Connected to IPFS Node');
    } catch (error) {
        console.error('Error connecting to IPFS:', error);
        alert('Failed to connect to IPFS. Check IPFS Desktop.');
    }
}

testConnection();

