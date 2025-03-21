// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HireChain {
    enum Role { Employer, Freelancer }

    struct Project {
        uint256 id;
        string name;
        string description;
        address employer;
        address freelancer; // Set after assignment
        uint256 bidAmount;  // Final bid amount
        bool completed;
        bool isPaid;
        address[] bidders;  // Track all freelancers who applied
        uint256 bidCount;   // Number of unique bids
    }

    struct Freelancer {
        address freelancerAddress;
        uint256 reputation; // Auto-set to 0, incremented on completion
    }

    struct Bid {
        uint256 amount;
    }

    mapping(uint256 => Project) public projects;
    mapping(address => Freelancer) public freelancers;
    mapping(uint256 => mapping(address => Bid)) public projectBids; // External mapping for bids
    uint256 public projectCount;

    event ProjectCreated(uint256 id, string name, string description, address employer);
    event ProjectApplied(uint256 id, address freelancer, uint256 bidAmount);
    event ProjectAssigned(uint256 id, address freelancer, uint256 bidAmount);
    event ProjectCompleted(uint256 id, address employer, address freelancer, uint256 bidAmount);
    event FundsDeposited(uint id, uint256 bidAmount);
    event FundsReleased(uint id, address freelancer, uint256 bidAmount);

    function createProject(string memory _name, string memory _description) public {
        projectCount++;
        projects[projectCount] = Project(projectCount, _name, _description, msg.sender, address(0), 0, false, false, new address[](0), 0);
        emit ProjectCreated(projectCount, _name, _description, msg.sender);
    }

    function depositFunds(uint _projectId) public payable {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can deposit");
        require(msg.value == project.bidAmount, "Deposit must match bid");
        emit FundsDeposited(_projectId, msg.value);
    }

    function applyForProject(uint256 _projectId, uint256 _bidAmount) public {
        Project storage project = projects[_projectId];
        require(_projectId > 0 && _projectId <= projectCount, "Invalid project ID");
        require(!project.completed, "Project completed");
        require(project.employer != msg.sender, "Employer cannot apply");
        require(_bidAmount > 0, "Bid must be positive");

        // Initialize freelancer if new
        if (freelancers[msg.sender].freelancerAddress == address(0)) {
            freelancers[msg.sender] = Freelancer(msg.sender, 0);
        }

        // Check if freelancer already applied
        bool alreadyApplied = false;
        for (uint256 i = 0; i < project.bidders.length; i++) {
            if (project.bidders[i] == msg.sender) {
                alreadyApplied = true;
                break;
            }
        }

        if (!alreadyApplied) {
            project.bidders.push(msg.sender);
            project.bidCount++;
        }

        // Store the bid
        projectBids[_projectId][msg.sender] = Bid(_bidAmount);
        emit ProjectApplied(_projectId, msg.sender, _bidAmount);
    }

    function assignFreelancer(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(_projectId > 0 && _projectId <= projectCount, "Invalid project ID");
        require(project.freelancer == address(0), "Freelancer assigned");
        require(project.employer == msg.sender, "Only employer can assign");
        require(project.bidCount > 0, "No bids");

        address bestFreelancer = address(0);
        uint256 minBid = type(uint256).max;
        uint256 highestRep = 0;

        // Evaluate bids
        for (uint256 i = 0; i < project.bidders.length; i++) {
            address bidder = project.bidders[i];
            uint256 bidAmount = projectBids[_projectId][bidder].amount;
            uint256 reputation = freelancers[bidder].reputation;
            if ((bidAmount < minBid && reputation >= highestRep) || 
                (bidAmount <= minBid && reputation > highestRep)) {
                minBid = bidAmount;
                highestRep = reputation;
                bestFreelancer = bidder;
            }
        }

        require(bestFreelancer != address(0), "No valid freelancer");
        project.freelancer = bestFreelancer;
        project.bidAmount = minBid;
        emit ProjectAssigned(_projectId, bestFreelancer, minBid);
    }

    function completeProject(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(_projectId > 0 && _projectId <= projectCount, "Invalid project ID");
        require(msg.sender == project.employer, "Only employer can complete");
        require(project.freelancer != address(0), "No freelancer");
        require(!project.completed, "Already completed");

        freelancers[project.freelancer].reputation += 10;
        project.completed = true;
        emit ProjectCompleted(_projectId, project.employer, project.freelancer, project.bidAmount);
    }

    function releaseFunds(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(_projectId > 0 && _projectId <= projectCount, "Invalid project ID");
        require(msg.sender == project.employer, "Only employer can release");
        require(project.completed, "Must be completed");
        require(!project.isPaid, "Already paid");
        require(address(this).balance >= project.bidAmount, "Insufficient balance");

        (bool sent, ) = project.freelancer.call{value: project.bidAmount}("");
        require(sent, "Failed to send ETH");
        project.isPaid = true;
        emit FundsReleased(_projectId, project.freelancer, project.bidAmount);
    }

    function getFreelancerReputation(address _freelancer) public view returns (uint256) {
        return freelancers[_freelancer].reputation;
    }

    function getFreelancers() public view returns (address[] memory) {
        uint256 totalFreelancers = 0;
        for (uint256 i = 1; i <= projectCount; i++) {
            totalFreelancers += projects[i].bidders.length;
        }

        address[] memory allFreelancers = new address[](totalFreelancers);
        uint256 index = 0;
        for (uint256 i = 1; i <= projectCount; i++) {
            Project storage project = projects[i];
            for (uint256 j = 0; j < project.bidders.length; j++) {
                bool alreadyAdded = false;
                for (uint256 k = 0; k < index; k++) {
                    if (allFreelancers[k] == project.bidders[j]) {
                        alreadyAdded = true;
                        break;
                    }
                }
                if (!alreadyAdded) {
                    allFreelancers[index] = project.bidders[j];
                    index++;
                }
            }
        }

        // Resize the array to remove unused slots
        address[] memory result = new address[](index);
        for (uint256 i = 0; i < index; i++) {
            result[i] = allFreelancers[i];
        }
        return result;
    }
}