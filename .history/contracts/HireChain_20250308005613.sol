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
        uint256 bidCount; // Track number of bids for iteration
    }

    struct Freelancer {
        address freelancerAddress;
        uint256 reputation;
    }

    mapping(uint256 => Project) public projects;
    mapping(address => Freelancer) public freelancers;
    mapping(uint256 => mapping(address => Bid)) public projectBids; // Separate mapping for bids
    uint256 public projectCount;

    event ProjectCreated(uint256 id, string name, string description, address employer);
    event ProjectCompleted(uint256 id, address employer, address freelancer, uint256 bidAmount);
    event ProjectApplied(uint256 id, address freelancer, uint256 bidAmount);
    event ProjectAssigned(uint256 id, address freelancer, uint256 bidAmount);

    event FundsDeposited(uint id, uint256 bidAmount);
    event FundsReleased(uint id, address freelancer, uint256 bidAmount);

    function createProject(string memory _name, string memory _description) public {
        projectCount++;
        projects[projectCount] = Project(projectCount, _name, _description, msg.sender, address(0), 0, false, false, 0);
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
        require(!project.completed, "Project is already completed");
        require(project.employer != msg.sender, "Employer cannot apply for their own project");
        require(_bidAmount > 0, "Bid amount must be greater than zero");

        // Ensure the freelancer exists or initialize them
        if (freelancers[msg.sender].freelancerAddress == address(0)) {
            freelancers[msg.sender] = Freelancer(msg.sender, 0); // Default reputation of 0 if new
        }

        // Get freelancer's reputation
        uint256 freelancerRep = freelancers[msg.sender].reputation;
        projectBids[_projectId][msg.sender] = Bid(_bidAmount, freelancerRep);
        if (projectBids[_projectId][msg.sender].amount == 0) {
            project.bidCount++; // Increment only if this is a new bid
        }
        emit ProjectApplied(_projectId, msg.sender, _bidAmount);
    }

    function assignFreelancer(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(project.freelancer == address(0), "Project already has a freelancer");
        require(project.employer == msg.sender, "Only employer can assign freelancer");
        require(project.bidCount > 0, "No bids available");

        address bestFreelancer = address(0);
        uint256 minBid = type(uint256).max;
        uint256 highestRep = 0;

        // Collect all bidder addresses for the specific project
        address[] memory bidders = new address[](project.bidCount);
        uint256 bidderIndex = 0;
        for (uint256 i = 1; i <= projectCount; i++) {
            Project storage p = projects[i];
            if (p.id == _projectId && projectBids[_projectId][msg.sender].amount > 0) {
                bidders[bidderIndex] = msg.sender;
                bidderIndex++;
            }
        }

        // Evaluate bids
        for (uint256 i = 0; i < project.bidCount; i++) {
            address bidder = bidders[i];
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

    function getFreelancerReputation(address _freelancer) public view returns (uint256) {
        return freelancers[_freelancer].reputation;
    }

    function getFreelancers() public view returns (address[] memory) {
        address[] memory allFreelancers = new address[](projectCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= projectCount; i++) {
            if (projectBids[i][msg.sender].amount > 0) {
                allFreelancers[index] = msg.sender;
                index++;
            }
        }
        return allFreelancers;
    }
}