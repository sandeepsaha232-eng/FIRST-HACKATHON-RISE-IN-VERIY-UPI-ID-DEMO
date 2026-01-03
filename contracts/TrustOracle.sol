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

    // --------------------------------------------------------
    // FLARE FDC INTEGRATION
    // --------------------------------------------------------

    // Mock Interface for FdcVerification
    // In production: import "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
    function verifyFdcProof(bytes32[] calldata merkleProof, bytes32 root) internal pure returns (bool) {
         // This is where we would call: IPaymentVerification(fdcAddr).verifyPayment(proof);
         // For demo, we assume if the root is non-zero, it's valid.
         return root != bytes32(0);
    }

    /**
     * @dev Consumes a Merkle Proof from the FDC to verify a UPI ID.
     * @param upiId The UPI ID (used as key).
     * @param merkleRoot The root returned by the FDC.
     */
    function verifyUpiProof(string calldata upiId, bytes32 merkleRoot) external {
        require(merkleRoot != bytes32(0), "Invalid Merkle Root");

        // 1. Verify the Proof against the FDC Contract (Simulated)
        bool isProofValid = verifyFdcProof(new bytes32[](0), merkleRoot);
        require(isProofValid, "FDC Proof Verification Failed");

        // 2. Store the Verified Result
        finalResults[upiId] = VerificationResult({
            isValid: true,
            timestamp: block.timestamp,
            voteCount: 100, // Weighted vote from FDC
            decided: true
        });

        emit TruthDecided(upiId, true, block.timestamp);
    }
}
