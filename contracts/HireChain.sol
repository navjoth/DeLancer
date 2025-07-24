pragma solidity ^0.8.0;

contract HireChain {
    enum Role { Employer, Freelancer }
    enum ExperienceLevel { Beginner, Intermediate, Expert }

    struct Project {
        uint256 id;
        string name;
        string description;
        address employer;
        address freelancer;
        uint256 bidAmount;
        bool completed;
        bool isPaid;
        string employerFileCID;
        string[] requiredSkills;
    }

    struct Freelancer {
        address freelancerAddress;
        uint256 reputation;
        uint256 assignedProjects;
        uint256 completedProjects;
    }

    struct FeeProposal {
        address freelancer;
        uint256 proposedFee;
        ExperienceLevel experienceLevel;
        string[] freelancerSkills;
    }

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

    function createProject(string memory _name, string memory _description, string memory _employerFileCID, string[] memory _requiredSkills) public {
        projectCount++;
        projects[projectCount] = Project(projectCount, _name, _description, msg.sender, address(0), 0, false, false, _employerFileCID, _requiredSkills);
        emit ProjectCreated(projectCount, _name, _description, msg.sender);
    }

    function depositFunds(uint _projectId) public payable {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can deposit funds");
        require(project.bidAmount > 0, "Bid amount must be set");
        require(msg.value == project.bidAmount, "Deposit must match the project amount");
        emit FundsDeposited(_projectId, msg.value);
    }

    function applyForProject(uint256 _projectId, uint256 _bidAmount, ExperienceLevel _experienceLevel, string[] memory _freelancerSkills) public {
        Project storage project = projects[_projectId];
        require(project.employer != address(0), "Project does not exist");
        require(project.freelancer == address(0), "Project already has a freelancer");
        feeProposals[_projectId].push(FeeProposal(msg.sender, _bidAmount, _experienceLevel, _freelancerSkills));
        if (freelancers[msg.sender].freelancerAddress == address(0)) {
            freelancers[msg.sender] = Freelancer(msg.sender, 0, 0, 0);
        }
        emit ProjectApplied(_projectId, msg.sender, _bidAmount);
    }

    
    function calculateSkillMatchScore(string[] storage requiredSkills, string[] memory freelancerSkills) internal view returns (uint256) {
        uint256 skillMatchScore = 0;
        for (uint256 j = 0; j < requiredSkills.length; j++) {
            for (uint256 k = 0; k < freelancerSkills.length; k++) {
                if (keccak256(abi.encodePacked(requiredSkills[j])) == keccak256(abi.encodePacked(freelancerSkills[k]))) {
                    skillMatchScore++;
                }
            }
        }
        return skillMatchScore;
    }

    function assignFreelancer(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can assign a freelancer");
        require(project.freelancer == address(0), "Freelancer already assigned");

        FeeProposal[] memory proposals = feeProposals[_projectId];
        require(proposals.length > 0, "No freelancers have applied");

        address bestFreelancer = address(0);
        uint256 bestScore = 0;

        for (uint256 i = 0; i < proposals.length; i++) {
            address freelancer = proposals[i].freelancer;
            uint256 reputation = freelancers[freelancer].reputation;
            uint256 proposedFee = proposals[i].proposedFee;
            ExperienceLevel experienceLevel = proposals[i].experienceLevel;
            uint256 assignedProjects = freelancers[freelancer].assignedProjects;
            uint256 completedProjects = freelancers[freelancer].completedProjects;

            
            uint256 completionRate = assignedProjects == 0 ? 100 : (completedProjects * 100) / assignedProjects;

            
            uint256 experienceScore = (experienceLevel == ExperienceLevel.Beginner) ? 1 :
                                     (experienceLevel == ExperienceLevel.Intermediate) ? 2 : 3;

            
            uint256 skillMatchScore = calculateSkillMatchScore(project.requiredSkills, proposals[i].freelancerSkills);
            
            skillMatchScore = (skillMatchScore * 100) / 5;
            if (skillMatchScore > 100) skillMatchScore = 100;

            
            uint256 feeScore = proposedFee > 0 ? (100 * 1e18 / proposedFee) : 0;
            if (feeScore > 100) feeScore = 100;

            
            // Weights: Reputation (25%), Fee (20%), Experience (20%), Skill Match (20%), Completion Rate (15%)
            uint256 score = (reputation * 25) + (feeScore * 20) + (experienceScore * 20 * 33) +
                           (skillMatchScore * 20) + (completionRate * 15);

            if (score > bestScore) {
                bestScore = score;
                bestFreelancer = freelancer;
            }
        }

        require(bestFreelancer != address(0), "No suitable freelancer found");
        project.freelancer = bestFreelancer;

        
        for (uint256 i = 0; i < proposals.length; i++) {
            if (proposals[i].freelancer == bestFreelancer) {
                project.bidAmount = proposals[i].proposedFee;
                break;
            }
        }

        
        freelancers[bestFreelancer].assignedProjects += 1;

        emit FreelancerAssigned(_projectId, bestFreelancer, project.bidAmount);
    }

    function completeProject(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.employer, "Only employer can mark as complete");
        require(project.freelancer != address(0), "No freelancer assigned");
        require(!project.isPaid, "Funds already released");

        project.completed = true;
        uint256 reward = 10;
        freelancers[project.freelancer].reputation += reward;
        freelancers[project.freelancer].completedProjects += 1;
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
        return freelancers[_freelancer].reputation;
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

    enum ProjectState { Active, ReadyForReview, Disputed, Resubmitted, Completed }

    struct ReviewStatus {
        ProjectState state;
        uint256 readyForReviewTimestamp;
        uint256 disputeTimestamp;
        bool employerApproved;
        string freelancerFileCID;
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

    function markReadyForReview(uint256 _projectId, string memory _freelancerFileCID) public {
        Project storage project = projects[_projectId];
        ReviewStatus storage review = reviewStatuses[_projectId];

        require(msg.sender == project.freelancer, "Only the assigned freelancer can mark as ready");
        require(project.freelancer != address(0), "No freelancer assigned");
        require(!project.isPaid, "Funds already released");
        require(review.state == ProjectState.Active, "Project is not in active state");

        review.state = ProjectState.ReadyForReview;
        review.readyForReviewTimestamp = block.timestamp;
        review.freelancerFileCID = _freelancerFileCID;
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

    function resubmitProject(uint256 _projectId, string memory _freelancerFileCID) public {
        Project storage project = projects[_projectId];
        ReviewStatus storage review = reviewStatuses[_projectId];

        require(msg.sender == project.freelancer, "Only the assigned freelancer can resubmit");
        require(review.state == ProjectState.Disputed, "Project not in disputed state");
        require(!project.isPaid, "Funds already released");
        require(block.timestamp <= review.disputeTimestamp + FREELANCER_RESUBMIT_DEADLINE, "Resubmission deadline passed");

        review.state = ProjectState.Resubmitted;
        review.freelancerFileCID = _freelancerFileCID;
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
}