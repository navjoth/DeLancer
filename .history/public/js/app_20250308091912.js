const createProjectBtn = document.getElementById('createProjectBtn');
const applyProjectBtn = document.getElementById('applyProjectBtn');
const assignFreelancerBtn = document.getElementById('assignFreelancerBtn');
const completeProjectBtn = document.getElementById('completeProjectBtn');
const fetchProjectsBtn = document.getElementById('fetchProjectsBtn');
const fetchFreelancersBtn = document.createElement('button'); // New button for freelancers
const releaseFundsBtn = document.createElement('button');
const projectTable = document.getElementById('projectTable');
const freelancerTable = document.createElement('table'); // New table for freelancers

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
          web3 = new Web3(window.ethereum);
          await ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          userAccount = accounts[0];
          contract = new web3.eth.Contract(contractABI, contractAddress);
          document.getElementById('userAccount').textContent = `Connected: ${userAccount}`;
      } else {
          alert('MetaMask not installed.');
      }
  }
  
  async function createProject() {
      const name = prompt('Enter project name:');
      const description = prompt('Enter description:');
      if (name && description) {
          try {
              await contract.methods.createProject(name, description).send({ from: userAccount, gas: 3000000 });
              alert('Project created!');
              fetchProjects();
          } catch (error) {
              console.error('Error:', error);
              alert('Failed. Check console.');
          }
      }
  }
  
  async function applyForProject() {
      const projectId = prompt('Enter project ID:');
      const bidAmount = prompt('Enter bid (wei):');
      if (!projectId || isNaN(projectId) || !bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
          alert('Invalid input.');
          return;
      }
  
      try {
          const project = await contract.methods.projects(projectId).call();
          if (project.employer.toLowerCase() === userAccount.toLowerCase()) {
              alert('Cannot apply to own project.');
              return;
          }
          if (project.completed) {
              alert('Project completed.');
              return;
          }
  
          await contract.methods.applyForProject(projectId, bidAmount).send({ from: userAccount, gas: 3000000 });
          alert(`Applied with ${bidAmount} wei`);
          fetchProjects();
      } catch (error) {
          console.error('Error applying:', error);
          alert('Failed. Check console.');
      }
  }
  
  async function assignFreelancer() {
      const projectId = prompt('Enter project ID:');
      if (!projectId || isNaN(projectId)) {
          alert('Invalid ID.');
          return;
      }
  
      try {
          const project = await contract.methods.projects(projectId).call();
          if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
              alert('Only employer can assign.');
              return;
          }
          if (project.bidCount === 0) {
              alert('No applications.');
              return;
          }
  
          await contract.methods.assignFreelancer(projectId).send({ from: userAccount, gas: 3000000 });
          alert('Freelancer assigned!');
          fetchProjects();
      } catch (error) {
          console.error('Error assigning:', error);
          alert('Failed. Check console.');
      }
  }
  
  async function completeProject() {
      const projectId = prompt('Enter project ID:');
      if (!projectId || isNaN(projectId)) {
          alert('Invalid ID.');
          return;
      }
  
      try {
          const project = await contract.methods.projects(projectId).call();
          if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
              alert('Only employer.');
              return;
          }
          if (project.freelancer === '0x0000000000000000000000000000000000000000') {
              alert('No freelancer.');
              return;
          }
  
          await contract.methods.completeProject(projectId).send({ from: userAccount, gas: 3000000 });
          alert('Project completed!');
          fetchProjects();
      } catch (error) {
          console.error('Error completing:', error);
          alert('Failed. Check console.');
      }
  }
  
  async function releaseFunds() {
      const projectId = prompt('Enter project ID:');
      if (!projectId || isNaN(projectId)) {
          alert('Invalid ID.');
          return;
      }
  
      try {
          const project = await contract.methods.projects(projectId).call();
          if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
              alert('Only employer.');
              return;
          }
          if (!project.completed) {
              alert('Complete project first.');
              return;
          }
  
          await contract.methods.releaseFunds(projectId).send({ from: userAccount, gas: 3000000 });
          alert('Funds released!');
          fetchProjects();
      } catch (error) {
          console.error('Error releasing:', error);
          alert('Failed. Check console.');
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
                  <td>${project.bidAmount || 'N/A'}</td>
                  <td>${project.completed ? 'Yes' : 'No'}</td>
                  <td>${project.bidders.length}</td>
              `;
              projectTable.appendChild(row);
          }
      } catch (error) {
          console.error('Error fetching projects:', error);
          alert('Failed. Check console.');
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
          document.querySelector('body').appendChild(freelancerTable);
      } catch (error) {
          console.error('Error fetching freelancers:', error);
          alert('Failed. Check console.');
      }
  }
  
  releaseFundsBtn.id = 'releaseFundsBtn';
  releaseFundsBtn.textContent = 'Release Funds';
  fetchFreelancersBtn.id = 'fetchFreelancersBtn';
  fetchFreelancersBtn.textContent = 'Fetch Freelancers';
  document.querySelector('body').appendChild(releaseFundsBtn);
  document.querySelector('body').appendChild(fetchFreelancersBtn);
  
  createProjectBtn.addEventListener('click', createProject);
  applyProjectBtn.addEventListener('click', applyForProject);
  assignFreelancerBtn.addEventListener('click', assignFreelancer);
  completeProjectBtn.addEventListener('click', completeProject);
  fetchProjectsBtn.addEventListener('click', fetchProjects);
  fetchFreelancersBtn.addEventListener('click', fetchFreelancers);
  releaseFundsBtn.addEventListener('click', releaseFunds);
  
  window.addEventListener('load', init);