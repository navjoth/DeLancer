const createProjectBtn = document.getElementById('createProjectBtn');
const applyProjectBtn = document.getElementById('applyProjectBtn');
const completeProjectBtn = document.getElementById('completeProjectBtn');
const fetchProjectsBtn = document.getElementById('fetchProjectsBtn');
const projectTable = document.getElementById('projectTable');
const assignFreelancerBtn = document.getElementById('assignFreelancerBtn');
const depositFundsBtn = document.getElementById('depositFundsBtn');
const releaseFundsBtn = document.getElementById('releaseFundsBtn');

const contractAddress = '0x954b2C072bafa83E380e41cF1F4ee232f6F02e16';
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_projectId",
        "type": "uint256"
      }
    ],
    "name": "getProjectBidders",
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
          try {
              web3 = new Web3(window.ethereum);
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              const accounts = await web3.eth.getAccounts();
              userAccount = accounts[0];
              contract = new web3.eth.Contract(contractABI, contractAddress);
              document.getElementById('userAccount').textContent = `Connected Wallet: ${userAccount}`;
              console.log('Web3 initialized, contract loaded');
          } catch (error) {
              console.error('Error initializing Web3:', error);
              alert('Failed to connect to MetaMask. Check console.');
          }
      } else {
          alert('MetaMask is not installed.');
      }
  }
  
  async function createProject() {
      const name = prompt('Enter project name:');
      const description = prompt('Enter project description:');
      if (name && description) {
          try {
              await contract.methods.createProject(name, description).send({ from: userAccount, gas: 3000000 });
              alert('Project created!');
              fetchProjects();
          } catch (error) {
              console.error('Error creating project:', error);
              alert('Failed to create project. Check console.');
          }
      }
  }
  
  async function applyForProject() {
      const projectId = prompt('Enter project ID to apply:');
      const bidAmount = prompt('Enter bid amount (in wei):');
      if (!projectId || isNaN(projectId) || !bidAmount || isNaN(bidAmount) || parseInt(bidAmount) <= 0) {
          alert('Invalid input.');
          return;
      }
  
      try {
          const project = await contract.methods.projects(projectId).call();
          if (project.employer.toLowerCase() === userAccount.toLowerCase()) {
              alert('Cannot apply to your own project.');
              return;
          }
          if (project.completed) {
              alert('Project is completed.');
              return;
          }
  
          await contract.methods.applyForProject(projectId, bidAmount).send({ from: userAccount, gas: 3000000 });
          alert(`Applied with bid ${bidAmount} wei`);
          fetchProjects();
      } catch (error) {
          console.error('Error applying for project:', error);
          alert('Failed to apply. Check console.');
      }
  }
  
  async function assignFreelancer() {
      const projectId = prompt('Enter project ID to assign freelancer:');
      if (!projectId || isNaN(projectId)) {
          alert('Invalid project ID.');
          return;
      }
  
      try {
          const project = await contract.methods.projects(projectId).call();
          if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
              alert('Only employer can assign.');
              return;
          }
          if (project.bidCount === 0) {
              alert('No applications yet.');
              return;
          }
  
          await contract.methods.assignFreelancer(projectId).send({ from: userAccount, gas: 3000000 });
          alert('Freelancer assigned!');
          fetchProjects();
      } catch (error) {
          console.error('Error assigning freelancer:', error);
          alert('Failed to assign. Check console.');
      }
  }
  
  async function completeProject() {
      const projectId = prompt('Enter project ID to complete:');
      if (!projectId || isNaN(projectId)) {
          alert('Invalid project ID.');
          return;
      }
  
      try {
          const project = await contract.methods.projects(projectId).call();
          if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
              alert('Only employer can complete.');
              return;
          }
          if (project.freelancer === '0x0000000000000000000000000000000000000000') {
              alert('No freelancer assigned.');
              return;
          }
  
          await contract.methods.completeProject(projectId).send({ from: userAccount, gas: 3000000 });
          alert('Project completed!');
          fetchProjects();
      } catch (error) {
          console.error('Error completing project:', error);
          alert('Failed to complete. Check console.');
      }
  }
  
  async function depositFunds() {
      const projectId = prompt('Enter project ID to deposit funds:');
      if (!projectId || isNaN(projectId)) {
          alert('Invalid project ID.');
          return;
      }
  
      try {
          const project = await contract.methods.projects(projectId).call();
          if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
              alert('Only employer can deposit funds.');
              return;
          }
          if (project.bidAmount == 0) {
              alert('Assign a freelancer first to set bid amount.');
              return;
          }
  
          await contract.methods.depositFunds(projectId).send({ from: userAccount, value: project.bidAmount, gas: 3000000 });
          alert('Funds deposited!');
          fetchProjects();
      } catch (error) {
          console.error('Error depositing funds:', error);
          alert('Failed to deposit funds. Check console.');
      }
  }
  
  async function releaseFunds() {
      const projectId = prompt('Enter project ID to release funds:');
      if (!projectId || isNaN(projectId)) {
          alert('Invalid project ID.');
          return;
      }
  
      try {
          const project = await contract.methods.projects(projectId).call();
          if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
              alert('Only employer can release funds.');
              return;
          }
          if (!project.completed) {
              alert('Project must be completed first.');
              return;
          }
  
          await contract.methods.releaseFunds(projectId).send({ from: userAccount, gas: 3000000 });
          alert('Funds released!');
          fetchProjects();
      } catch (error) {
          console.error('Error releasing funds:', error);
          alert('Failed to release funds. Check console.');
      }
  }
  
  async function fetchProjects() {
      try {
          const projectCount = await contract.methods.projectCount().call();
          projectTable.innerHTML = '';
          for (let i = 1; i <= projectCount; i++) {
              const project = await contract.methods.projects(i).call();
              const bidders = await contract.methods.getProjectBidders(i).call();
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${project.id}</td>
                  <td>${project.name}</td>
                  <td>${project.description}</td>
                  <td>${project.employer}</td>
                  <td>${project.freelancer || 'Not Assigned'}</td>
                  <td>${project.bidAmount || 'N/A'}</td>
                  <td>${project.completed ? 'Yes' : 'No'}</td>
                  <td>${project.isPaid ? 'Yes' : 'No'}</td>
                  <td>${bidders.length || '0'}</td>
              `;
              projectTable.appendChild(row);
          }
      } catch (error) {
          console.error('Error fetching projects:', error);
          alert('Failed to fetch projects. Check console.');
      }
  }
  
  createProjectBtn.addEventListener('click', createProject);
  applyProjectBtn.addEventListener('click', applyForProject);
  assignFreelancerBtn.addEventListener('click', assignFreelancer);
  completeProjectBtn.addEventListener('click', completeProject);
  depositFundsBtn.addEventListener('click', depositFunds);
  releaseFundsBtn.addEventListener('click', releaseFunds);
  fetchProjectsBtn.addEventListener('click', fetchProjects);
  
  window.addEventListener('load', init);