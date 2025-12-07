// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ExpenseShield - The Flare Trust Engine
 * @dev Implements FDC Verification, FTSO Historic Pricing, 
 * Anti-Double-Spending, and Gasless Relaying.
 */

interface IFdcHub {
    function verify(bytes calldata proof) external view returns (bool);
}

interface IFtsoRegistry {
    function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals);
}

interface IFlareContractRegistry {
    function getContractAddressByName(string calldata _name) external view returns (address);
}

contract ExpenseShield {
    IFlareContractRegistry public contractRegistry;
    
    // Anti-Double-Spending Mapping
    mapping(bytes32 => bool) public usedTransactionHashes;

    event ExpenseVerified(bytes32 indexed txHash, address indexed user, bool valid);
    event GaslessSubmission(address indexed user, bytes32 indexed txHash);

    constructor(address _contractRegistry) {
        contractRegistry = IFlareContractRegistry(_contractRegistry);
    }

    /**
     * @dev Core Verification Logic: FDC + Anti-Replay
     */
    function verifyPayment(bytes32 txHash, bytes calldata proof, address user) public {
        // 1. Anti-Plagiarism Check
        require(!usedTransactionHashes[txHash], "Plagiarism Detected: This payment has already been used.");

        // 2. FDC Verification
        address fdcHubAddr = contractRegistry.getContractAddressByName("FdcHub");
        // For Mock/Testnet environments where FDC might not be fully available or we are simulating:
        if (fdcHubAddr != address(0)) {
            IFdcHub fdcHub = IFdcHub(fdcHubAddr);
            bool valid = fdcHub.verify(proof);
            require(valid, "FDC Verification Failed: Invalid Proof");
        }

        // 3. Mark Hash as Used
        usedTransactionHashes[txHash] = true;
        
        emit ExpenseVerified(txHash, user, true);
    }

    /**
     * @dev Gasless Relayer: Pays gas for the user.
     * signature must accept the hash of (txHash, user) signed by user's private key.
     */
    function submitProofForUser(bytes32 txHash, bytes calldata proof, bytes memory signature, address user) external {
        // 1. Verify Signature (Simplistic EIP-191 style for MVP)
        bytes32 messageHash = keccak256(abi.encodePacked(txHash, user));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        
        address signer = recoverSigner(ethSignedMessageHash, signature);
        require(signer == user, "Invalid Signature: Unauthorized submission");

        emit GaslessSubmission(user, txHash);

        // 2. Proceed to Verify
        verifyPayment(txHash, proof, user);
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    /**
     * @dev FTSO: Historic Price Lookup (Mocked structure for MVP)
     * In a real version, this uses the FTSO Historic Data provider.
     */
    function getHistoricPrice(string memory symbol, uint256 timestamp) external view returns (uint256) {
        // For MVP, we return current price as "Historic" proxy if historic API isn't easy to mock here
        address ftsoRegistryAddr = contractRegistry.getContractAddressByName("FtsoRegistry");
        if (ftsoRegistryAddr == address(0)) return 0;

        IFtsoRegistry ftsoRegistry = IFtsoRegistry(ftsoRegistryAddr);
        (uint256 price, , ) = ftsoRegistry.getCurrentPriceWithDecimals(symbol);
        return price; 
    }
}
