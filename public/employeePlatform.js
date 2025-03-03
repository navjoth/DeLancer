async function loadEmployerPlatform() {
  document.getElementById("dynamicContent").innerHTML = `<h2>Employer Platform</h2>`;

  const accounts = await web3.eth.getAccounts();
  const userAccount = accounts[0];

  async function createProject() {
      const projectName = prompt("Enter project name:");
      const projectDescription = prompt("Enter project description:");

      if (projectName && projectDescription) {
          try {
              await contract.methods.createProject(projectName, projectDescription).send({ from: userAccount });
              alert("Project created successfully!");
          } catch (error) {
              console.error("Error creating project:", error);
          }
      }
  }

  const createButton = document.createElement("button");
  createButton.textContent = "Create Project";
  createButton.addEventListener("click", createProject);

  document.getElementById("dynamicContent").appendChild(createButton);
}

loadEmployerPlatform();
