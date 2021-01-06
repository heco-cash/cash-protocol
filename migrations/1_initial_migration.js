const Artifactor = require('@truffle/artifactor');
const artifactor = new Artifactor(`${__dirname}/../build/contracts`);

const Migrations = artifacts.require('Migrations')
const { bacPools, basPools } = require('./pools');

let InitialArtifacts = {
  UniswapV2Factory: require('@uniswap/v2-core/build/UniswapV2Factory.json'),
  UniswapV2Router02: require('@uniswap/v2-periphery/build/UniswapV2Router02.json'),
  UniswapV2Pair: require('@uniswap/v2-core/build/UniswapV2Pair.json'),
  DemaxPlatform: require('../assets/DemaxPlatform.json'),
};

module.exports = async function (deployer) {
  // for (const { contractName, token } of bacPools) {
  //   let name = token+contractName;
  //   InitialArtifacts[name] = require('../build/contracts/CashPool.json');
  //   InitialArtifacts[name].contractName = name;
  //   InitialArtifacts[token] = require('../build/contracts/ERC20Token.json');
  //   InitialArtifacts[token].contractName = token;
  // }

  for await ([contractName, legacyArtifact] of Object.entries(InitialArtifacts)) {
    console.log('artifactor.save:',contractName);
    await artifactor.save({
      contractName,
      ...legacyArtifact,
    });
  }

  await deployer.deploy(Migrations)
}
