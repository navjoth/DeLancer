const createProjectBtn = document.getElementById('createProjectBtn');
const applyProjectBtn = document.getElementById('applyProjectBtn');
const completeProjectBtn = document.getElementById('completeProjectBtn');
const fetchProjectsBtn = document.getElementById('fetchProjectsBtn');
const projectTable = document.getElementById('projectTable');
const fetchFreelancersBtn = document.getElementById('fetchFreelancersBtn');
const freelancerTable = document.getElementById('freelancerTable');
const assignFreelancerBtn = document.getElementById('assignFreelancerBtn');

const contractAddress = '0xdC39d97EF230eB43106acF1b9feb5C8498c731e8'; // Replace with the deployed HireChain address
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
        "name": "initiator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "evidence",
        "type": "string"
      }
    ],
    "name": "DisputeInitiated",
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
        "internalType": "enum HireChain.DisputeOutcome",
        "name": "outcome",
        "type": "uint8"
      }
    ],
    "name": "DisputeResolved",
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
    "name": "FundsClaimed",
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
        "name": "recipient",
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
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newReputation",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isPenalty",
        "type": "bool"
      }
    ],
    "name": "ReputationUpdated",
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
        "internalType": "string",
        "name": "evidence",
        "type": "string"
      }
    ],
    "name": "WorkSubmitted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "REPUTATION_PENALTY",
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
    "name": "REVIEW_PERIOD",
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
    "name": "arbiter",
    "outputs": [
      {
        "internalType": "address",
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
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "employerReputation",
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
        "internalType": "enum HireChain.ProjectStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isPaid",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "submissionTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "freelancerEvidence",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "employerEvidence",
        "type": "string"
      },
      {
        "internalType": "enum HireChain.DisputeOutcome",
        "name": "disputeOutcome",
        "type": "uint8"
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
      },
      {
        "internalType": "string",
        "name": "_evidence",
        "type": "string"
      }
    ],
    "name": "submitWork",
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
    "name": "approveWork",
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
    "name": "claimFunds",
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
        "name": "_evidence",
        "type": "string"
      }
    ],
    "name": "initiateDispute",
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
        "internalType": "bool",
        "name": "_freelancerWins",
        "type": "bool"
      }
    ],
    "name": "resolveDispute",
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
  }
];

let web3;
let contract;
let userAccount;

async function init() {
  console.log('Initializing app...');
  const userAccountElement = document.getElementById('userAccount');
  if (!userAccountElement) {
    console.error('userAccount element not found in DOM');
    return;
  }

  try {
    if (!window.ethereum) {
      console.error('MetaMask not detected');
      userAccountElement.textContent = 'MetaMask not detected';
      alert('MetaMask is not installed. Please install it to use this app.');
      return;
    }

    console.log('MetaMask detected, requesting accounts...');
    web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('Accounts received:', accounts);

    if (accounts.length === 0) {
      console.error('No accounts returned from MetaMask');
      userAccountElement.textContent = 'No accounts connected';
      alert('Please connect an account in MetaMask.');
      return;
    }

    userAccount = accounts[0];
    console.log('User account set:', userAccount);

    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log('Contract instance created');

    userAccountElement.textContent = `Connected Wallet: ${userAccount}`;
    console.log('Wallet address displayed on page');
  } catch (error) {
    console.error('Error initializing app:', error);
    userAccountElement.textContent = 'Connection Failed';
    alert('Failed to connect to wallet: ' + error.message);
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
  if (name && description) {
    try {
      const receipt = await contract.methods.createProject(name, description).send({ from: userAccount });
      console.log('Project Created:', receipt);
      alert('Project created successfully!');
      fetchProjects(); // Re-enabled, should work with the updated fetchProjects
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Check the console for details.');
    }
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
    const projectCount = await contract.methods.projectCount().call();
    console.log(`Project count: ${projectCount}`);

    projectTable.innerHTML = '';
    if (projectCount === 0) {
      projectTable.innerHTML = '<tr><td colspan="9">No projects found.</td></tr>';
      return;
    }

    for (let i = 1; i <= projectCount; i++) {
      console.log(`Fetching project ${i}...`);
      const project = await contract.methods.projects(i).call();
      console.log(`Project ${i} details:`, project);

      let applicantsHtml = 'No applicants yet';
      try {
        const proposals = await contract.methods.feeProposals(i).call();
        console.log(`Proposals for project ${i}:`, proposals);
        if (proposals && proposals.length > 0) {
          applicantsHtml = '';
          for (let j = 0; j < proposals.length; j++) {
            const freelancer = proposals[j].freelancer;
            const proposedFee = web3.utils.fromWei(proposals[j].proposedFee, 'ether');
            const reputation = await contract.methods.getFreelancerReputation(freelancer).call();
            applicantsHtml += `Freelancer: ${freelancer}, Fee: ${proposedFee} ETH, Reputation: ${web3.utils.fromWei(reputation, 'ether')} REP<br>`;
          }
        }
      } catch (proposalError) {
        console.error(`Error fetching proposals for project ${i}:`, proposalError);
        applicantsHtml = 'Error fetching applicants (see console)';
      }

      const statusMap = ['Created', 'Assigned', 'Submitted', 'Completed', 'Disputed', 'Resolved'];
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${project.id}</td>
        <td>${project.name}</td>
        <td>${project.description}</td>
        <td>${project.employer}</td>
        <td>${project.freelancer || 'N/A'}</td>
        <td>${project.bidAmount ? web3.utils.fromWei(project.bidAmount, 'ether') : 'N/A'} ETH</td>
        <td>${statusMap[project.status]}</td>
        <td>${applicantsHtml}</td>
      `;
      projectTable.appendChild(row);
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

// Add event listener for the new releaseFunds button (to be added in index.html)
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

async function submitWork() {
  const projectId = prompt('Enter the project ID to submit work:');
  const evidence = prompt('Enter the IPFS CID of your submitted work:');
  if (!projectId || isNaN(projectId) || !evidence) {
    alert('Invalid input. Please enter a valid project ID and evidence CID.');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    if (project.freelancer.toLowerCase() !== userAccount.toLowerCase()) {
      alert('Only the assigned freelancer can submit work!');
      return;
    }
    if (project.status !== '1') { // 1 = ProjectStatus.Assigned
      alert('Project not in assigned state!');
      return;
    }

    const receipt = await contract.methods.submitWork(projectId, evidence).send({ from: userAccount });
    console.log('Work Submitted:', receipt);
    alert(`Work submitted successfully for Project ID: ${projectId}`);
    fetchProjects();
  } catch (error) {
    console.error('Error submitting work:', error);
    alert('Failed to submit work. Check the console for details.');
  }
}

async function approveWork() {
  const projectId = prompt('Enter the project ID to approve work:');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
      alert('Only the employer can approve work!');
      return;
    }
    if (project.status !== '2') { // 2 = ProjectStatus.Submitted
      alert('Work not submitted yet!');
      return;
    }

    const receipt = await contract.methods.approveWork(projectId).send({ from: userAccount });
    console.log('Work Approved:', receipt);
    alert(`Work approved and funds released for Project ID: ${projectId}`);
    fetchProjects();
  } catch (error) {
    console.error('Error approving work:', error);
    alert('Failed to approve work. Check the console for details.');
  }
}

async function claimFunds() {
  const projectId = prompt('Enter the project ID to claim funds:');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    if (project.freelancer.toLowerCase() !== userAccount.toLowerCase()) {
      alert('Only the assigned freelancer can claim funds!');
      return;
    }
    if (project.status !== '2' && project.status !== '3') { // 2 = Submitted, 3 = Completed
      alert('Work not submitted or completed!');
      return;
    }
    if (project.isPaid) {
      alert('Funds have already been released for this project!');
      return;
    }

    const receipt = await contract.methods.claimFunds(projectId).send({ from: userAccount });
    console.log('Funds Claimed:', receipt);
    alert(`Funds claimed successfully for Project ID: ${projectId}`);
    fetchProjects();
  } catch (error) {
    console.error('Error claiming funds:', error);
    alert('Failed to claim funds. Check the console for details.');
  }
}

async function initiateDispute() {
  const projectId = prompt('Enter the project ID to initiate a dispute:');
  const evidence = prompt('Enter the IPFS CID of your dispute evidence:');
  if (!projectId || isNaN(projectId) || !evidence) {
    alert('Invalid input. Please enter a valid project ID and evidence CID.');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
      alert('Only the employer can initiate a dispute!');
      return;
    }
    if (project.status !== '2') { // 2 = ProjectStatus.Submitted
      alert('Work not submitted yet!');
      return;
    }

    const receipt = await contract.methods.initiateDispute(projectId, evidence).send({ from: userAccount });
    console.log('Dispute Initiated:', receipt);
    alert(`Dispute initiated for Project ID: ${projectId}`);
    fetchProjects();
  } catch (error) {
    console.error('Error initiating dispute:', error);
    alert('Failed to initiate dispute. Check the console for details.');
  }
}

async function resolveDispute() {
  const projectId = prompt('Enter the project ID to resolve the dispute:');
  const freelancerWins = confirm('Does the freelancer win the dispute? (OK for Yes, Cancel for No)');
  if (!projectId || isNaN(projectId)) {
    alert('Invalid input. Please enter a valid project ID.');
    return;
  }

  try {
    const project = await contract.methods.projects(projectId).call();
    const arbiter = await contract.methods.arbiter().call();
    if (arbiter.toLowerCase() !== userAccount.toLowerCase()) {
      alert('Only the arbiter can resolve disputes!');
      return;
    }
    if (project.status !== '4') { // 4 = ProjectStatus.Disputed
      alert('No active dispute for this project!');
      return;
    }

    const receipt = await contract.methods.resolveDispute(projectId, freelancerWins).send({ from: userAccount });
    console.log('Dispute Resolved:', receipt);
    alert(`Dispute resolved for Project ID: ${projectId}. Funds released to ${freelancerWins ? 'freelancer' : 'employer'}`);
    fetchProjects();
  } catch (error) {
    console.error('Error resolving dispute:', error);
    alert('Failed to resolve dispute. Check the console for details.');
  }
}

const submitWorkBtn = document.getElementById('submitWorkBtn');
if (submitWorkBtn) {
  submitWorkBtn.addEventListener('click', submitWork);
}

const approveWorkBtn = document.getElementById('approveWorkBtn');
if (approveWorkBtn) {
  approveWorkBtn.addEventListener('click', approveWork);
}

const claimFundsBtn = document.getElementById('claimFundsBtn');
if (claimFundsBtn) {
  claimFundsBtn.addEventListener('click', claimFunds);
}

const initiateDisputeBtn = document.getElementById('initiateDisputeBtn');
if (initiateDisputeBtn) {
  initiateDisputeBtn.addEventListener('click', initiateDispute);
}

const resolveDisputeBtn = document.getElementById('resolveDisputeBtn');
if (resolveDisputeBtn) {
  resolveDisputeBtn.addEventListener('click', resolveDispute);
}

createProjectBtn.addEventListener('click', createProject);
applyProjectBtn.addEventListener('click', applyForProject);
completeProjectBtn.addEventListener('click', completeProject);
fetchProjectsBtn.addEventListener('click', fetchProjects);
fetchFreelancersBtn.addEventListener('click', fetchFreelancers);
assignFreelancerBtn.addEventListener('click', assignFreelancer);

window.addEventListener('load', init);