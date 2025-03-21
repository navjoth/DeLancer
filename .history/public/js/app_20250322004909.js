const createProjectBtn = document.getElementById('createProjectBtn');
const applyProjectBtn = document.getElementById('applyProjectBtn');
const completeProjectBtn = document.getElementById('completeProjectBtn');
const fetchProjectsBtn = document.getElementById('fetchProjectsBtn');
const projectTable = document.getElementById('projectTable');
const fetchFreelancersBtn = document.getElementById('fetchFreelancersBtn');
const freelancerTable = document.getElementById('freelancerTable');
const assignFreelancerBtn = document.getElementById('assignFreelancerBtn');

const contractAddress = '0x59Cb27bD15c29efb827D009269535ceaF5D068b4'; // Replace with the deployed HireChain address
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_reputationTokenAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "reputationToken",
    "outputs": [
      {
        "internalType": "contract IReputationToken",
        "name": "",
        "type": "address"
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
let ipfs;

// Initialize IPFS client to connect to IPFS Desktop
async function initIPFS() {
  try {
    // Connect to IPFS Desktop running on localhost:5001
    ipfs = window.IpfsHttpClient({
      host: 'localhost',
      port: 5001,
      protocol: 'http'
    });
    console.log('Connected to IPFS Desktop');
  } catch (error) {
    console.error('Error connecting to IPFS Desktop:', error);
    alert('Failed to connect to IPFS Desktop. Ensure IPFS Desktop is running and try again.');
  }
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
      await initIPFS(); // Initialize IPFS after Web3 setup
    } else {
      alert('MetaMask is not installed. Please install it to use this app.');
    }
  } catch (error) {
    console.error('Error initializing app:', error);
    alert('Failed to connect to wallet. Ensure MetaMask is installed and try again.');
  }
}

async function fetchFreelancers() {
  try {
    const projectCount = await contract.methods.projectCount().call();
    const freelancers = new Set();
    const freelancerData = [];

    for (let i = 1; i <= projectCount; i++) {
      const project = await contract.methods.projects(i).call();
      if (project.freelancer !== '0x0000000000000000000000000000000000000000') {
        freelancers.add(project.freelancer);
      }
    }

    for (let freelancer of freelancers) {
      const reputation = await contract.methods.getFreelancerReputation(freelancer).call();
      freelancerData.push({
        address: freelancer,
        reputation: web3.utils.fromWei(reputation, 'ether')
      });
    }

    const freelancerTableElement = document.getElementById('freelancerTable');
    freelancerTableElement.innerHTML = '';

    if (freelancerData.length === 0) {
      freelancerTableElement.innerHTML = '<p>No freelancers found.</p>';
      return;
    }

    freelancerData.forEach(data => {
      const freelancerElement = document.createElement('div');
      freelancerElement.innerHTML = `
        <strong>Freelancer Address:</strong> ${data.address} <br />
        <strong>Reputation:</strong> ${data.reputation} REP <br />
        <hr />
      `;
      freelancerTableElement.appendChild(freelancerElement);
    });
  } catch (error) {
    console.error('Error fetching freelancers:', error);
    alert('Failed to fetch freelancers. Check the console for details.');
  }
}

async function createProject() {
  const name = prompt('Enter the project name:');
  const description = prompt('Enter the project description:');
  if (!name || !description) {
    alert('Project name and description are required.');
    return;
  }

  let employerFileCID = '';
  const employerFileInput = document.getElementById('employerFileInput');
  if (employerFileInput && employerFileInput.files.length > 0) {
    try {
      const file = employerFileInput.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      const buffer = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
      const ipfsResult = await ipfs.add(buffer);
      employerFileCID = ipfsResult.path;
      console.log('Employer file uploaded to IPFS with CID:', employerFileCID);
    } catch (error) {
      console.error('Error uploading employer file to IPFS:', error);
      alert('Failed to upload employer file to IPFS: ' + error.message);
      return;
    }
  }

  try {
    const receipt = await contract.methods.createProject(name, description, employerFileCID).send({ from: userAccount });
    console.log('Project Created:', receipt);
    alert('Project created successfully!');
    fetchProjects();
    employerFileInput.value = ''; // Clear the file input
  } catch (error) {
    console.error('Error creating project:', error);
    alert('Failed to create project: ' + error.message);
  }
}

async function applyForProject() {
  const projectId = prompt('Enter the project ID to apply:');
  const bidAmount = prompt('Enter your bid amount (in ETH):');
  if (!projectId || isNaN(projectId) || !bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
    alert('Invalid input. Please enter a valid project ID and bid amount greater than zero.');
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
    const receipt = await contract.methods.applyForProject(projectId, bidAmountWei).send({ from: userAccount });
    console.log('Applied for Project:', receipt);
    alert(`Application submitted successfully for Project ID: ${projectId} with Bid: ${bidAmount} ETH`);
    fetchProjects();
  } catch (error) {
    console.error('Error applying for project:', error);
    alert('Failed to apply for the project: ' + error.message);
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
    alert('Failed to assign freelancer: ' + error.message);
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
      alert('Failed to complete project: ' + error.message);
    }
  }
}

async function fetchProjects() {
  try {
    console.log('Fetching project count...');
    const projectCount = await contract.methods.projectCount().call();
    console.log(`Project count: ${projectCount}`);

    projectTable.innerHTML = '';
    if (projectCount === 0) {
      projectTable.innerHTML = '<tr><td colspan="10">No projects found.</td></tr>';
      return;
    }

    for (let i = 1; i <= projectCount; i++) {
      console.log(`Fetching project ${i}...`);
      const project = await contract.methods.projects(i).call();
      console.log(`Project ${i} details:`, project);

      let applicantsHtml = '';
      try {
        const proposals = await contract.methods.feeProposals(i).call();
        console.log(`Proposals for project ${i}:`, proposals);
        if (proposals.length > 0) {
          for (let j = 0; j < proposals.length; j++) {
            const freelancer = proposals[j].freelancer;
            const proposedFee = web3.utils.fromWei(proposals[j].proposedFee, 'ether');
            const reputation = await contract.methods.getFreelancerReputation(freelancer).call();
            applicantsHtml += `Freelancer: ${freelancer}, Fee: ${proposedFee} ETH, Reputation: ${web3.utils.fromWei(reputation, 'ether')} REP<br>`;
          }
        } else {
          applicantsHtml = 'No applicants yet';
        }
      } catch (proposalError) {
        console.error(`Error fetching proposals for project ${i}:`, proposalError);
        applicantsHtml = 'Error fetching applicants';
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${project.id}</td>
        <td>${project.name}</td>
        <td>${project.description}</td>
        <td>${project.employer}</td>
        <td>${project.freelancer || 'N/A'}</td>
        <td>${project.bidAmount ? web3.utils.fromWei(project.bidAmount, 'ether') : 'N/A'} ETH</td>
        <td>${project.completed ? 'Yes' : 'No'}</td>
        <td>${applicantsHtml}</td>
        <td>${project.employerFileCID ? `<button onclick="fetchFile('${project.employerFileCID}')">Fetch Employer File</button>` : 'N/A'}</td>
        <td>${project.freelancerFileCID ? `<button onclick="fetchFile('${project.freelancerFileCID}')">Fetch Freelancer File</button>` : 'N/A'}</td>
      `;
      projectTable.appendChild(row);
    }
  } catch (error) {
    console.error('Error fetching projects:', error);
    alert('Failed to fetch projects: ' + error.message);
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
    alert('Failed to release funds: ' + error.message);
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
    alert('Failed to deposit funds: ' + error.message);
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
  const freelancerFileInput = document.getElementById('freelancerFileInput');
  if (freelancerFileInput && freelancerFileInput.files.length > 0) {
    try {
      const file = freelancerFileInput.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      const buffer = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
      const ipfsResult = await ipfs.add(buffer);
      freelancerFileCID = ipfsResult.path;
      console.log('Freelancer file uploaded to IPFS with CID:', freelancerFileCID);
    } catch (error) {
      console.error('Error uploading freelancer file to IPFS:', error);
      alert('Failed to upload freelancer file to IPFS: ' + error.message);
      return;
    }
  } else {
    alert('Please upload a file to submit your work.');
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
    freelancerFileInput.value = ''; // Clear the file input
  } catch (error) {
    console.error('Error marking project as ready for review:', error);
    alert(`Failed to mark project as ready for review: ${error.message}`);
  }
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

async function resubmitProject() {
  const projectId = prompt('Enter the project ID to resubmit:');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  let freelancerFileCID = '';
  const freelancerFileInput = document.getElementById('freelancerFileInput');
  if (freelancerFileInput && freelancerFileInput.files.length > 0) {
    try {
      const file = freelancerFileInput.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      const buffer = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
      const ipfsResult = await ipfs.add(buffer);
      freelancerFileCID = ipfsResult.path;
      console.log('Freelancer file uploaded to IPFS with CID:', freelancerFileCID);
    } catch (error) {
      console.error('Error uploading freelancer file to IPFS:', error);
      alert('Failed to upload freelancer file to IPFS: ' + error.message);
      return;
    }
  } else {
    alert('Please upload a file to resubmit your work.');
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
    if (reviewStatus.state != 2) {
      alert('Project is not in disputed state!');
      return;
    }

    const deadline = parseInt(reviewStatus.disputeTimestamp) + (3 * 24 * 60 * 60);
    if (Math.floor(Date.now() / 1000) > deadline) {
      alert('Resubmission deadline has passed!');
      return;
    }

    const receipt = await contract.methods.resubmitProject(projectId, freelancerFileCID).send({ from: userAccount });
    console.log('Project Resubmitted:', receipt);
    alert(`Project ID ${projectId} resubmitted! Employer has 3 days to review.`);
    fetchProjects();
    freelancerFileInput.value = ''; // Clear the file input
  } catch (error) {
    console.error('Error resubmitting project:', error);
    alert(`Failed to resubmit project: ${error.message}`);
  }
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

// Fetch file from IPFS and display it
async function fetchFile(cid) {
  try {
    const fileContent = await ipfs.get(cid);
    const fileDisplay = document.getElementById('fileDisplay');
    fileDisplay.innerHTML = '';

    for await (const file of fileContent) {
      if (!file.content) continue;

      const content = [];
      for await (const chunk of file.content) {
        content.push(chunk);
      }

      const blob = new Blob(content, { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ipfs-file-${cid}`;
      link.textContent = `Download File (CID: ${cid})`;
      fileDisplay.appendChild(link);
      fileDisplay.appendChild(document.createElement('br'));
    }
  } catch (error) {
    console.error('Error fetching file from IPFS:', error);
    alert('Failed to fetch file from IPFS: ' + error.message);
  }
}

// Add event listeners
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

createProjectBtn.addEventListener('click', createProject);
applyProjectBtn.addEventListener('click', applyForProject);
completeProjectBtn.addEventListener('click', completeProject);
fetchProjectsBtn.addEventListener('click', fetchProjects);
fetchFreelancersBtn.addEventListener('click', fetchFreelancers);
assignFreelancerBtn.addEventListener('click', assignFreelancer);

window.addEventListener('load', init);