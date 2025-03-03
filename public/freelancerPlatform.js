async function loadFreelancerPlatform() {
  document.getElementById("dynamicContent").innerHTML = `<h2>Freelancer Platform</h2>`;

  const accounts = await web3.eth.getAccounts();
  const userAccount = accounts[0];

  async function fetchProjects() {
      const projectCount = await contract.methods.getProjectCount().call();
      const projectList = document.getElementById("projectList");
      projectList.innerHTML = "";

      for (let i = 0; i < projectCount; i++) {
          const project = await contract.methods.projects(i).call();

          const projectElement = document.createElement("div");
          projectElement.className = "project";
          projectElement.innerHTML = `
              <strong>Project ID:</strong> ${i}<br>
              <strong>Name:</strong> ${project.name}<br>
              <strong>Description:</strong> ${project.description}<br>
              <button onclick="applyForProject(${i})">Apply</button>
          `;

          projectList.appendChild(projectElement);
      }
  }

  async function applyForProject(projectId) {
      try {
          await contract.methods.applyForProject(projectId).send({ from: userAccount });
          alert("Applied successfully!");
          fetchProjects();
      } catch (error) {
          console.error("Error applying for project:", error);
      }
  }

  const projectListContainer = document.createElement("div");
  projectListContainer.id = "projectList";
  document.getElementById("dynamicContent").appendChild(projectListContainer);

  fetchProjects();
}

loadFreelancerPlatform();
