const knownContracts = require('./known-contracts');
const { contractAddresses, POOL_START_DATE } = require('./pools');

const Cash = artifacts.require('Cash');
const Share = artifacts.require('Share');
const Oracle = artifacts.require('Oracle');
const MockDai = artifacts.require('MockDai');

const DAIBACLPToken_BASPool = artifacts.require('BACLPTokenSharePool')
const DAIBASLPToken_BASPool = artifacts.require('BASLPTokenSharePool')

const UniswapV2Factory = artifacts.require('UniswapV2Factory');

module.exports = async (deployer, network, accounts) => {
  const uniswapFactory = ['dev'].includes(network)
    ? await UniswapV2Factory.deployed()
    : await UniswapV2Factory.at(knownContracts.UniswapV2Factory[network]);

  let dai = contractAddresses[knownContracts.SharePoolToken];
  if(network === 'mainnet') {
    dai = knownContracts.DAI[network];
  } else if(knownContracts.hasOwnProperty(knownContracts.SharePoolToken) && knownContracts[knownContracts.SharePoolToken].hasOwnProperty(network)) {
    dai = knownContracts[knownContracts.SharePoolToken][network];
  }

  const oracle = await Oracle.deployed();

  const dai_bac_lpt = await oracle.pairFor(uniswapFactory.address, Cash.address, dai);
  const dai_bas_lpt = await oracle.pairFor(uniswapFactory.address, Share.address, dai);

  await deployer.deploy(DAIBACLPToken_BASPool, Share.address, dai_bac_lpt, POOL_START_DATE);
  await deployer.deploy(DAIBASLPToken_BASPool, Share.address, dai_bas_lpt, POOL_START_DATE);
};
