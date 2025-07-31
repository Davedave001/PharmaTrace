// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Trace {
    struct Batch {
        string batchID;
        string qaResult;
        string serialNo;
        uint256 timestamp;
    }

    mapping(string => Batch) public batches;

    event BatchRecorded(string batchID, string qaResult, string serialNo, uint256 timestamp);

    function recordBatch(string memory batchID, string memory qaResult, string memory serialNo) public {
        require(bytes(batches[batchID].batchID).length == 0, "Batch already exists");
        batches[batchID] = Batch(batchID, qaResult, serialNo, block.timestamp);
        emit BatchRecorded(batchID, qaResult, serialNo, block.timestamp);
    }

    function getBatch(string memory batchID) public view returns (Batch memory) {
        return batches[batchID];
    }
}
