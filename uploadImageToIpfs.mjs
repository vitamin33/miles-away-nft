import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'

import * as path from 'path'
import * as fs from 'fs'

import { generateNFTs } from './scripts/generateNfts.js'

const layersPath = path.join(process.cwd(), 'layers')
const outputPath = path.join(process.cwd(), 'output')

export const uploadImageToIpfs = async function uploadImageToIpfs() {

    let generatedFiles = await generateNFTs(1, layersPath, outputPath)
    let { imgPath, metadataPath } = generatedFiles.values().next().value
    let imgFile = fs.readFileSync(imgPath)

    console.log("Generated image path: ", imgPath)

    /* configure Infura auth settings */
    const projectId = "2J2EcVANAs4yTjWh28m2ef2XFuf"
    const projectSecret = "11bbbf033eabf15cd50ed8d6d987b294"
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

    /* Create an instance of the client */
    const client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
          authorization: auth,
      }
    })

    /* upload the image file */
    const addedImg = await client.add(imgFile)
    const ipfsImgUrl = `https://infura-ipfs.io/ipfs/${addedImg.path}`

    console.log("IPFS image url: ", ipfsImgUrl)

    var metadataContent = fs.readFileSync(metadataPath)
    let metadataJson = JSON.parse(metadataContent)
    metadataJson.image = ipfsImgUrl
    let metadataString = JSON.stringify(metadataJson)
    fs.writeFileSync(metadataString)
    metadataContent = fs.readFileSync(metadataPath)

    /* upload the metadata file */
    const addedMeta = await client.add(metadataContent)
    const ipfsMetaUrl = `https://infura-ipfs.io/ipfs/${addedMeta.path}`

    console.log("IPFS metadata url: ", ipfsMetaUrl)

    return ipfsMetaUrl
}

//module.exports = { uploadImageToIpfs }

async function main() {
  uploadImageToIpfs()
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});