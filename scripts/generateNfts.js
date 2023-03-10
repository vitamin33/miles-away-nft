const mergeImages = require('merge-images')
const { Canvas, Image } = require('node-canvas')
const  path = require('path')
const  fs = require('fs')
const { MersenneTwister19937, bool, real } = require('random-js')
const content = require("../layers/content.js")

const layersPath = path.join(process.cwd(), 'layers')
const outputPath = path.join(process.cwd(), 'output')

const generateNFTs = async (num, layersPath, outputPath) => {

    let generated = new Set()
    let generatedMetaFiles = new Set()

    for (let tokenId=0; tokenId<num; tokenId++) {
        console.log(`Generating NFT #${tokenId} …`)
        console.log(`Current directory: ${process.cwd()}`);
        let selection = randomlySelectLayers(layersPath, content.layers)
        const traitsStr = JSON.stringify(selection.selectedTraits)

        if (generated.has(traitsStr)) {
            console.log("Duplicate detected. Retry …")
            tokenId--
            continue
        } else {
            generated.add(traitsStr)
            let imgPath = path.join(outputPath, `${tokenId}.png`)
            await mergeLayersAndSave(
                selection.images, 
                imgPath
            )

            let metadataPath = path.join(outputPath, `${tokenId}`)
            let metadata = generateMetadata(content, tokenId, selection.selectedTraits)

            fs.writeFileSync(metadataPath, JSON.stringify(metadata))
            generatedMetaFiles.add(
                { imgPath, metadataPath }
            )
        }
    }
    return generatedMetaFiles
}

function generateMetadata(content, tokenId, traits) {
    attributes = []
    for (const [trait_type, value] of Object.entries(traits)) {
        attributes.push({trait_type, value})
    }

    return content.metadataTemplate(tokenId, attributes)
}

function randomlySelectLayers(layersPath, layers) {
    const mt = MersenneTwister19937.autoSeed()

    console.log("Layers path: ", layersPath)

    let images = []
    let selectedTraits = {}

    for (const layer of layers) {
        if (bool(layer.probability)(mt)) {
            let selected = pickWeighted(mt, layer.options)
            selectedTraits[layer.name] = selected.name
            images.push(path.join(layersPath, selected.file))
        }
    }

    return {
        images,
        selectedTraits
    }
}

function pickWeighted(mt, options) {
    const weightSum = options.reduce((acc, option) => {
        return acc + (option.weight ?? 1.0)
    }, 0)

    const r = real(0.0, weightSum, false)(mt)

    let summedWeight = 0.0;
    for (const option of options) {
        summedWeight += option.weight ?? 1.0
        if (r <= summedWeight) {
            return option
        }
    }
}

async function mergeLayersAndSave(layers, outputFile) {
    const image = await mergeImages(layers, { Canvas: Canvas, Image: Image })
    saveBase64Image(image, outputFile)
}

function saveBase64Image(base64PngImage, filename) {
    let base64 = base64PngImage.split(',')[1]
    let imageBuffer = Buffer.from(base64, 'base64')
    fs.writeFileSync(filename, imageBuffer)
}

module.exports = { generateNFTs }