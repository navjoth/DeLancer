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
        // New fields for IPFS CIDs
        string employerFileCID;  // CID of the employer's file (set during project creation)
        string freelancerFileCID; // CID of the freelancer's file (set during markReadyForReview/resubmitProject)
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
        projects[projectCount] = Project(projectCount, _name, _description, msg.sender, address(0), 0, false, false, "", "");
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

    // --- Existing Code for Mutual Agreement with Dispute Resolution ---

    enum ProjectState { Active, ReadyForReview, Disputed, Resubmitted, Completed }

    struct ReviewStatus {
        ProjectState state;
        uint256 readyForReviewTimestamp;
        uint256 disputeTimestamp;
        bool employerApproved;
    }

    mapping(uint256 => ReviewStatus) public reviewStatuses;

    uint256 public constant EMPLOYER_REVIEW_DEADLINE = 7 days;
    uint256 public constant FREELANCER_RESUBMIT_DEADLINE = 3 days;
    uint256 public constant EMPLOYER_REDISPUTE_DEADLINE = 3 days;

    event ProjectMarkedReadyForReview(uint256 projectId, address freelancer, uint256 timestamp);
    event ProjectApproved(uint256 projectId, address employer);
    event ProjectDisputed(uint256 projectId, address employer, uint256 timestamp);
    event ProjectResubmitted(uint256 projectId, address freelancer, uint256 timestamp);
    event FundsAutoReleased(uint256 projectId, address freelancer, uint256 amount);
    event FundsSplit(uint256 projectId, uint256 employerAmount, uint256 freelancerAmount);

    function markReadyForReview(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        ReviewStatus storage review = reviewStatuses[_projectId];

        require(msg.sender == project.freelancer, "Only the assigned freelancer can mark as ready");
        require(project.freelancer != address(0), "No freelancer assigned");
        require(!project.isPaid, "Funds already released");
        require(review.state == ProjectState.Active, "Project is not in active state");

        review.state = ProjectState.ReadyForReview;
        review.readyForReviewTimestamp = block.timestamp;
        emit ProjectMarkedReadyForReview(_projectId, msg.sender, block.timestamp);
    }

    function approveProject(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        ReviewStatus storage review = reviewStatuses[_projectId];

        require(msg.sender == project.employer, "Only the employer can approve");
        require(review.state == ProjectState.ReadyForReview || review.state == ProjectState.Resubmitted, "Project not ready for review");
        require(!project.isPaid, "Funds already released");

        project.completed = true;
        review.state = ProjectState.Completed;
        review.employerApproved = true;

        releaseFundsToFreelancer(_projectId);
        emit ProjectApproved(_projectId, msg.sender);
    }

    function disputeProject(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        ReviewStatus storage review = reviewStatuses[_projectId];

        require(msg.sender == project.employer, "Only the employer can dispute");
        require(review.state == ProjectState.ReadyForReview || review.state == ProjectState.Resubmitted, "Project not ready for dispute");
        require(!project.isPaid, "Funds already released");

        review.state = ProjectState.Disputed;
        review.disputeTimestamp = block.timestamp;
        emit ProjectDisputed(_projectId, msg.sender, block.timestamp);
    }

    function resubmitProject(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        ReviewStatus storage review = reviewStatuses[_projectId];

        require(msg.sender == project.freelancer, "Only the assigned freelancer can resubmit");
        require(review.state == ProjectState.Disputed, "Project not in disputed state");
        require(!project.isPaid, "Funds already released");
        require(block.timestamp <= review.disputeTimestamp + FREELANCER_RESUBMIT_DEADLINE, "Resubmission deadline passed");

        review.state = ProjectState.Resubmitted;
        emit ProjectResubmitted(_projectId, msg.sender, block.timestamp);
    }

    function checkDeadlines(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        ReviewStatus storage review = reviewStatuses[_projectId];

        require(!project.isPaid, "Funds already released");
        require(review.state != ProjectState.Active && review.state != ProjectState.Completed, "Project not in a review state");

        if (review.state == ProjectState.ReadyForReview &&
            block.timestamp > review.readyForReviewTimestamp + EMPLOYER_REVIEW_DEADLINE) {
            project.completed = true;
            review.state = ProjectState.Completed;
            releaseFundsToFreelancer(_projectId);
            emit FundsAutoReleased(_projectId, project.freelancer, project.bidAmount);
            return;
        }

        if (review.state == ProjectState.Disputed &&
            block.timestamp > review.disputeTimestamp + FREELANCER_RESUBMIT_DEADLINE) {
            splitFunds(_projectId);
            return;
        }

        if (review.state == ProjectState.Resubmitted &&
            block.timestamp > review.readyForReviewTimestamp + EMPLOYER_REDISPUTE_DEADLINE) {
            project.completed = true;
            review.state = ProjectState.Completed;
            releaseFundsToFreelancer(_projectId);
            emit FundsAutoReleased(_projectId, project.freelancer, project.bidAmount);
            return;
        }

        if (review.state == ProjectState.Disputed &&
            review.disputeTimestamp > review.readyForReviewTimestamp) {
            splitFunds(_projectId);
            return;
        }
    }

    function releaseFundsToFreelancer(uint256 _projectId) internal {
        Project storage project = projects[_projectId];
        require(address(this).balance >= project.bidAmount, "Insufficient contract balance");

        (bool sent, ) = project.freelancer.call{value: project.bidAmount, gas: 50000}("");
        if (sent) {
            project.isPaid = true;
            emit FundsReleased(_projectId, project.freelancer, project.bidAmount, true);
        } else {
            emit TransferFailed(_projectId, "Transfer to freelancer failed");
            revert("Failed to send Ether to freelancer");
        }
    }

    function splitFunds(uint256 _projectId) internal {
        Project storage project = projects[_projectId];
        require(address(this).balance >= project.bidAmount, "Insufficient contract balance");

        uint256 halfAmount = project.bidAmount / 2;

        (bool sentFreelancer, ) = project.freelancer.call{value: halfAmount, gas: 50000}("");
        if (!sentFreelancer) {
            emit TransferFailed(_projectId, "Transfer to freelancer failed in split");
            revert("Failed to send Ether to freelancer in split");
        }

        (bool sentEmployer, ) = project.employer.call{value: halfAmount, gas: 50000}("");
        if (!sentEmployer) {
            emit TransferFailed(_projectId, "Transfer to employer failed in split");
            revert("Failed to send Ether to employer in split");
        }

        project.isPaid = true;
        emit FundsSplit(_projectId, halfAmount, halfAmount);
    }

    // --- New Code for IPFS File Sharing ---

    // Events for file uploads
    event EmployerFileUploaded(uint256 projectId, string cid);
    event FreelancerFileUploaded(uint256 projectId, string cid);

    // Modified createProject to accept and store the employer's file CID
    function createProjectWithFile(string memory _name, string memory _description, string memory _employerFileCID) public {
        projectCount++;
        projects[projectCount] = Project(projectCount, _name, _description, msg.sender, address(0), 0, false, false, _employerFileCID, "");
        emit ProjectCreated(projectCount, _name, _description, msg.sender);
        if (bytes(_employerFileCID).length > 0) {
            emit EmployerFileUploaded(projectCount, _employerFileCID);
        }
    }

    // Modified markReadyForReview to accept and store the freelancer's file CID
    function markReadyForReviewWithFile(uint256 _projectId, string memory _freelancerFileCID) public {
        Project storage project = projects[_projectId];
        ReviewStatus storage review = reviewStatuses[_projectId];

        require(msg.sender == project.freelancer, "Only the assigned freelancer can mark as ready");
        require(project.freelancer != address(0), "No freelancer assigned");
        require(!project.isPaid, "Funds already released");
        require(review.state == ProjectState.Active, "Project is not in active state");

        project.freelancerFileCID = _freelancerFileCID;
        review.state = ProjectState.ReadyForReview;
        review.readyForReviewTimestamp = block.timestamp;
        emit ProjectMarkedReadyForReview(_projectId, msg.sender, block.timestamp);
        if (bytes(_freelancerFileCID).length > 0) {
            emit FreelancerFileUploaded(_projectId, _freelancerFileCID);
        }
    }

    // Modified resubmitProject to accept and update the freelancer's file CID
    function resubmitProjectWithFile(uint256 _projectId, string memory _freelancerFileCID) public {
        Project storage project = projects[_projectId];
        ReviewStatus storage review = reviewStatuses[_projectId];

        require(msg.sender == project.freelancer, "Only the assigned freelancer can resubmit");
        require(review.state == ProjectState.Disputed, "Project not in disputed state");
        require(!project.isPaid, "Funds already released");
        require(block.timestamp <= review.disputeTimestamp + FREELANCER_RESUBMIT_DEADLINE, "Resubmission deadline passed");

        project.freelancerFileCID = _freelancerFileCID;
        review.state = ProjectState.Resubmitted;
        emit ProjectResubmitted(_projectId, msg.sender, block.timestamp);
        if (bytes(_freelancerFileCID).length > 0) {
            emit FreelancerFileUploaded(_projectId, _freelancerFileCID);
        }
    }
}