import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'

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

/* upload the file */
const added = await client.add(file)
const url = `https://infura-ipfs.io/ipfs/${added.path}`

console.log("IPFS image url: ", url)