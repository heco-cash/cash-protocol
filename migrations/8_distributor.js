const Distributor = artifacts.require('Distributor');
const InitialCashDistributor = artifacts.require('InitialCashDistributor');
const InitialShareDistributor = artifacts.require('InitialShareDistributor');
const Query = artifacts.require('Query');
const Oracle = artifacts.require('Oracle')

module.exports = async (deployer, network, accounts) => {
  const distributors = await Promise.all(
    [
      InitialCashDistributor,
      InitialShareDistributor,
    ].map(distributor => distributor.deployed())
  );

  await deployer.deploy(
    Distributor,
    distributors.map(contract => contract.address),
  );
  const distributor = await Distributor.deployed();
  console.log(`Distributor manager contract is ${distributor.address}`);

  await deployer.deploy(
    Query
  );
  await Query.deployed().then(query => query.setDistributor(InitialCashDistributor.address, InitialShareDistributor.address));
  console.log(`Query contract is ${Query.address}`);
  
  await Oracle.deployed().then(oracle => oracle.update());

}
