const fs = require('fs')
const sharp = require('sharp')

let options = {}

process.argv.forEach((val, index) => {
    switch (val) {
        case '-sd':
        case '--sourcedir':
            options.sourcedir = process.argv[index + 1]
            break
        case '-od':
        case '--outputdir':
            options.outputdir = process.argv[index + 1]
            break
        case '-to':
        case '--textureonly':
            options.textureonly = process.argv[index + 1]
            break
        case '-sw':
        case '--sourcewidth':
            options.sourcewidth = process.argv[index + 1]
            break
        case '-sh':
        case '--sourceheight':
            options.sourceheight = process.argv[index + 1]
            break
    }
})

// Reads the provided atlas file and extracts the textures
readAtlas(process.argv[2], options).then(
    () => console.log('Textures Unpacked')
)

async function readAtlas(atlas, options) {
    // Get source directory
    this.sourcedir = options.sourcedir || '.'

    // Get destination directory
    this.outputdir = options.outputdir || './output'

    // Remove trailing slash
    for (let dir of ['sourcedir', 'outputdir']) {
        if (this[dir].endsWith('/')) {
            this[dir] = this[dir].slice(0, -1)
        }
    }

    if (options.textureonly) {
        // Get texture file name
        const texturePath = `${this.sourcedir}/${options.textureonly}`

        // Check if texture exists
        if (!fs.existsSync(texturePath)) {
            return console.error(`Texture ${texturePath} does not exist`)
        }

        if (!options.sourcewidth || !options.sourceheight) {
            return console.error('Source width and height are required if JSON atlas is not provided')
        }

        return await readTextureNoAtlas(texturePath, parseInt(options.sourcewidth), parseInt(options.sourceheight))
    }

    // Get atlas file
    if (atlas == null) {
        return console.error('JSON texture atlas is required')
    }

    // If user did not provide a file extension, add it
    atlas = atlas.includes('.json') ? atlas : atlas + '.json'

    // Get the path to the atlas file
    const atlasPath = `${sourcedir}/${atlas}`

    // Check if atlas exists
    if (!fs.existsSync(atlasPath)) {
        return console.error(`Atlas ${atlasPath} does not exist`)
    }

    // Read atlas file
    let data = fs.readFileSync(atlasPath)
    let json = JSON.parse(data)

    for (const texture of json.textures) {
        // Gets each the path of each texture in the atlas
        let texturePath = `${this.sourcedir}/${texture.image}`

        // Check if texture exists
        if (!fs.existsSync(texturePath)) {
            console.error(`Texture ${texturePath} does not exist`);
        }

        // Read texture file
        await readTexture(texturePath, texture.frames)
    }
}

async function readTexture(texturePath, frames) {
    // Read texture file
    this[texturePath] = await sharp(texturePath)
    // Extract each frame from the texture
    for (const frame of frames) {
        await extractTexture(texturePath, frame)
    }
}

async function readTextureNoAtlas(texturePath, sourceWidth, sourceHeight) {
    // Read texture file
    this[texturePath] = await sharp(texturePath)

    // Get width and height of texture
    const metadata = await this[texturePath].metadata()
    const width = metadata.width
    const height = metadata.height

    // Calculate number of frames in texture
    const numFramesX = width / sourceWidth
    const numFramesY = height / sourceHeight

    // Extract each frame from the texture
    for (let y = 0; y < numFramesY; y++) {
        for (let x = 0; x < numFramesX; x++) {
            const frame = {
                filename: `${x}_${y}`,
                frame: {
                    x: x * sourceWidth,
                    y: y * sourceHeight,
                    w: sourceWidth,
                    h: sourceHeight,
                },
                spriteSourceSize: {
                    x: 0,
                    y: 0,
                    w: sourceWidth,
                    h: sourceHeight,
                },
                sourceSize: {
                    w: sourceWidth,
                    h: sourceHeight,
                },
            }
            await extractTexture(texturePath, frame)
        }
    }
}

async function extractTexture(texturePath, frame) {
    // Get output file name
    let output = `${this.outputdir}/${frame.filename}`.split('/')

    // Get output directory name
    output.pop()

    // Create output directory if it does not exist
    for (let i = 0; i < output.length; i++) {
        let dir = output.slice(0, i + 1).join('/')
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir)
        }
    }

    try {
        // Grab texture
        await this[texturePath]
            // Create a copy of the texture, so we can extract multiple frames
            .clone()
            // Crop the texture to the frame
            .extract({
                left: frame.frame.x,
                top: frame.frame.y,
                width: frame.frame.w,
                height: frame.frame.h,
            })
            // Extend the texture to the source size
            .extend({
                left: frame.spriteSourceSize.x,
                top: frame.spriteSourceSize.y,
                bottom: frame.sourceSize.h - frame.spriteSourceSize.h - frame.spriteSourceSize.y,
                right: frame.sourceSize.w - frame.spriteSourceSize.w - frame.spriteSourceSize.x,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            // Convert to png
            .toFormat('png')
            // Write to file
            .toFile(`${this.outputdir}/${frame.filename}.png`)
    } catch (err) {
        console.error(err)
    }
}