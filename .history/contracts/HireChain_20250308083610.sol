// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HireChain {
    enum Role { Employer, Freelancer }

    struct Bid {
        uint256 amount;
    }

    struct Project {
        uint256 id;
        string name;
        string description;
        address employer;
        address freelancer; // Set only after assignFreelancer is called
        uint256 bidAmount;  // Final bid amount after assignment
        bool completed;
        bool isPaid;
        address[] bidders;  // Track all freelancers who applied
        mapping(address => Bid) bids; // Store bids for each freelancer
        uint256 bidCount;   // Track number of unique bids
    }

    struct Freelancer {
        address freelancerAddress;
        uint256 reputation; // Initialized to 0, updated on completion
    }

    mapping(uint256 => Project) public projects;
    mapping(address => Freelancer) public freelancers;
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
        require(msg.sender == project.employer, "Only employer can deposit funds");
        require(msg.value == project.bidAmount, "Deposit must match bid amount");
        emit FundsDeposited(_projectId, msg.value);
    }

    function applyForProject(uint256 _projectId, uint256 _bidAmount) public {
        Project storage project = projects[_projectId];
        require(_projectId > 0 && _projectId <= projectCount, "Invalid project ID");
        require(!project.completed, "Project is already completed");
        require(project.employer != msg.sender, "Employer cannot apply");
        require(_bidAmount > 0, "Bid amount must be greater than zero");

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

        // Store or update the bid
        project.bids[msg.sender] = Bid(_bidAmount);
        emit ProjectApplied(_projectId, msg.sender, _bidAmount);
    }

    function assignFreelancer(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(_projectId > 0 && _projectId <= projectCount, "Invalid project ID");
        require(project.freelancer == address(0), "Freelancer already assigned");
        require(project.employer == msg.sender, "Only employer can assign");
        require(project.bidCount > 0, "No bids available");

        address bestFreelancer = address(0);
        uint256 minBid = type(uint256).max;
        uint256 highestRep = 0;

        // Evaluate bids based on lowest bid and highest reputation
        for (uint256 i = 0; i < project.bidders.length; i++) {
            address bidder = project.bidders[i];
            uint256 bidAmount = project.bids[bidder].amount;
            uint256 reputation = freelancers[bidder].reputation;
            if ((bidAmount < minBid && reputation >= highestRep) || 
                (bidAmount <= minBid && reputation > highestRep)) {
                minBid = bidAmount;
                highestRep = reputation;
                bestFreelancer = bidder;
            }
        }

        require(bestFreelancer != address(0), "No valid freelancer found");
        project.freelancer = bestFreelancer;
        project.bidAmount = minBid;
        emit ProjectAssigned(_projectId, bestFreelancer, minBid);
    }

    function completeProject(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(_projectId > 0 && _projectId <= projectCount, "Invalid project ID");
        require(msg.sender == project.employer, "Only employer can complete");
        require(project.freelancer != address(0), "No freelancer assigned");
        require(!project.completed, "Project already completed");

        freelancers[project.freelancer].reputation += 10; // Increment reputation on completion
        project.completed = true;
        emit ProjectCompleted(_projectId, project.employer, project.freelancer, project.bidAmount);
    }

    function releaseFunds(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can release funds");
        require(project.completed, "Project must be completed");
        require(!project.isPaid, "Funds already released");
        require(address(this).balance >= project.bidAmount, "Insufficient contract balance");

        (bool sent, ) = project.freelancer.call{value: project.bidAmount}("");
        require(sent, "Failed to send ETH");
        project.isPaid = true;
        emit FundsReleased(_projectId, project.freelancer, project.bidAmount);
    }

    function getFreelancerReputation(address _freelancer) public view returns (uint256) {
        return freelancers[_freelancer].reputation;
    }

    function getProjectBidders(uint256 _projectId) public view returns (address[] memory) {
        return projects[_projectId].bidders;
    }
}