// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract HireChain {
    
    enum Role { Employer, Freelancer }

    struct Bid {
        uint256 amount;
        uint256 reputation;
    }

    struct Project {
        uint256 id;
        string name;
        string description;
        address employer;
        address freelancer; // Set only after assignFreelancer is called
        uint256 bidAmount; // Final bid amount after assignment
        bool completed;
        bool isPaid;
        address[] bidders; // Track bidders for iteration
        uint256 bidCount; // Track number of bids
    }

    struct Freelancer {
        address freelancerAddress;
        uint256 reputation;
    }

    mapping(uint256 => Project) public projects;
    mapping(address => Freelancer) public freelancers;
    mapping(uint256 => mapping(address => Bid)) public projectBids; // Mapping for bids
    uint256 public projectCount;

    event ProjectCreated(uint256 id, string name, string description, address employer);
    event ProjectCompleted(uint256 id, address employer, address freelancer, uint256 bidAmount);
    event ProjectApplied(uint256 id, address freelancer, uint256 bidAmount);
    event ProjectAssigned(uint256 id, address freelancer, uint256 bidAmount);

    event FundsDeposited(uint id, uint256 bidAmount);
    event FundsReleased(uint id, address freelancer, uint256 bidAmount);

    function createProject(string memory _name, string memory _description) public {
        projectCount++;
        Project storage project = projects[projectCount];
        project.id = projectCount;
        project.name = _name;
        project.description = _description;
        project.employer = msg.sender;
        project.freelancer = address(0);
        project.bidAmount = 0;
        project.completed = false;
        project.isPaid = false;
        project.bidCount = 0;
        emit ProjectCreated(projectCount, _name, _description, msg.sender);
    }

    function depositFunds(uint _projectId) public payable {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can deposit funds");
        require(msg.value == project.bidAmount, "Deposit must match the project amount");
        emit FundsDeposited(_projectId, msg.value);
    }

    function applyForProject(uint256 _projectId, uint256 _bidAmount) public {
        Project storage project = projects[_projectId];
        require(_projectId > 0 && _projectId <= projectCount, "Invalid project ID");
        require(!project.completed, "Project is already completed");
        require(project.employer != msg.sender, "Employer cannot apply for their own project");
        require(_bidAmount > 0, "Bid amount must be greater than zero");

        // Initialize freelancer if they don't exist
        if (freelancers[msg.sender].freelancerAddress == address(0)) {
            freelancers[msg.sender] = Freelancer(msg.sender, 0);
        }

        // Store the bid
        projectBids[_projectId][msg.sender] = Bid(_bidAmount, freelancers[msg.sender].reputation);
        bool isNewBidder = true;
        for (uint256 i = 0; i < project.bidders.length; i++) {
            if (project.bidders[i] == msg.sender) {
                isNewBidder = false;
                break;
            }
        }
        if (isNewBidder) {
            project.bidders.push(msg.sender);
            project.bidCount++;
        }
        emit ProjectApplied(_projectId, msg.sender, _bidAmount);
    }

    function assignFreelancer(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(_projectId > 0 && _projectId <= projectCount, "Invalid project ID");
        require(project.freelancer == address(0), "Project already has a freelancer");
        require(project.employer == msg.sender, "Only employer can assign freelancer");
        require(project.bidCount > 0, "No bids available");

        address bestFreelancer = address(0);
        uint256 minBid = type(uint256).max;
        uint256 highestRep = 0;

        // Evaluate bids
        for (uint256 i = 0; i < project.bidders.length; i++) {
            address bidder = project.bidders[i];
            Bid memory bid = projectBids[_projectId][bidder];
            if (bid.reputation > highestRep || 
                (bid.reputation == highestRep && bid.amount < minBid)) {
                highestRep = bid.reputation;
                minBid = bid.amount;
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
        require(msg.sender == project.employer, "Only employer can mark as complete");
        require(project.freelancer != address(0), "No freelancer assigned");

        freelancers[project.freelancer].reputation += 10;
        emit ProjectCompleted(_projectId, project.employer, project.freelancer, project.bidAmount);
    }

    function setFreelancerReputation(address _freelancer, uint256 _reputation) public {
        freelancers[_freelancer] = Freelancer(_freelancer, _reputation);
    }

    function getFreelancerReputation(address _freelancer) public view returns (uint256) {
        return freelancers[_freelancer].reputation;
    }

    function getFreelancers() public view returns (address[] memory) {
        address[] memory allFreelancers = new address[](projectCount);
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
        address[] memory result = new address[](index);
        for (uint256 i = 0; i < index; i++) {
            result[i] = allFreelancers[i];
        }
        return result;
    }
}