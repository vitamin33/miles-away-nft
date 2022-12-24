require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")
require('dotenv').config()

const MUMBAI_RPC_URL = process.env.MUMBAI_RPC
const PRIVATE_KEY = process.env.PRIVATE_KEY
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: { },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY
  },
  solidity: "0.8.17",
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0 
    }
  }
};
