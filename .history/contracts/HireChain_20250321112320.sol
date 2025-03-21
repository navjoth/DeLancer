// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IReputationToken {
    function transfer(address _to, uint256 _value) external returns (bool success);
    function balanceOf(address _owner) external view returns (uint256 balance);
}

contract HireChain {
    enum Role { Employer, Freelancer }
    enum ProjectStatus { Created, Assigned, Submitted, Completed, Disputed, Resolved }
    enum DisputeOutcome { None, FreelancerWins, EmployerWins }

    struct Project {
        uint256 id;
        string name;
        string description;
        address employer;
        address freelancer;
        uint256 bidAmount;
        ProjectStatus status;
        bool isPaid;
        uint256 submissionTimestamp; // When freelancer submits work
        string freelancerEvidence; // IPFS CID for freelancer's submitted work
        string employerEvidence; // IPFS CID for employer's dispute evidence
        DisputeOutcome disputeOutcome;
    }

    struct Freelancer {
        address freelancerAddress;
        uint256 reputation;
    }

    struct FeeProposal {
        address freelancer;
        uint256 proposedFee;
    }

    IReputationToken public reputationToken;
    mapping(uint256 => Project) public projects;
    mapping(address => Freelancer) public freelancers;
    mapping(address => uint256) public employerReputation; // Reputation for employers
    mapping(uint256 => FeeProposal[]) public feeProposals;
    uint256 public projectCount;
    address public arbiter; // For dispute resolution (contract deployer for now)
    uint256 public constant REVIEW_PERIOD = 3 days;
    uint256 public constant REPUTATION_PENALTY = 50 * 10**18; // 50 REP tokens penalty

    event ProjectCreated(uint256 id, string name, string description, address employer);
    event ProjectApplied(uint256 id, address freelancer, uint256 bidAmount);
    event FreelancerAssigned(uint256 id, address freelancer, uint256 proposedFee);
    event FundsDeposited(uint id, uint256 bidAmount);
    event WorkSubmitted(uint256 id, address freelancer, string evidence);
    event ProjectCompleted(uint256 id, address employer, address freelancer, uint256 bidAmount);
    event FundsReleased(uint256 id, address recipient, uint256 bidAmount, bool success);
    event FundsClaimed(uint256 id, address freelancer, uint256 bidAmount);
    event DisputeInitiated(uint256 id, address initiator, string evidence);
    event DisputeResolved(uint256 id, DisputeOutcome outcome);
    event ReputationUpdated(address indexed user, uint256 newReputation, bool isPenalty);

    constructor(address _reputationTokenAddress) {
        reputationToken = IReputationToken(_reputationTokenAddress);
        arbiter = msg.sender; // Contract deployer is the arbiter for now
    }

    function createProject(string memory _name, string memory _description) public {
        projectCount++;
        projects[projectCount] = Project(projectCount, _name, _description, msg.sender, address(0), 0, ProjectStatus.Created, false, 0, "", "", DisputeOutcome.None);
        employerReputation[msg.sender] += 10 * 10**18; // Initial reputation for employer
        emit ProjectCreated(projectCount, _name, _description, msg.sender);
    }

    function depositFunds(uint _projectId) public payable {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can deposit funds");
        require(project.bidAmount > 0, "Bid amount must be set");
        require(msg.value == project.bidAmount, "Deposit must match the project amount");
        require(project.status == ProjectStatus.Assigned, "Freelancer must be assigned");
        emit FundsDeposited(_projectId, msg.value);
    }

    function applyForProject(uint256 _projectId, uint256 _bidAmount) public {
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Created, "Project not available for applications");
        feeProposals[_projectId].push(FeeProposal(msg.sender, _bidAmount));
        if (freelancers[msg.sender].freelancerAddress == address(0)) {
            freelancers[msg.sender] = Freelancer(msg.sender, 0);
        }
        emit ProjectApplied(_projectId, msg.sender, _bidAmount);
    }

    function assignFreelancer(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can assign a freelancer");
        require(project.status == ProjectStatus.Created, "Freelancer already assigned");

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
        project.status = ProjectStatus.Assigned;
        emit FreelancerAssigned(_projectId, bestFreelancer, minFee);
    }

    function submitWork(uint256 _projectId, string memory _evidence) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.freelancer, "Only assigned freelancer can submit work");
        require(project.status == ProjectStatus.Assigned, "Project not in assigned state");
        require(bytes(_evidence).length > 0, "Evidence must be provided");

        project.status = ProjectStatus.Submitted;
        project.submissionTimestamp = block.timestamp;
        project.freelancerEvidence = _evidence;
        emit WorkSubmitted(_projectId, msg.sender, _evidence);
    }

    function approveWork(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can approve work");
        require(project.status == ProjectStatus.Submitted, "Work not submitted");
        require(project.status != ProjectStatus.Disputed, "Dispute in progress");

        project.status = ProjectStatus.Completed;
        emit ProjectCompleted(_projectId, project.employer, project.freelancer, project.bidAmount);

        // Automatically release funds upon approval
        (bool sent, ) = project.freelancer.call{value: project.bidAmount, gas: 50000}("");
        if (sent) {
            project.isPaid = true;
            emit FundsReleased(_projectId, project.freelancer, project.bidAmount, true);
        } else {
            emit FundsReleased(_projectId, project.freelancer, project.bidAmount, false);
            revert("Failed to send Ether to freelancer");
        }
    }

    function claimFunds(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.freelancer, "Only freelancer can claim funds");
        require(project.status == ProjectStatus.Submitted || project.status == ProjectStatus.Completed, "Work not submitted or completed");
        require(block.timestamp > project.submissionTimestamp + REVIEW_PERIOD, "Review period not over");
        require(!project.isPaid, "Funds already released");
        require(project.status != ProjectStatus.Disputed, "Dispute in progress");
        require(address(this).balance >= project.bidAmount, "Insufficient contract balance");

        if (project.status != ProjectStatus.Completed) {
            project.status = ProjectStatus.Completed;
            emit ProjectCompleted(_projectId, project.employer, project.freelancer, project.bidAmount);
        }

        (bool sent, ) = project.freelancer.call{value: project.bidAmount, gas: 50000}("");
        if (sent) {
            project.isPaid = true;
            emit FundsClaimed(_projectId, project.freelancer, project.bidAmount);
        } else {
            revert("Failed to send Ether to freelancer");
        }
    }

    function initiateDispute(uint256 _projectId, string memory _evidence) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can initiate dispute");
        require(project.status == ProjectStatus.Submitted, "Work not submitted");
        require(block.timestamp <= project.submissionTimestamp + REVIEW_PERIOD, "Review period over");
        require(bytes(_evidence).length > 0, "Evidence must be provided");

        project.status = ProjectStatus.Disputed;
        project.employerEvidence = _evidence;
        emit DisputeInitiated(_projectId, msg.sender, _evidence);
    }

    function resolveDispute(uint256 _projectId, bool _freelancerWins) public {
        Project storage project = projects[_projectId];
        require(msg.sender == arbiter, "Only arbiter can resolve disputes");
        require(project.status == ProjectStatus.Disputed, "No active dispute");
        require(!project.isPaid, "Funds already released");

        project.status = ProjectStatus.Resolved;
        project.disputeOutcome = _freelancerWins ? DisputeOutcome.FreelancerWins : DisputeOutcome.EmployerWins;

        address payable recipient = _freelancerWins ? payable(project.freelancer) : payable(project.employer);
        (bool sent, ) = recipient.call{value: project.bidAmount, gas: 50000}("");
        if (sent) {
            project.isPaid = true;
            emit FundsReleased(_projectId, recipient, project.bidAmount, true);
        } else {
            emit FundsReleased(_projectId, recipient, project.bidAmount, false);
            revert("Failed to send Ether");
        }

        // Apply reputation penalties
        if (_freelancerWins) {
            // Employer loses reputation for unjust dispute
            employerReputation[project.employer] = employerReputation[project.employer] > REPUTATION_PENALTY
                ? employerReputation[project.employer] - REPUTATION_PENALTY
                : 0;
            emit ReputationUpdated(project.employer, employerReputation[project.employer], true);
        } else {
            // Freelancer loses reputation for invalid submission
            freelancers[project.freelancer].reputation = freelancers[project.freelancer].reputation > REPUTATION_PENALTY
                ? freelancers[project.freelancer].reputation - REPUTATION_PENALTY
                : 0;
            emit ReputationUpdated(project.freelancer, freelancers[project.freelancer].reputation, true);
        }

        emit DisputeResolved(_projectId, project.disputeOutcome);
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

    receive() external payable {}
}