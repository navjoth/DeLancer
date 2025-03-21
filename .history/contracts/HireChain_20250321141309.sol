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
    event FundsReleased(uint id, address freelancer, uint256 bidAmount, bool success);
    event ReputationAwarded(address freelancer, uint256 amount);
    event TransferFailed(uint id, string reason);

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
        require(project.bidAmount > 0, "Bid amount must be set");
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
        require(!project.isPaid, "Funds already released");

        project.completed = true;
        uint256 reward = 100 * 10**18; // 100 REP tokens
        reputationToken.transfer(project.freelancer, reward);
        freelancers[project.freelancer].reputation = reputationToken.balanceOf(project.freelancer);
        emit ProjectCompleted(_projectId, project.employer, project.freelancer, project.bidAmount);
        emit ReputationAwarded(project.freelancer, reward);
    }

    function releaseFunds(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can release funds");
        require(project.completed, "Project must be completed");
        require(!project.isPaid, "Funds already released");
        require(address(this).balance >= project.bidAmount, "Insufficient contract balance");

        (bool sent, ) = project.freelancer.call{value: project.bidAmount, gas: 50000}("");
        if (sent) {
            project.isPaid = true;
            emit FundsReleased(_projectId, project.freelancer, project.bidAmount, true);
        } else {
            emit TransferFailed(_projectId, "Transfer failed");
            revert("Failed to send Ether to freelancer");
        }
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

    // New enum for submission status
    enum SubmissionStatus { NotSubmitted, Submitted, Disputed, Approved, Rejected }

    // New struct to store submission details
    struct Submission {
        SubmissionStatus status;
        string workCid; // IPFS CID for submitted work
        uint256 submissionTime; // Timestamp when work was submitted
        string employerEvidenceCid; // IPFS CID for employer's dispute evidence
        string freelancerEvidenceCid; // IPFS CID for freelancer's dispute evidence
    }

    // Mapping to store submissions for each project
    mapping(uint256 => Submission) public submissions;

    // Address of the contract owner (arbiter for disputes)
    address public owner;

    // Review period duration (3 days in seconds)
    uint256 public constant REVIEW_PERIOD = 3 days;

    // Reputation penalty for losing a dispute (e.g., 50 REP tokens)
    uint256 public constant REPUTATION_PENALTY = 50 * 10**18;

    // Events for new functionality
    event WorkSubmitted(uint256 projectId, address freelancer, string workCid);
    event SubmissionApproved(uint256 projectId, address employer);
    event SubmissionDisputed(uint256 projectId, address employer, string reason, string evidenceCid);
    event DisputeResolved(uint256 projectId, bool freelancerWins, string arbiterReason);
    event FundsClaimed(uint256 projectId, address freelancer, uint256 amount);
    event FundsRefunded(uint256 projectId, address employer, uint256 amount);
    event ReputationPenalized(address party, uint256 amount);

    // Modifier to restrict functions to the contract owner (arbiter)
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action");
        _;
    }

    // Update constructor to set the owner
    constructor(address _reputationTokenAddress) {
        reputationToken = IReputationToken(_reputationTokenAddress);
        owner = msg.sender; // Set the contract deployer as the owner (arbiter)
    }

    // Freelancer submits their work (IPFS CID) and marks the project as submitted
    function submitWork(uint256 _projectId, string memory _workCid) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.freelancer, "Only the assigned freelancer can submit work");
        require(project.freelancer != address(0), "No freelancer assigned");
        require(!project.completed, "Project already completed");
        require(submissions[_projectId].status == SubmissionStatus.NotSubmitted, "Work already submitted");

        submissions[_projectId] = Submission({
            status: SubmissionStatus.Submitted,
            workCid: _workCid,
            submissionTime: block.timestamp,
            employerEvidenceCid: "",
            freelancerEvidenceCid: ""
        });

        emit WorkSubmitted(_projectId, msg.sender, _workCid);
    }

    // Employer approves the submission, marking the project as completed and allowing fund release
    function approveSubmission(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        Submission storage submission = submissions[_projectId];
        require(msg.sender == project.employer, "Only the employer can approve the submission");
        require(submission.status == SubmissionStatus.Submitted, "Work not submitted or already processed");

        submission.status = SubmissionStatus.Approved;
        project.completed = true;

        // Award reputation as in the original completeProject
        uint256 reward = 100 * 10**18; // 100 REP tokens
        reputationToken.transfer(project.freelancer, reward);
        freelancers[project.freelancer].reputation = reputationToken.balanceOf(project.freelancer);

        emit SubmissionApproved(_projectId, msg.sender);
        emit ProjectCompleted(_projectId, project.employer, project.freelancer, project.bidAmount);
        emit ReputationAwarded(project.freelancer, reward);
    }

    // Employer disputes the submission with a reason and evidence (IPFS CID)
    function disputeSubmission(uint256 _projectId, string memory _reason, string memory _evidenceCid) public {
        Project storage project = projects[_projectId];
        Submission storage submission = submissions[_projectId];
        require(msg.sender == project.employer, "Only the employer can dispute the submission");
        require(submission.status == SubmissionStatus.Submitted, "Work not submitted or already processed");
        require(block.timestamp <= submission.submissionTime + REVIEW_PERIOD, "Review period has expired");

        submission.status = SubmissionStatus.Disputed;
        submission.employerEvidenceCid = _evidenceCid;

        emit SubmissionDisputed(_projectId, msg.sender, _reason, _evidenceCid);
    }

    // Freelancer submits evidence (IPFS CID) in response to a dispute
    function submitDisputeEvidence(uint256 _projectId, string memory _evidenceCid) public {
        Project storage project = projects[_projectId];
        Submission storage submission = submissions[_projectId];
        require(msg.sender == project.freelancer, "Only the freelancer can submit dispute evidence");
        require(submission.status == SubmissionStatus.Disputed, "Project not in disputed state");

        submission.freelancerEvidenceCid = _evidenceCid;
    }

    // Arbiter (contract owner) resolves the dispute
    function resolveDispute(uint256 _projectId, bool _freelancerWins, string memory _reason) public onlyOwner {
        Project storage project = projects[_projectId];
        Submission storage submission = submissions[_projectId];
        require(submission.status == SubmissionStatus.Disputed, "Project not in disputed state");

        if (_freelancerWins) {
            submission.status = SubmissionStatus.Approved;
            project.completed = true;

            // Award reputation as in the original completeProject
            uint256 reward = 100 * 10**18; // 100 REP tokens
            reputationToken.transfer(project.freelancer, reward);
            freelancers[project.freelancer].reputation = reputationToken.balanceOf(project.freelancer);

            // Penalize employer
            if (reputationToken.balanceOf(project.employer) >= REPUTATION_PENALTY) {
                reputationToken.transfer(project.employer, REPUTATION_PENALTY); // Burn or transfer to a sink
                emit ReputationPenalized(project.employer, REPUTATION_PENALTY);
            }

            emit ProjectCompleted(_projectId, project.employer, project.freelancer, project.bidAmount);
            emit ReputationAwarded(project.freelancer, reward);
        } else {
            submission.status = SubmissionStatus.Rejected;

            // Penalize freelancer
            if (reputationToken.balanceOf(project.freelancer) >= REPUTATION_PENALTY) {
                reputationToken.transfer(project.freelancer, REPUTATION_PENALTY); // Burn or transfer to a sink
                emit ReputationPenalized(project.freelancer, REPUTATION_PENALTY);
            }

            // Refund employer
            if (!project.isPaid && address(this).balance >= project.bidAmount) {
                (bool sent, ) = project.employer.call{value: project.bidAmount, gas: 50000}("");
                if (sent) {
                    project.isPaid = true;
                    emit FundsRefunded(_projectId, project.employer, project.bidAmount);
                } else {
                    emit TransferFailed(_projectId, "Refund failed");
                    revert("Failed to refund employer");
                }
            }
        }

        emit DisputeResolved(_projectId, _freelancerWins, _reason);
    }

    // Freelancer claims funds after approval or review period expiration
    function claimFunds(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        Submission storage submission = submissions[_projectId];
        require(msg.sender == project.freelancer, "Only the freelancer can claim funds");
        require(!project.isPaid, "Funds already released or refunded");

        bool canClaim = false;
        if (submission.status == SubmissionStatus.Approved) {
            canClaim = true;
        } else if (submission.status == SubmissionStatus.Submitted && block.timestamp > submission.submissionTime + REVIEW_PERIOD) {
            // Auto-approve if review period has expired
            submission.status = SubmissionStatus.Approved;
            project.completed = true;

            // Award reputation
            uint256 reward = 100 * 10**18; // 100 REP tokens
            reputationToken.transfer(project.freelancer, reward);
            freelancers[project.freelancer].reputation = reputationToken.balanceOf(project.freelancer);

            emit ProjectCompleted(_projectId, project.employer, project.freelancer, project.bidAmount);
            emit ReputationAwarded(project.freelancer, reward);
            canClaim = true;
        }

        require(canClaim, "Cannot claim funds yet");
        require(address(this).balance >= project.bidAmount, "Insufficient contract balance");

        (bool sent, ) = project.freelancer.call{value: project.bidAmount, gas: 50000}("");
        if (sent) {
            project.isPaid = true;
            emit FundsClaimed(_projectId, project.freelancer, project.bidAmount);
        } else {
            emit TransferFailed(_projectId, "Claim failed");
            revert("Failed to send Ether to freelancer");
        }
    }
}