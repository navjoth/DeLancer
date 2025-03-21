// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HireChain {
    struct Bid {
        uint256 amount;
    }

    struct Project {
        uint256 id;
        string name;
        string description;
        address employer;
        address freelancer;
        uint256 bidAmount;
        bool completed;
        bool isPaid;
        address[] bidders;
        uint256 bidCount;
    }

    struct Freelancer {
        address freelancerAddress;
        uint256 reputation;
    }

    mapping(uint256 => Project) public projects;
    mapping(address => Freelancer) public freelancers;
    mapping(uint256 => mapping(address => Bid)) public projectBids;
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

        if (freelancers[msg.sender].freelancerAddress == address(0)) {
            freelancers[msg.sender] = Freelancer(msg.sender, 0);
        }

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
        require(project.freelancer != address(0), "No freelancer assigned");
        require(!project.completed, "Already completed");

        freelancers[project.freelancer].reputation += 10;
        project.completed = true;
        emit ProjectCompleted(_projectId, project.employer, project.freelancer, project.bidAmount);
    }

    function releaseFunds(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can release");
        require(project.completed, "Must be completed");
        require(!project.isPaid, "Already paid");
        require(address(this).balance >= project.bidAmount, "Insufficient balance");

        (bool sent, ) = project.freelancer.call{value: project.bidAmount}("");
        require(sent, "Failed to send ETH");
        project.isPaid = true;
        emit FundsReleased(_projectId, project.freelancer, project.bidAmount);
    }

    function getProjectBidders(uint256 _projectId) public view returns (address[] memory) {
        return projects[_projectId].bidders;
    }
}