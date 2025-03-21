// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IReputationToken {
    function transfer(address _to, uint256 _value) external returns (bool success);
    function balanceOf(address _owner) external view returns (uint256 balance);
}

contract HireChain {
    enum Role { Employer, Freelancer }

    struct Project {
        uint256 id;
        string name;
        string description;
        address employer;
        address freelancer;
        uint256 bidAmount;
        bool completed;
        bool isPaid;
    }

    struct Freelancer {
        address freelancerAddress;
        uint256 reputation; // Mirrors token balance for simplicity
    }

    struct FeeProposal {
        address freelancer;
        uint256 proposedFee;
    }

    IReputationToken public reputationToken;
    mapping(uint256 => Project) public projects;
    mapping(address => Freelancer) public freelancers;
    mapping(uint256 => FeeProposal[]) public feeProposals;
    uint256 public projectCount;

    event ProjectCreated(uint256 id, string name, string description, address employer);
    event ProjectCompleted(uint256 id, address employer, address freelancer, uint256 bidAmount);
    event ProjectApplied(uint256 id, address freelancer, uint256 bidAmount);
    event FreelancerAssigned(uint256 id, address freelancer, uint256 proposedFee);
    event FundsDeposited(uint id, uint256 bidAmount);
    event FundsReleased(uint id, address freelancer, uint256 bidAmount);
    event ReputationAwarded(address freelancer, uint256 amount);

    constructor(address _reputationTokenAddress) {
        reputationToken = IReputationToken(_reputationTokenAddress);
    }

    function createProject(string memory _name, string memory _description) public {
        projectCount++;
        projects[projectCount] = Project(projectCount, _name, _description, msg.sender, address(0), 0, false, false);
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
        require(project.employer != address(0), "Project does not exist");
        require(project.freelancer == address(0), "Project already has a freelancer");
        feeProposals[_projectId].push(FeeProposal(msg.sender, _bidAmount));
        if (freelancers[msg.sender].freelancerAddress == address(0)) {
            freelancers[msg.sender] = Freelancer(msg.sender, 0);
        }
        emit ProjectApplied(_projectId, msg.sender, _bidAmount);
    }

    function assignFreelancer(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can assign a freelancer");
        require(project.freelancer == address(0), "Freelancer already assigned");

        FeeProposal[] memory proposals = feeProposals[_projectId];
        require(proposals.length > 0, "No freelancers have applied");

        address bestFreelancer = address(0);
        uint256 minFee = type(uint256).max;
        uint256 maxReputation = 0;

        for (uint256 i = 0; i < proposals.length; i++) {
            address freelancer = proposals[i].freelancer;
            uint256 freelancerRep = reputationToken.balanceOf(freelancer);
            uint256 proposedFee = proposals[i].proposedFee;

            if (freelancerRep > maxReputation || (freelancerRep == maxReputation && proposedFee < minFee)) {
                maxReputation = freelancerRep;
                minFee = proposals[i].proposedFee;
                bestFreelancer = freelancer;
            }
        }

        require(bestFreelancer != address(0), "No suitable freelancer found");
        project.freelancer = bestFreelancer;
        project.bidAmount = minFee;
        emit FreelancerAssigned(_projectId, bestFreelancer, minFee);
    }

    function completeProject(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can mark as complete");
        require(project.freelancer != address(0), "No freelancer assigned");

        project.completed = true;
        uint256 reward = 100 * 10**18; // 100 REP tokens
        reputationToken.transfer(project.freelancer, reward);
        freelancers[project.freelancer].reputation = reputationToken.balanceOf(project.freelancer);
        emit ProjectCompleted(_projectId, project.employer, project.freelancer, project.bidAmount);
        emit ReputationAwarded(project.freelancer, reward);
    }

    function getFreelancerReputation(address _freelancer) public view returns (uint256) {
        return reputationToken.balanceOf(_freelancer);
    }

    function getFreelancers() public view returns (address[] memory) {
        address[] memory allFreelancers = new address[](projectCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= projectCount; i++) {
            FeeProposal[] memory proposals = feeProposals[i];
            for (uint256 j = 0; j < proposals.length; j++) {
                allFreelancers[index] = proposals[j].freelancer;
                index++;
            }
        }
        return allFreelancers;
    }
}