// https://docs.basis.cash/mechanisms/yield-farming
const INITIAL_BAC_FOR_POOLS = 50000;
const INITIAL_BAS_FOR_DAI_BAC = 750000;
const INITIAL_BAS_FOR_DAI_BAS = 250000;

const POOL_START_DATE = Date.parse('2020-11-30T00:00:00Z') / 1000;

const zeroAddress = '0x0000000000000000000000000000000000000000';
const chainSymbol = 'HT';
const bacPools = [
  { contractName: 'CashPool', token: 'HT' , decimals: 18},
  { contractName: 'CashPool', token: 'HUSD' , decimals: 8},
  { contractName: 'CashPool', token: 'HBTC', decimals: 18 },
  { contractName: 'CashPool', token: 'HETH', decimals: 18 },
];

const basPools = {
  DAIBAC: { contractName: 'BACLPTokenSharePool', token: 'DAI_BAC-LP' },
  DAIBAS: { contractName: 'BASLPTokenSharePool', token: 'DAI_BAS-LP' },
}

var contractAddresses = {}
var contracts = {}

module.exports = {
  POOL_START_DATE,
  INITIAL_BAC_FOR_POOLS,
  INITIAL_BAS_FOR_DAI_BAC,
  INITIAL_BAS_FOR_DAI_BAS,
  bacPools,
  basPools,
  contractAddresses,
  contracts,
  chainSymbol,
  zeroAddress,
};
