const createProjectBtn = document.getElementById('createProjectBtn');
const applyProjectBtn = document.getElementById('applyProjectBtn');
const completeProjectBtn = document.getElementById('completeProjectBtn');
const fetchProjectsBtn = document.getElementById('fetchProjectsBtn');
const assignFreelancerBtn = document.getElementById('assignFreelancerBtn');
const projectTable = document.getElementById('projectTable');

const fetchFreelancersBtn = document.getElementById('fetchFreelancersBtn');
const freelancerTable = document.getElementById('freelancerTable'); // Correct element id reference


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
  try {
      if (window.ethereum) {
          web3 = new Web3(window.ethereum);
          await ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
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

async function fetchFreelancers() {
  try {
    console.log("Fetching freelancers...");
    
    // Retrieve the total number of projects from the contract
    const projectCount = await contract.methods.projectCount().call();
    console.log(`Total projects: ${projectCount}`);

    const freelancers = new Set(); // Set to avoid duplicates
    const freelancerData = []; // Array to store freelancer details

    // Loop through all projects to collect freelancers
    for (let i = 1; i <= projectCount; i++) {
        const project = await contract.methods.projects(i).call();
        console.log(`Project ${i} details:`, project);

        // If the project has a freelancer, add to the Set
        if (project.freelancer !== '0x0000000000000000000000000000000000000000') {
            freelancers.add(project.freelancer);
        }
    }

    console.log("Freelancers found:", freelancers);

    // Fetch reputation/balance for each freelancer
    for (let freelancer of freelancers) {
        const reputation = await contract.methods.balances(freelancer).call();
        freelancerData.push({
            address: freelancer,
            reputation: reputation
        });
    }

    // Display freelancers and their reputation in the UI
    const freelancerTableElement = document.getElementById('freelancerTable');
    freelancerTableElement.innerHTML = ''; // Clear previous list

    if (freelancerData.length === 0) {
        freelancerTableElement.innerHTML = '<p>No freelancers found.</p>';
        return;
    }

    freelancerData.forEach(data => {
        const freelancerElement = document.createElement('div');
        freelancerElement.innerHTML = `
            <strong>Freelancer Address:</strong> ${data.address} <br />
            <strong>Reputation:</strong> ${data.reputation} <br />
            <hr />
        `;
        freelancerTableElement.appendChild(freelancerElement);
    });

  } catch (error) {
    console.error('Error fetching freelancers:', error);
    alert('Failed to fetch freelancers. Check the console for more details.');
  }
}

// Add an event listener to the "Fetch Freelancers" button
fetchFreelancersBtn.addEventListener('click', fetchFreelancers);


async function createProject() {
    const name = prompt('Enter the project name:');
    const description = prompt('Enter the project description:');
    if (name && description) {
        try {
            const receipt = await contract.methods.createProject(name, description).send({ from: userAccount });
            console.log('Project Created:', receipt);
            alert('Project created successfully!');
            fetchProjects(); 
        } catch (error) {
            console.error('Error creating project:', error);
        }
    }
}


// async function applyForProject() {
//     const projectId = prompt('Enter the project ID to apply:');
//     const bidAmount = prompt('Enter your bid amount (in wei):');
//     if (projectId && bidAmount) {
//         try {
//             const receipt = await contract.methods.applyForProject(projectId, bidAmount).send({ from: userAccount });
//             console.log('Applied for Project:', receipt);
//             alert('Application submitted successfully!');
//         } catch (error) {
//             console.error('Error applying for project:', error);
//         }
//     }
// }

async function applyForProject() {
  const projectId = prompt('Enter the project ID to apply:');
  const bidAmount = prompt('Enter your bid amount (in wei):');
  if (!projectId || isNaN(projectId) || !bidAmount || isNaN(bidAmount) || parseInt(bidAmount) <= 0) {
      alert('Invalid input. Please enter valid project ID and bid amount greater than zero.');
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

      const receipt = await contract.methods.applyForProject(projectId, bidAmount).send({ from: userAccount });
      console.log('Applied for Project:', receipt);
      alert(`Application submitted successfully for Project ID: ${projectId} with Bid: ${bidAmount}`);
      fetchProjects(); // Refresh project list
  } catch (error) {
      console.error('Error applying for project:', error);
      alert('Failed to apply for the project. Please check console for details.');
  }
}



async function assignFreelancer() {
  const projectId = prompt('Enter the project ID to assign a freelancer:');
  if (!projectId || isNaN(projectId)) {
      alert('Please enter a valid project ID.');
      return;
  }

  try {
      // Ensure the user is the employer
      const project = await contract.methods.projects(projectId).call();
      if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
          alert('Only the employer can assign a freelancer!');
          return;
      }

      // Ensure there are bids
      if (project.bidCount == 0) {
          alert('No freelancers have applied to this project yet.');
          return;
      }

      // Call the assignFreelancer function
      const receipt = await contract.methods.assignFreelancer(projectId).send({ from: userAccount });
      console.log('Freelancer assigned:', receipt);
      alert('Freelancer assigned successfully!');
      fetchProjects(); // Refresh project list to show the assigned freelancer
  } catch (error) {
      console.error('Error assigning freelancer:', error);
      alert('Failed to assign freelancer. Check console for details.');
  }
}




// async function completeProject() {
//     const projectId = prompt('Enter the project ID to mark as complete:');
//     if (projectId) {
//         try {
//             const receipt = await contract.methods.completeProject(projectId).send({ from: userAccount });
//             console.log('Project Marked as Complete:', receipt);
//             alert('Project marked as complete successfully!');
//         } catch (error) {
//             console.error('Error marking project as complete:', error);
//         }
//     }
// }


async function completeProject() {
  const projectId = prompt('Enter the project ID to mark as complete:');
  if (projectId) {
      try {
          // Ensure the userAccount is the employer
          const project = await contract.methods.projects(projectId).call();
          if (project.employer.toLowerCase() !== userAccount.toLowerCase()) {
              alert('Only the employer can mark the project as complete!');
              return;
          }

          // Ensure a freelancer is assigned to the project
          if (project.freelancer === '0x0000000000000000000000000000000000000000') {
              alert('No freelancer assigned to this project!');
              return;
          }

          // Send the transaction to complete the project
          const receipt = await contract.methods.completeProject(projectId).send({ from: userAccount });
          console.log('Transaction receipt:', receipt); // Log receipt for debugging

          alert('Project marked as complete!');
          fetchProjects(); // Refresh project list

      } catch (error) {
          console.error('Error completing project:', error);
          alert('Failed to complete project. Check the console for details.');
      }
  }
}








async function fetchProjects() {
  try {
      const projectCount = await contract.methods.projectCount().call();
      projectTable.innerHTML = ''; // Clear the table before reloading

      for (let i = 1; i <= projectCount; i++) {
          const project = await contract.methods.projects(i).call();
          const row = document.createElement('tr');

          row.innerHTML = `
              <td>${project.id}</td>
              <td>${project.name}</td>
              <td>${project.description}</td>
              <td>${project.employer}</td>
              <td>${project.freelancer || 'N/A'}</td>
              <td>${project.bidAmount || 'N/A'}</td>
              <td>${project.completed ? 'Yes' : 'No'}</td>
          `;

          projectTable.appendChild(row);
      }
  } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to fetch projects. Check the console for details.');
  }
}

// async function fetchProjects(projectId) {
//   try {
//       const project = await contract.methods.projects(projectId).call();
//       console.log('Project Details:', project);
//       alert(`Project ID: ${project.id}
//       Name: ${project.name}
//       Description: ${project.description}
//       Employer: ${project.employer}
//       Freelancer: ${project.freelancer || 'N/A'}
//       Bid Amount: ${web3.utils.fromWei(project.bidAmount, 'ether') || 'N/A'} ETH
//       Completed: ${project.completed ? 'Yes' : 'No'}`);
//   } catch (error) {
//       console.error('Error fetching project details:', error);
//       alert('Failed to fetch project details. Check console for details.');
//   }
// }



// async function switchToFreelancer() {
//   try {
//       const receipt = await contract.methods.changeRole(1).send({ from: userAccount }); // 1 = Freelancer
//       alert("Role switched to Freelancer successfully!");
//   } catch (error) {
//       console.error("Error switching role:", error);
//       alert("Failed to switch role. Check console for details.");
//   }
// }






createProjectBtn.addEventListener('click', createProject);
applyProjectBtn.addEventListener('click', applyForProject);
completeProjectBtn.addEventListener('click', completeProject);
fetchProjectsBtn.addEventListener('click', fetchProjects);
assignFreelancerBtn.addEventListener('click', assignFreelancer);

window.addEventListener('load', init);