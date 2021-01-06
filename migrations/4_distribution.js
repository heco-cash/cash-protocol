const knownContracts = require('./known-contracts');
const { bacPools, contractAddresses, contracts, POOL_START_DATE } = require('./pools');

// Tokens
// deployed first
const Cash = artifacts.require('Cash');
const MockDai = artifacts.require('MockDai');

// ============ Main Migration ============
module.exports = async (deployer, network, accounts) => {
  for await (const { contractName, token, decimals } of bacPools) {
    const tokenAddress = contractAddresses[token];
    if(knownContracts.hasOwnProperty(token) && knownContracts[token].hasOwnProperty(network)) {
      tokenAddress = knownContracts[token][network]
    }
    if (!tokenAddress) {
      // network is mainnet, so MockDai is not available
      throw new Error(`Address of ${token} is not registered on migrations/known-contracts.js!`);
    }
    
    let name = token+contractName;
    console.log(`deploy ${name}`);
    const contract = artifacts.require('CashPool');
    let pool = await deployer.deploy(contract, Cash.address, tokenAddress, POOL_START_DATE);
    contractAddresses[name] = pool.address;
    contracts[name] = pool;
  }
};
