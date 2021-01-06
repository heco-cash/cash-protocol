const { bacPools, contractAddresses, contracts, INITIAL_BAC_FOR_POOLS } = require('./pools');

// Pools
// deployed first
const Cash = artifacts.require('Cash')
const InitialCashDistributor = artifacts.require('InitialCashDistributor');

// ============ Main Migration ============

module.exports = async (deployer, network, accounts) => {
  const unit = web3.utils.toBN(10 ** 18);
  const initialCashAmount = unit.muln(INITIAL_BAC_FOR_POOLS).toString();

  const cash = await Cash.deployed();
  let pools = [];
  for (const { contractName, token, decimals } of bacPools) {
    pools.push({
      address: contractAddresses[token+contractName],
      contract: contracts[token+contractName]
    });
  }

  await deployer.deploy(
    InitialCashDistributor,
    cash.address,
    pools.map(p => p.address),
    initialCashAmount,
  );
  const distributor = await InitialCashDistributor.deployed();

  console.log(`Setting distributor to InitialCashDistributor (${distributor.address})`);
  for await (const p of pools) {
    const contract = p.contract;
    console.log('init BACPool:', p.address);
    await contract.setRewardDistribution(distributor.address);
  }

  await cash.mint(distributor.address, initialCashAmount);
  console.log(`Deposited ${INITIAL_BAC_FOR_POOLS} BAC to InitialCashDistributor.`);

  await distributor.distribute();
}
