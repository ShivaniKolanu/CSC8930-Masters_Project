// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract Voting {
    struct Candidate {
        int id;
        uint256 voteCount;
    }
    

    Candidate[] public candidates;
    address owner;

    constructor(int[] memory _candidateIds) {
        for(uint256 i = 0; i < _candidateIds.length; i++ ) {
            candidates.push(
                Candidate({
                    id: _candidateIds[i],
                    voteCount: 0
                })
            );
        }
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function addCandidate(int _id) public onlyOwner{
        candidates.push(Candidate ({
            id: _id,
            voteCount: 0
        }));
    }

    function vote(uint256 _candidateIndex) public {
        require(_candidateIndex < candidates.length, "Invalid Candidate Index");

        candidates[_candidateIndex].voteCount++;
    }

    function getAllVotesofCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}
