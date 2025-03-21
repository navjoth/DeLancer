const createProjectBtn = document.getElementById('createProjectBtn');
const applyProjectBtn = document.getElementById('applyProjectBtn');
const assignFreelancerBtn = document.getElementById('assignFreelancerBtn');
const completeProjectBtn = document.getElementById('completeProjectBtn');
const fetchProjectsBtn = document.getElementById('fetchProjectsBtn');
const releaseFundsBtn = document.getElementById('releaseFundsBtn');
const fetchFreelancersBtn = document.getElementById('fetchFreelancersBtn');
const projectTable = document.getElementById('projectTable');
const freelancerTable = document.getElementById('freelancerTable');

const contractAddress = '0x954b2C072bafa83E380e41cF1F4ee232f6F02e16';
const contractABI = [
  {
    "inputs": [],
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
        "internalType": "uint256",
        "name": "amount",
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
        "name": "amount",
        "type": "uint256"
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
    "name": "ProjectAssigned",
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
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "projectBids",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
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
    "type": "function"
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
        "internalType": "uint256",
        "name": "bidCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
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
    "type": "function"
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
    "type": "function"
  }
  ];


let web3;
let contract;
let userAccount;

async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        userAccount = accounts[0];
        contract = new web3.eth.Contract(contractABI, contractAddress);
        document.getElementById('userAccount').textContent = `Connected: ${userAccount}`;
    } else {
        alert('MetaMask not installed. Please install it.');
    }
}

async function createProject() {
    const name = prompt('Enter project name:');
    const description = prompt('Enter description:');
    if (name && description) {
        try {
            await contract.methods.createProject(name, description).send({ from: userAccount, gas: 3000000 });
            alert('Project created successfully!');
            fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Check console.');
        }
    }
}

async function applyForProject() {
    const projectId = prompt('Enter project ID:');
    const bidAmount = prompt('Enter bid amount (in wei):');
    if (!projectId || isNaN(projectId) || !bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
        alert('Invalid input. Project ID and bid amount must be positive numbers.');
        return;
    }

    try {
        const project = await contract.methods.projects(projectId).call();
        if (project.employer.toLowerCase() === userAccount.toLowerCase()) {
            alert('Cannot apply to your own project.');
            return;
        }
        if (project.completed) {
            alert('Project is already completed.');
            return;
        }

        await contract.methods.applyForProject(projectId, web3.utils.toWei(bidAmount, 'wei')).send({ from: userAccount, gas: 3000000 });
        alert(`Applied with ${bidAmount} wei successfully!`);
        fetchProjects();
    } catch (error) {
        console.error('Error applying for project:', error);
        alert('Failed to apply. Check console.');
    }
}

async function assignFreelancer() {
    const projectId = prompt('Enter project ID:');
    if (!projectId || isNaN(projectId)) {
        alert('Invalid project ID.');
        return;
    }

    try {
        const project = await contract.methods.projects(projectId).call();
        if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
            alert('Only the employer can assign a freelancer.');
            return;
        }
        if (project.bidCount === 0) {
            alert('No applications available.');
            return;
        }

        await contract.methods.assignFreelancer(projectId).send({ from: userAccount, gas: 3000000 });
        alert('Freelancer assigned successfully!');
        fetchProjects();
    } catch (error) {
        console.error('Error assigning freelancer:', error);
        alert('Failed to assign. Check console.');
    }
}

async function completeProject() {
    const projectId = prompt('Enter project ID:');
    if (!projectId || isNaN(projectId)) {
        alert('Invalid project ID.');
        return;
    }

    try {
        const project = await contract.methods.projects(projectId).call();
        if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
            alert('Only the employer can complete the project.');
            return;
        }
        if (project.freelancer === '0x0000000000000000000000000000000000000000') {
            alert('No freelancer assigned.');
            return;
        }

        await contract.methods.completeProject(projectId).send({ from: userAccount, gas: 3000000 });
        alert('Project completed successfully!');
        fetchProjects();
    } catch (error) {
        console.error('Error completing project:', error);
        alert('Failed to complete. Check console.');
    }
}

async function depositFunds() {
    const projectId = prompt('Enter project ID:');
    if (!projectId || isNaN(projectId)) {
        alert('Invalid project ID.');
        return;
    }

    try {
        const project = await contract.methods.projects(projectId).call();
        if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
            alert('Only the employer can deposit funds.');
            return;
        }
        if (project.freelancer === '0x0000000000000000000000000000000000000000') {
            alert('Assign a freelancer first.');
            return;
        }

        await contract.methods.depositFunds(projectId).send({ from: userAccount, value: project.bidAmount, gas: 3000000 });
        alert('Funds deposited successfully!');
        fetchProjects();
    } catch (error) {
        console.error('Error depositing funds:', error);
        alert('Failed to deposit funds. Check console.');
    }
}

async function releaseFunds() {
    const projectId = prompt('Enter project ID:');
    if (!projectId || isNaN(projectId)) {
        alert('Invalid project ID.');
        return;
    }

    try {
        const project = await contract.methods.projects(projectId).call();
        if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
            alert('Only the employer can release funds.');
            return;
        }
        if (!project.completed) {
            alert('Complete the project first.');
            return;
        }
        if (project.isPaid) {
            alert('Funds already released.');
            return;
        }

        await contract.methods.releaseFunds(projectId).send({ from: userAccount, gas: 3000000 });
        alert('Funds released to freelancer successfully!');
        fetchProjects();
    } catch (error) {
        console.error('Error releasing funds:', error);
        alert('Failed to release funds. Check console.');
    }
}

async function fetchProjects() {
    try {
        const count = await contract.methods.projectCount().call();
        projectTable.innerHTML = '';
        for (let i = 1; i <= count; i++) {
            const project = await contract.methods.projects(i).call();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${project.id}</td>
                <td>${project.name}</td>
                <td>${project.description}</td>
                <td>${project.employer}</td>
                <td>${project.freelancer || 'Not Assigned'}</td>
                <td>${web3.utils.fromWei(project.bidAmount.toString(), 'ether') || 'N/A'} ETH</td>
                <td>${project.completed ? 'Yes' : 'No'}</td>
                <td>${project.bidders.length}</td>
            `;
            projectTable.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
        alert('Failed to fetch projects. Check console.');
    }
}

async function fetchFreelancers() {
    try {
        const freelancers = await contract.methods.getFreelancers().call();
        freelancerTable.innerHTML = '<tr><th>Freelancer Address</th><th>Reputation</th></tr>';
        for (let i = 0; i < freelancers.length; i++) {
            const reputation = await contract.methods.getFreelancerReputation(freelancers[i]).call();
            const row = document.createElement('tr');
            row.innerHTML = `<td>${freelancers[i]}</td><td>${reputation}</td>`;
            freelancerTable.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching freelancers:', error);
        alert('Failed to fetch freelancers. Check console.');
    }
}

// Add a Deposit Funds button to the UI
const depositFundsBtn = document.createElement('button');
depositFundsBtn.id = 'depositFundsBtn';
depositFundsBtn.textContent = 'Deposit Funds';
document.querySelector('div:nth-child(1)').appendChild(depositFundsBtn);
depositFundsBtn.addEventListener('click', depositFunds);

createProjectBtn.addEventListener('click', createProject);
applyProjectBtn.addEventListener('click', applyForProject);
assignFreelancerBtn.addEventListener('click', assignFreelancer);
completeProjectBtn.addEventListener('click', completeProject);
fetchProjectsBtn.addEventListener('click', fetchProjects);
fetchFreelancersBtn.addEventListener('click', fetchFreelancers);
releaseFundsBtn.addEventListener('click', releaseFunds);

window.addEventListener('load', init);