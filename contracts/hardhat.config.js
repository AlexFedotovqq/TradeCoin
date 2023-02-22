require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
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
    Trust: {
      url: "https://api2-testnet.trust.one",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
