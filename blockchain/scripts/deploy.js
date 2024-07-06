// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// import axios from 'axios';

async function main() {

  const axios = require('axios');

  let candidatesData = null; 
  let candidateIds = null;

  axios.post(`http://127.0.0.1:5000/candidates_data`, {
      elections_details_id: 1,
      credentials: 'same-origin',
      withCredentials: true,
      credentials: 'include'
      
    },
    {withCredentials: true},
  )
  .then(response => {
    if(response.status === 200){
        candidatesData = response.data.data;

        candidateIds = candidatesData.map(candidate => candidate.candidate_id);

    } else {
      console.log("coming to else");
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });


  const Voting = await ethers.getContractFactory("Voting");

  // Start deployment, returning a promise that resolves to a contract object
  console.log(candidateIds);
  const Voting_ = await Voting.deploy(candidateIds);
  console.log("Contract address:", Voting_.address);


}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });