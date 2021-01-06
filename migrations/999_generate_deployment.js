const fs = require('fs');
const path = require('path');
const util = require('util');
const { bacPools, basPools, contractAddresses } = require('./pools');
const lpPoolDAIBAC = artifacts.require(basPools.DAIBAC.contractName);
const lpPoolDAIBAS = artifacts.require(basPools.DAIBAS.contractName);

const CashPool = require('../build/contracts/CashPool.json');
const UniswapV2Pair = require('@uniswap/v2-core/build/UniswapV2Pair.json');

const writeFile = util.promisify(fs.writeFile);

function distributionPoolContracts() {
    return fs.readdirSync(path.resolve(__dirname, '../contracts/distribution'))
      .filter(filename => filename.endsWith('Pool.sol'))
      .map(filename => filename.replace('.sol', ''));
}

function getSharePools() {
  let pools = [];
  for (k in basPools) {
    pools.push(basPools[k].contractName);
  }
  
  return pools;
}

// Deployment and ABI will be generated for contracts listed on here.
// The deployment thus can be used on basiscash-frontend.
const exportedContracts = [
  'Oracle',
  'Cash',
  'Bond',
  'Share',
  'Boardroom',
  'Treasury',
  'Query',
  'SimpleERCFund',
  'InitialCashDistributor',
  'InitialShareDistributor',
  ...getSharePools()
];

module.exports = async (deployer, network, accounts) => {
  const deployments = {};

  for (const name of exportedContracts) {
    const contract = artifacts.require(name);
    deployments[name] = {
      address: contract.address,
      abi: contract.abi,
    };
    console.log(name, contract.address);
  }

  for (const { contractName, token, decimals } of bacPools) {
    let name = token+contractName
    deployments[name] = {
      address: contractAddresses[name],
      abi: CashPool.abi,
    };
    console.log(name, contractAddresses[name]);
    console.log(token, contractAddresses[token]);
  }

  let pool = await lpPoolDAIBAC.deployed();
  let addr = await pool.lpt();
  deployments['BACLPPair'] = {
    address: addr,
    abi: UniswapV2Pair.abi,
  };
  console.log('BACLPPair', addr);

  pool = await lpPoolDAIBAS.deployed();
  addr = await pool.lpt();
  deployments['BASLPPair'] = {
    address: addr,
    abi: UniswapV2Pair.abi,
  };
  console.log('BASLPPair', addr);

  const deploymentPath = path.resolve(__dirname, `../build/deployments.${network}.json`);
  await writeFile(deploymentPath, JSON.stringify(deployments, null, 2));

  console.log(`Exported deployments into ${deploymentPath}`);
};
