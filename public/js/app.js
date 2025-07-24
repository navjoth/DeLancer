const applyProjectBtn = document.getElementById('applyProjectBtn');
const completeProjectBtn = document.getElementById('completeProjectBtn');
const fetchProjectsBtn = document.getElementById('fetchProjectsBtn');
const projectTable = document.getElementById('projectTable');
// const fetchFreelancersBtn = document.getElementById('fetchFreelancersBtn');
const freelancerTable = document.getElementById('freelancerTable');
const assignFreelancerBtn = document.getElementById('assignFreelancerBtn');
// console.log("hi");
const contractAddress = '0xa37f91B663cdFBC6Df52Fc5fe7aC709454733bd5';
const contractABI = [
          {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "proposedFee",
          "type": "uint256"
        }
      ],
      "name": "FreelancerAssigned",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "FundsAutoReleased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bidAmount",
          "type": "uint256"
        }
      ],
      "name": "FundsDeposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bidAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "name": "FundsReleased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "employerAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "freelancerAmount",
          "type": "uint256"
        }
      ],
      "name": "FundsSplit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bidAmount",
          "type": "uint256"
        }
      ],
      "name": "ProjectApplied",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "employer",
          "type": "address"
        }
      ],
      "name": "ProjectApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "employer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "bidAmount",
          "type": "uint256"
        }
      ],
      "name": "ProjectCompleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "employer",
          "type": "address"
        }
      ],
      "name": "ProjectCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "employer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ProjectDisputed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ProjectMarkedReadyForReview",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ProjectResubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "ReputationAwarded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "reason",
          "type": "string"
        }
      ],
      "name": "TransferFailed",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "EMPLOYER_REDISPUTE_DEADLINE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "EMPLOYER_REVIEW_DEADLINE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "FREELANCER_RESUBMIT_DEADLINE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "feeProposals",
      "outputs": [
        {
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "proposedFee",
          "type": "uint256"
        },
        {
          "internalType": "enum HireChain.ExperienceLevel",
          "name": "experienceLevel",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "freelancers",
      "outputs": [
        {
          "internalType": "address",
          "name": "freelancerAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "reputation",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "assignedProjects",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "completedProjects",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "projectCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "projects",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "employer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "freelancer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "bidAmount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "completed",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isPaid",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "employerFileCID",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "reviewStatuses",
      "outputs": [
        {
          "internalType": "enum HireChain.ProjectState",
          "name": "state",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "readyForReviewTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "disputeTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "employerApproved",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "freelancerFileCID",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "stateMutability": "payable",
      "type": "receive",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_employerFileCID",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "_requiredSkills",
          "type": "string[]"
        }
      ],
      "name": "createProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        }
      ],
      "name": "depositFunds",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_bidAmount",
          "type": "uint256"
        },
        {
          "internalType": "enum HireChain.ExperienceLevel",
          "name": "_experienceLevel",
          "type": "uint8"
        },
        {
          "internalType": "string[]",
          "name": "_freelancerSkills",
          "type": "string[]"
        }
      ],
      "name": "applyForProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        }
      ],
      "name": "assignFreelancer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        }
      ],
      "name": "completeProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        }
      ],
      "name": "releaseFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_freelancer",
          "type": "address"
        }
      ],
      "name": "getFreelancerReputation",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getFreelancers",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_freelancerFileCID",
          "type": "string"
        }
      ],
      "name": "markReadyForReview",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        }
      ],
      "name": "approveProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        }
      ],
      "name": "disputeProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_freelancerFileCID",
          "type": "string"
        }
      ],
      "name": "resubmitProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        }
      ],
      "name": "checkDeadlines",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];

let web3;
let contract;
let userAccount;

// --- IPFS Integration ---
const pinataApiKey = '9a556408347e293c61c5'; // Replace with your Pinata API key
const pinataSecretApiKey = '111f43173897523b5c11fdccc3ea5ba85140548e6e9dfe680c31072a79086aad'; // Replace with your Pinata secret API key

// Function to upload a file to Pinata IPFS
async function uploadFileToIPFS(file) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey
      }
    });
    return response.data.IpfsHash; // Return the CID
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error(`Failed to upload file to IPFS: ${error.message}`);
  }
}

// Function to fetch a file from IPFS using a public gateway
function getIPFSFileUrl(cid) {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

async function init() {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      await ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      userAccount = accounts[0];
      contract = new web3.eth.Contract(contractABI, contractAddress);
      document.getElementById('userAccount').textContent = `Connected Wallet: ${userAccount}`;
    } else {
      alert('MetaMask is not installed. Please install it to use this app.');
    }
  } catch (error) {
    console.error('Error initializing app:', error);
    alert('Failed to connect to wallet. Ensure MetaMask is installed and try again.');
  }
}

// async function fetchFreelancers() {
//   try {
//     console.log('Fetching project count for freelancers...');
//     const projectCount = await contract.methods.projectCount().call();
//     console.log(`Project count: ${projectCount}`);

//     const freelancers = new Set();
//     const freelancerData = [];

//     if (projectCount == 0) {
//       console.log('No projects exist, so no freelancers can be found.');
//     }

//     for (let i = 1; i <= projectCount; i++) {
//       console.log(`Fetching proposals for project ${i}...`);
//       try {
//         const proposals = await contract.methods.feeProposals(i).call();
//         console.log(`Proposals for project ${i}:`, proposals);
//         if (proposals.length > 0) {
//           console.log(`Found ${proposals.length} proposals for project ${i}`);
//           for (let j = 0; j < proposals.length; j++) {
//             const freelancer = proposals[j].freelancer;
//             console.log(`Proposal ${j} freelancer address: ${freelancer}`);
//             if (freelancer && freelancer !== '0x0000000000000000000000000000000000000000') {
//               console.log(`Adding freelancer ${freelancer} to the set`);
//               freelancers.add(freelancer);
//             } else {
//               console.log(`Skipping proposal ${j}: Invalid freelancer address (${freelancer})`);
//             }
//           }
//         } else {
//           console.log(`No proposals found for project ${i}`);
//         }
//       } catch (error) {
//         console.error(`Error fetching proposals for project ${i}:`, error);
//       }
//     }

//     console.log(`Total unique freelancers found: ${freelancers.size}`);
//     for (let freelancer of freelancers) {
//       console.log(`Fetching data for freelancer ${freelancer}...`);
//       let reputation, freelancerInfo, completionRate;
//       try {
//         reputation = await contract.methods.getFreelancerReputation(freelancer).call();
//         console.log(`Reputation for ${freelancer}: ${reputation}`);
//       } catch (error) {
//         console.error(`Error fetching reputation for ${freelancer}:`, error);
//         reputation = 'N/A';
//       }

//       try {
//         freelancerInfo = await contract.methods.freelancers(freelancer).call();
//         console.log(`Freelancer info for ${freelancer}:`, freelancerInfo);
//         const assignedProjects = Number(freelancerInfo.assignedProjects || 0);
//         const completedProjects = Number(freelancerInfo.completedProjects || 0);
//         completionRate = assignedProjects === 0 ? 100 : Math.round((completedProjects * 100) / assignedProjects);
//         console.log(`Completion rate for ${freelancer}: ${completionRate}%`);
//       } catch (error) {
//         console.error(`Error fetching freelancer info for ${freelancer}:`, error);
//         completionRate = 'N/A';
//       }

//       freelancerData.push({
//         address: freelancer,
//         reputation: Number(reputation) || reputation,
//         completionRate: completionRate
//       });
//     }

//     const freelancerTableElement = document.getElementById('freelancerTable');
//     freelancerTableElement.innerHTML = '';

//     if (freelancerData.length === 0) {
//       console.log('No freelancers to display.');
//       freelancerTableElement.innerHTML = '<p>No freelancers found.</p>';
//       return;
//     }

//     console.log(`Displaying ${freelancerData.length} freelancers...`);
//     freelancerData.forEach((data, index) => {
//       const freelancerElement = document.createElement('div');
//       freelancerElement.style.setProperty('--index', index);
//       freelancerElement.innerHTML = `
//         <strong>Freelancer Address:</strong> ${data.address} <br />
//         <strong>Reputation:</strong> ${data.reputation} REP <br />
//         <strong>Completion Rate:</strong> ${data.completionRate}% <br />
//         <hr />
//       `;
//       freelancerTableElement.appendChild(freelancerElement);
//     });
//   } catch (error) {
//     console.error('Error fetching freelancers:', error);
//     alert('Failed to fetch freelancers. Check the console for details.');
//   }
// }

async function createProject(event) {
  event.preventDefault(); // Prevent the form from submitting traditionally
  console.log('Starting createProject...');

  // Get values from the form
  const name = document.getElementById('projectName').value;
  const description = document.getElementById('projectDescription').value;
  const requiredSkills = document.getElementById('requiredSkills').value?.split(',').map(skill => skill.trim()) || [];
  console.log('Project details:', { name, description, requiredSkills });

  // Validate inputs
  if (!name || !description) {
    alert('Project name and description are required.');
    console.log('Validation failed: Name or description missing.');
    return;
  }

  let employerFileCID = '';
  const fileInput = document.getElementById('employerFile');
  const file = fileInput.files[0];
  if (file) {
    console.log('File selected:', file.name);
    try {
      employerFileCID = await uploadFileToIPFS(file);
      console.log('File uploaded to IPFS, CID:', employerFileCID);
      alert('File uploaded to IPFS successfully! CID: ' + employerFileCID);
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      alert('Failed to upload file to IPFS: ' + error.message);
      return;
    }
  } else {
    console.log('No file selected, proceeding with empty employerFileCID.');
  }

  console.log('Proceeding with employerFileCID:', employerFileCID);
  await createProjectOnBlockchain(name, description, employerFileCID, requiredSkills);

  // Reset the form after submission
  document.getElementById('createProjectForm').reset();
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createProjectOnBlockchain(name, description, employerFileCID, requiredSkills) {
  console.log('Calling createProject on smart contract...');
  try {
    const receipt = await contract.methods.createProject(name, description, employerFileCID, requiredSkills).send({ from: userAccount });
    console.log('Project Created:', receipt);
    alert('Project created successfully!');
    // Add a 2-second delay to ensure the blockchain has processed the transaction
    console.log('Waiting for blockchain to sync...');
    await delay(2000); // 2 seconds
    console.log('Fetching updated projects...');
    await fetchProjects();
  } catch (error) {
    console.error('Error creating project:', error);
    alert('Failed to create project: ' + error.message);
  }
}

async function applyForProject() {
  const projectId = prompt('Enter the project ID to apply:');
  const bidAmount = prompt('Enter your bid amount (in ETH):');
  const experienceLevel = prompt('Enter your experience level (0 for Beginner, 1 for Intermediate, 2 for Expert):');
  const freelancerSkills = prompt('Enter your skills (comma-separated, e.g., Solidity,JavaScript,UI/UX):')?.split(',').map(skill => skill.trim()) || [];
  if (!projectId || isNaN(projectId) || !bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0 || !experienceLevel || !['0', '1', '2'].includes(experienceLevel)) {
    alert('Invalid input. Please enter a valid project ID, bid amount greater than zero, and experience level (0, 1, or 2).');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    if (project.freelancer !== '0x0000000000000000000000000000000000000000') {
      alert('Project already has a freelancer. Application denied.');
      return;
    }
    if (project.employer === userAccount) {
      alert('You cannot apply for your own project.');
      return;
    }
    if (project.completed) {
      alert('This project is already completed.');
      return;
    }

    const bidAmountWei = web3.utils.toWei(bidAmount, 'ether');
    const receipt = await contract.methods.applyForProject(projectId, bidAmountWei, experienceLevel, freelancerSkills).send({ from: userAccount });
    console.log('Applied for Project:', receipt);
    alert(`Application submitted successfully for Project ID: ${projectId} with Bid: ${bidAmount} ETH`);
    fetchProjects();
  } catch (error) {
    console.error('Error applying for project:', error);
    alert('Failed to apply for the project. Check console for details.');
  }
}

async function assignFreelancer() {
  const projectId = prompt('Enter the project ID to assign a freelancer:');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
      alert('Only the employer can assign a freelancer!');
      return;
    }
    if (project.freelancer !== '0x0000000000000000000000000000000000000000') {
      alert('A freelancer is already assigned to this project!');
      return;
    }

    const receipt = await contract.methods.assignFreelancer(projectId).send({ from: userAccount });
    console.log('Freelancer Assigned:', receipt);
    alert(`Freelancer assigned successfully to Project ID: ${projectId}`);
    fetchProjects();
  } catch (error) {
    console.error('Error assigning freelancer:', error);
    alert('Failed to assign freelancer. Check the console for details.');
  }
}

async function completeProject() {
  const projectId = prompt('Enter the project ID to mark as complete:');
  if (projectId) {
    try {
      const project = await contract.methods.projects(projectId).call();
      if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
        alert('Only the employer can mark the project as complete!');
        return;
      }
      if (project.freelancer === '0x0000000000000000000000000000000000000000') {
        alert('No freelancer assigned to this project!');
        return;
      }

      const receipt = await contract.methods.completeProject(projectId).send({ from: userAccount });
      console.log('Transaction receipt:', receipt);
      alert('Project marked as complete!');
      fetchProjects();
    } catch (error) {
      console.error('Error completing project:', error);
      alert('Failed to complete project. Check the console for details.');
    }
  }
}

async function fetchProjects() {
  try {
    console.log('Fetching project count...');
    let projectCount;
    try {
      projectCount = await contract.methods.projectCount().call();
      console.log(`Project count: ${projectCount}`);
    } catch (error) {
      console.error('Error fetching project count:', error);
      throw new Error('Failed to fetch project count: ' + error.message);
    }

    const projectTableElement = document.getElementById('projectTable');
    projectTableElement.innerHTML = '';

    if (projectCount == 0) { // Use == to handle potential string return
      projectTableElement.innerHTML = '<p>No projects found.</p>';
      return;
    }

    for (let i = 1; i <= projectCount; i++) {
      console.log(`Fetching project ${i}...`);
      let project, reviewStatus;
      try {
        project = await contract.methods.projects(i).call();
        console.log(`Project ${i} details:`, project);
      } catch (error) {
        console.error(`Error fetching project ${i}:`, error);
        projectTableElement.innerHTML += `<p>Error fetching project ${i}: ${error.message}</p>`;
        continue; // Skip to the next project
      }

      try {
        reviewStatus = await contract.methods.reviewStatuses(i).call();
        console.log(`Review status for project ${i}:`, reviewStatus);
      } catch (error) {
        console.error(`Error fetching review status for project ${i}:`, error);
        reviewStatus = { freelancerFileCID: '', state: '0' }; // Fallback
      }

      let applicantsHtml = '';
      try {
        const proposals = await contract.methods.feeProposals(i).call();
        console.log(`Proposals for project ${i}:`, proposals);
        if (proposals.length > 0) {
          for (let j = 0; j < proposals.length; j++) {
            const freelancer = proposals[j].freelancer;
            const proposedFee = web3.utils.fromWei(proposals[j].proposedFee || '0', 'ether');
            let reputation = 'N/A';
            try {
              reputation = await contract.methods.getFreelancerReputation(freelancer).call();
            } catch (error) {
              console.error(`Error fetching reputation for freelancer ${freelancer}:`, error);
            }
            const experienceLevel = proposals[j].experienceLevel == 0 ? 'Beginner' : proposals[j].experienceLevel == 1 ? 'Intermediate' : 'Expert';
            // Safely handle freelancerSkills
            const skills = Array.isArray(proposals[j].freelancerSkills) ? proposals[j].freelancerSkills.join(', ') : proposals[j].freelancerSkills || 'N/A';
            applicantsHtml += `Freelancer: ${freelancer}, Fee: ${proposedFee} ETH, Reputation: ${reputation} REP, Experience: ${experienceLevel}, Skills: ${skills}<br>`;
          }
        } else {
          applicantsHtml = 'No applicants yet';
        }
      } catch (proposalError) {
        console.error(`Error fetching proposals for project ${i}:`, proposalError);
        applicantsHtml = 'Error fetching applicants';
      }

      const employerFileLink = project.employerFileCID ? `<a href="${getIPFSFileUrl(project.employerFileCID)}" target="_blank">View Employer File</a>` : 'N/A';
      const freelancerFileLink = reviewStatus.freelancerFileCID ? `<a href="${getIPFSFileUrl(reviewStatus.freelancerFileCID)}" target="_blank">View Freelancer File</a>` : 'N/A';

      const projectElement = document.createElement('div');
      projectElement.style.setProperty('--index', i - 1);
      projectElement.innerHTML = `
        <strong>ID:</strong> ${project.id || i} <br />
        <strong>Name:</strong> ${project.name || 'N/A'} <br />
        <strong>Description:</strong> ${project.description || 'N/A'} <br />
        <strong>Employer:</strong> ${project.employer || 'N/A'} <br />
        <strong>Freelancer:</strong> ${project.freelancer || 'N/A'} <br />
        <strong>Bid Amount:</strong> ${project.bidAmount ? web3.utils.fromWei(project.bidAmount, 'ether') : 'N/A'} ETH <br />
        <strong>Completed:</strong> ${project.completed ? 'Yes' : 'No'} <br />
        <strong>Required Skills:</strong> ${Array.isArray(project.requiredSkills) ? project.requiredSkills.join(', ') : project.requiredSkills || 'N/A'} <br />
        <strong>Applicants:</strong> ${applicantsHtml} <br />
        <strong>Employer File:</strong> ${employerFileLink} <br />
        <strong>Freelancer File:</strong> ${freelancerFileLink} <br />
        <hr />
      `;
      projectTableElement.appendChild(projectElement);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    alert('Failed to fetch projects. Check the console for details.');
  }
}

async function releaseFunds() {
  const projectId = prompt('Enter the project ID to release funds:');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
      alert('Only the employer can release funds!');
      return;
    }
    if (!project.completed) {
      alert('Project must be completed before releasing funds!');
      return;
    }
    if (project.isPaid) {
      alert('Funds have already been released for this project!');
      return;
    }

    const receipt = await contract.methods.releaseFunds(projectId).send({ from: userAccount });
    console.log('Funds Released:', receipt);
    if (receipt.status) {
      alert(`Funds released successfully for Project ID: ${projectId}`);
    } else {
      alert(`Funds release failed for Project ID: ${projectId}. Check console for details.`);
    }
    fetchProjects();
  } catch (error) {
    console.error('Error releasing funds:', error);
    alert('Failed to release funds. Check the console for details.');
  }
}

const releaseFundsBtn = document.getElementById('releaseFundsBtn');
if (releaseFundsBtn) {
  releaseFundsBtn.addEventListener('click', releaseFunds);
}

async function depositFunds() {
  const projectId = prompt('Enter the project ID to deposit funds:');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
      alert('Only the employer can deposit funds!');
      return;
    }
    if (project.bidAmount == 0) {
      alert('No bid amount set for this project. Assign a freelancer first.');
      return;
    }

    const bidAmount = web3.utils.fromWei(project.bidAmount, 'ether');
    const confirmDeposit = confirm(`Deposit ${bidAmount} ETH for Project ID: ${projectId}?`);
    if (!confirmDeposit) return;

    const receipt = await contract.methods.depositFunds(projectId).send({
      from: userAccount,
      value: project.bidAmount
    });
    console.log('Funds Deposited:', receipt);
    alert(`Funds deposited successfully for Project ID: ${projectId}`);
    fetchProjects();
  } catch (error) {
    console.error('Error depositing funds:', error);
    alert('Failed to deposit funds. Check the console for details.');
  }
}

const depositFundsBtn = document.getElementById('depositFundsBtn');
if (depositFundsBtn) {
  depositFundsBtn.addEventListener('click', depositFunds);
}

async function markReadyForReview() {
  const projectId = prompt('Enter the project ID to mark as ready for review:');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  let freelancerFileCID = '';
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.pdf,.zip,.doc,.docx';
  fileInput.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    try {
      freelancerFileCID = await uploadFileToIPFS(file);
      alert('File uploaded to IPFS successfully! CID: ' + freelancerFileCID);
    } catch (error) {
      alert(error.message);
      return;
    }

    try {
      const project = await contract.methods.projects(projectId).call();
      if (project.freelancer.toLowerCase() !== userAccount.toLowerCase()) {
        alert('Only the assigned freelancer can mark the project as ready for review!');
        return;
      }
      if (project.isPaid) {
        alert('Funds have already been released for this project!');
        return;
      }

      const reviewStatus = await contract.methods.reviewStatuses(projectId).call();
      if (reviewStatus.state != 0) {
        alert('Project is not in active state!');
        return;
      }

      const receipt = await contract.methods.markReadyForReview(projectId, freelancerFileCID).send({ from: userAccount });
      console.log('Marked Ready for Review:', receipt);
      alert(`Project ID ${projectId} marked as ready for review! Employer has 7 days to respond.`);
      fetchProjects();
    } catch (error) {
      console.error('Error marking project as ready for review:', error);
      alert(`Failed to mark project as ready for review: ${error.message}`);
    }
  };
  fileInput.click();
}

async function approveProject() {
  const projectId = prompt('Enter the project ID to approve:');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
      alert('Only the employer can approve the project!');
      return;
    }
    if (project.isPaid) {
      alert('Funds have already been released for this project!');
      return;
    }

    const reviewStatus = await contract.methods.reviewStatuses(projectId).call();
    if (reviewStatus.state != 1 && reviewStatus.state != 3) {
      alert('Project is not ready for review or resubmitted!');
      return;
    }

    const receipt = await contract.methods.approveProject(projectId).send({ from: userAccount });
    console.log('Project Approved:', receipt);
    alert(`Project ID ${projectId} approved! Funds released to freelancer.`);
    fetchProjects();
  } catch (error) {
    console.error('Error approving project:', error);
    alert(`Failed to approve project: ${error.message}`);
  }
}

async function disputeProject() {
  const projectId = prompt('Enter the project ID to dispute:');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
      alert('Only the employer can dispute the project!');
      return;
    }
    if (project.isPaid) {
      alert('Funds have already been released for this project!');
      return;
    }

    const reviewStatus = await contract.methods.reviewStatuses(projectId).call();
    if (reviewStatus.state != 1 && reviewStatus.state != 3) {
      alert('Project is not ready for dispute!');
      return;
    }

    const receipt = await contract.methods.disputeProject(projectId).send({ from: userAccount });
    console.log('Project Disputed:', receipt);
    alert(`Project ID ${projectId} disputed! Freelancer has 3 days to resubmit.`);
    fetchProjects();
  } catch (error) {
    console.error('Error disputing project:', error);
    alert(`Failed to dispute project: ${error.message}`);
  }
}

// async function resubmitProject() {
//   const projectId = prompt('Enter the project ID to resubmit:');
//   if (!projectId || isNaN(projectId)) {
//     alert('Invalid input. Please enter a valid project ID.');
//     return;
//   }

//   let freelancerFileCID = '';
//   const fileInput = document.createElement('input');
//   fileInput.type = 'file';
//   fileInput.accept = '.pdf,.zip,.doc,.docx';
//   fileInput.onchange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) {
//       alert('Please select a file to upload.');
//       return;
//     }

//     try {
//       freelancerFileCID = await uploadFileToIPFS(file);
//       alert('File uploaded to IPFS successfully! CID: ' + freelancerFileCID);
//     } catch (error) {
//       alert(error.message);
//       return;
//     }

//     try {
//       const project = await contract.methods.projects(projectId).call();
//       if (project.freelancer.toLowerCase() !== userAccount.toLowerCase()) {
//         alert('Only the assigned freelancer can resubmit the project!');
//         return;
//       }
//       if (project.isPaid) {
//         alert('Funds have already been released for this project!');
//         return;
//       }

//       const reviewStatus = await contract.methods.reviewStatuses(projectId).call();
//       if (reviewStatus.state != 2) {
//         alert('Project is not in disputed state!');
//         return;
//       }

//       const deadline_Chelsea = parseInt(reviewStatus.disputeTimestamp) + (3 * 24 * 60 * 60);
//       if (Math.floor(Date.now() / 1000) > deadline) {
//         alert('Resubmission deadline has passed!');
//         return;
//       }

//       const receipt = await contract.methods.resubmitProject(projectId, freelancerFileCID).send({ from: userAccount });
//       console.log('Project Resubmitted:', receipt);
//       alert(`Project ID ${projectId} resubmitted! Employer has 3 days to review.`);
//       fetchProjects();
//     } catch (error) {
//       console.error('Error resubmitting project:', error);
//       alert(`Failed to resubmit project: ${error.message}`);
//     }
//   };
//   fileInput.click();
// }

async function resubmitProject() {
  const projectId = prompt('Enter the project ID to resubmit:');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  let freelancerFileCID = '';
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.pdf,.zip,.doc,.docx';
  fileInput.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    try {
      freelancerFileCID = await uploadFileToIPFS(file);
      alert('File uploaded to IPFS successfully! CID: ' + freelancerFileCID);
    } catch (error) {
      alert(error.message);
      return;
    }

    try {
      const project = await contract.methods.projects(projectId).call();
      if (project.freelancer.toLowerCase() !== userAccount.toLowerCase()) {
        alert('Only the assigned freelancer can resubmit the project!');
        return;
      }
      if (project.isPaid) {
        alert('Funds have already been released for this project!');
        return;
      }

      const reviewStatus = await contract.methods.reviewStatuses(projectId).call();
      console.log('Review Status:', reviewStatus);
      console.log('Dispute Timestamp:', reviewStatus.disputeTimestamp);
      console.log('Current Time (Unix seconds):', Math.floor(Date.now() / 1000));

      if (reviewStatus.state != 2) {
        alert('Project is not in disputed state!');
        return;
      }

      if (!reviewStatus.disputeTimestamp || parseInt(reviewStatus.disputeTimestamp) === 0) {
        alert('Dispute timestamp not set. Cannot resubmit.');
        return;
      }

      const deadline_Chelsea = parseInt(reviewStatus.disputeTimestamp) + (3 * 24 * 60 * 60);
      console.log('Calculated Deadline (Unix seconds):', deadline_Chelsea);

      if (Math.floor(Date.now() / 1000) > deadline_Chelsea) {
        alert('Resubmission deadline has passed!');
        return;
      }

      const receipt = await contract.methods.resubmitProject(projectId, freelancerFileCID).send({ from: userAccount });
      console.log('Project Resubmitted:', receipt);
      alert(`Project ID ${projectId} resubmitted! Employer has 3 days to review.`);
      fetchProjects();
    } catch (error) {
      console.error('Error resubmitting project:', error);
      alert(`Failed to resubmit project: ${error.message}`);
    }
  };
  fileInput.click();
}

async function checkDeadlines() {
  const projectId = prompt('Enter the project ID to check deadlines:');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    if (project.isPaid) {
      alert('Funds have already been released for this project!');
      return;
    }

    const reviewStatus = await contract.methods.reviewStatuses(projectId).call();
    if (reviewStatus.state == 0 || reviewStatus.state == 4) {
      alert('Project is not in a review state!');
      return;
    }

    const receipt = await contract.methods.checkDeadlines(projectId).send({ from: userAccount });
    console.log('Deadlines Checked:', receipt);
    alert(`Deadlines checked for Project ID ${projectId}. Check project status.`);
    fetchProjects();
  } catch (error) {
    console.error('Error checking deadlines:', error);
    alert(`Failed to check deadlines: ${error.message}`);
  }
}

const markReadyBtn = document.getElementById('markReadyBtn');
if (markReadyBtn) {
  markReadyBtn.addEventListener('click', markReadyForReview);
}

const approveBtn = document.getElementById('approveBtn');
if (approveBtn) {
  approveBtn.addEventListener('click', approveProject);
}

const disputeBtn = document.getElementById('disputeBtn');
if (disputeBtn) {
  disputeBtn.addEventListener('click', disputeProject);
}

const resubmitBtn = document.getElementById('resubmitBtn');
if (resubmitBtn) {
  resubmitBtn.addEventListener('click', resubmitProject);
}

const checkDeadlinesBtn = document.getElementById('checkDeadlinesBtn');
if (checkDeadlinesBtn) {
  checkDeadlinesBtn.addEventListener('click', checkDeadlines);
}

// Attach event listeners to buttons
applyProjectBtn.addEventListener('click', applyForProject);
completeProjectBtn.addEventListener('click', completeProject);
fetchProjectsBtn.addEventListener('click', fetchProjects);
// fetchFreelancersBtn.addEventListener('click', fetchFreelancers);
assignFreelancerBtn.addEventListener('click', assignFreelancer);

// Attach event listener to the form
document.getElementById('createProjectForm').addEventListener('submit', createProject);

// Initialize the app
window.addEventListener('load', init);