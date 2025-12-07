// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TrustOracle - The Final Judge
 * @dev Aggregates off-chain votes to determine the immutable truth.
 * No single entity controls the outcome; the majority vote wins.
 */
contract TrustOracle {
    
    struct VerificationResult {
        bool isValid;
        uint256 timestamp;
        uint256 voteCount;
        bool decided;
    }

    // Mapping from Transaction ID (or Receipt ID) to its Final Result
    mapping(string => VerificationResult) public finalResults;

    event TruthDecided(string indexed txId, bool finalDecision, uint256 timestamp);

    /**
     * @dev Submits votes from multiple independent sources.
     * @param txId The unique identifier of the receipt/transaction.
     * @param votes An array of booleans from different verifiers (OCR, API, Fraud Audit).
     */
    function submitVotes(string calldata txId, bool[] calldata votes) external {
        require(!finalResults[txId].decided, "Truth already decided for this ID");
        require(votes.length > 0, "No votes provided");

        uint256 trueVotes = 0;
        uint256 falseVotes = 0;

        for (uint256 i = 0; i < votes.length; i++) {
            if (votes[i]) {
                trueVotes++;
            } else {
                falseVotes++;
            }
        }

        // Majority Consensus Rule
        bool decision = trueVotes > falseVotes;

        finalResults[txId] = VerificationResult({
            isValid: decision,
            timestamp: block.timestamp,
            voteCount: votes.length,
            decided: true
        });

        emit TruthDecided(txId, decision, block.timestamp);
    }

    /**
     * @dev Fetch the result for validition on frontend.
     */
    function getResult(string calldata txId) external view returns (bool isValid, uint256 timestamp, uint256 voteCount) {
        VerificationResult memory res = finalResults[txId];
        return (res.isValid, res.timestamp, res.voteCount);
    }
}
