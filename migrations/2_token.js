// ============ Contracts ============

// Token
// deployed first
const Cash = artifacts.require('Cash')
const Bond = artifacts.require('Bond')
const Share = artifacts.require('Share')
// const MockDai = artifacts.require('MockDai');
const { bacPools, chainSymbol, zeroAddress, contractAddresses, contracts } = require('./pools');
const fs = require("fs");
const path = require("path");

// ============ Main Migration ============

const migration = async (deployer, network, accounts) => {
  await Promise.all([deployToken(deployer, network, accounts)])
}

module.exports = migration

// ============ Deploy Functions ============

async function deployToken(deployer, network, accounts) {
  await deployer.deploy(Cash);
  await deployer.deploy(Bond);
  await deployer.deploy(Share);
  if (network !== 'mainnet') {
    // const dai = await deployer.deploy(MockDai);
    // console.log(`MockDAI address: ${dai.address}`);
    let testUsers = [];
    if(fs.existsSync(path.join(__dirname, ".config.json"))) {
      let _config = JSON.parse(fs.readFileSync(path.join(__dirname, ".config.json")).toString());
      testUsers = _config['TestUsers'];
    }
    
    for (const { contractName, token, decimals } of bacPools) {
      console.log('deployToken:', token);
      if(token == chainSymbol) {
        contractAddresses[token] = zeroAddress;
        continue;
      }
      let contract = artifacts.require('ERC20Token');
      let tokenContract = await deployer.deploy(contract, token, token, decimals, '100000000000000000000000000');
      console.log(`${token} address: ${tokenContract.address}`);
      contractAddresses[token] = tokenContract.address;
      contracts[token] = tokenContract;

      for (const user of testUsers) {
        const unit = web3.utils.toBN(10 ** decimals);
        const amount = unit.muln(100);
        console.log(`${token} transfer`);
        await tokenContract.transfer(user, amount);
      }

    }
  }
}