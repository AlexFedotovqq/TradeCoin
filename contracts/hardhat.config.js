require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  gasReporter: {
    currency: "CHF",
    gasPrice: 21,
    enabled: true,
  },
  solidity: "0.5.16",

  networks: {
    apothem: {
      url: "https://rpc.apothem.network/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 51,
    },
    evmos: {
      url: "https://eth.bd.evmos.dev:8545",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 9000,
    },
    xinfin: {
      url: "https://erpc.xinfin.network",
      accounts: [process.env.PRIVATE_KEY],
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY],
    },
    trust: {
      url: "https://api2-testnet.trust.one",
      accounts: [process.env.PRIVATE_KEY],
    },
    mantle: {
      url: "https://rpc.testnet.mantle.xyz/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5001,
    },
    fantom: {
      url: "https://rpc.ftm.tools/",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 250,
    },
    filecoin: {
      url: "https://rpc.ankr.com/filecoin_testnet",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 3141,
    },
  },
};
