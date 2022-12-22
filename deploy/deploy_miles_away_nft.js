const { networkConfig } = require('../helper-hardhat.config');
//const { uploadImageToIpfs } = require('../uploadImageToIpfs.mjs');

module.exports = async({
  getNamedAccounts,
  deployments,
  getChainId
}) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()

  log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
  const milesAwayNft = await deploy("MilesAwayNft", {
    from: deployer,
    log: true
  })
  log(`You have deployed an NFT contract to : ${milesAwayNft.address}]`)

  const milesAwayContract = await ethers.getContractFactory("MilesAwayNft")
  const accounts = await hre.ethers.getSigners()
  const signer = accounts[0]
  const milesAwayNFT = new ethers.Contract(milesAwayNft.address, milesAwayContract.interface, signer)

  console.log("Chain id: ", chainId)
  const networkName = networkConfig[chainId]['name']

  log(`Verify with: \n npx hardhat verify --network ${networkName} ${milesAwayNFT.address}`)

  const uploadImageToIpfs = (await import('../uploadImageToIpfs.mjs')).default
  const metadataUri = uploadImageToIpfs()

  let transactionResponse = await milesAwayNFT.safeMint(accounts[0].address, metadataUri)
  let receipt = await transactionResponse.wait(1)

  log("You have made an NFT")

  let tokenURI = await milesAwayNFT.tokenURI(0)
  log(`NFT metadata URI: ${tokenURI}`)
}