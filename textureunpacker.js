const fs = require('fs')
const sharp = require('sharp')

let options = {}

process.argv.forEach((val, index) => {
    switch (val) {
        case '-sd':
            options.sourcedir = process.argv[index + 1]
            break
        case '-od':
            options.outputdir = process.argv[index + 1]
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
    this[texturePath] = await sharp(texturePath)
    for (const frame of frames) {
        await extractTexture(texturePath, frame)
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
        await this[texturePath]
            .clone()
            .extract({
                left: frame.frame.x,
                top: frame.frame.y,
                width: frame.frame.w,
                height: frame.frame.h,
            })
            .extend({
                left: frame.spriteSourceSize.x,
                top: frame.spriteSourceSize.y,
                bottom: frame.sourceSize.h - frame.spriteSourceSize.h - frame.spriteSourceSize.y,
                right: frame.sourceSize.w - frame.spriteSourceSize.w - frame.spriteSourceSize.x,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .toFormat('png')
            .toFile(`${this.outputdir}/${frame.filename}.png`)
    } catch (err) {
        console.error(err)
    }
}