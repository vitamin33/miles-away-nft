require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-waffle")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: { }
  },
  solidity: "0.8.17",
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0 
    }
  }
};
