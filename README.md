# Phaser 3 Texture Unpacker

### Unpacks multi-atlas texture files made by <a href="https://www.codeandweb.com/texturepacker">TexturePacker</a> for Phaser 3.

</br>

Example:

```
node textureunpacker.js male -sd playerchar -od frames
```

This will take a JSON atlas from `./playerchar/male.json`, and output the frames to `./frames/`
</br>
</br>

## Works with

-   Phaser 3 texture atlases and image only texture atlases
-   Multi-pack enabled
-   PNG, JPEG, WebP or TIFF formats
-   Trimmed frames
-   Duplicated frames

## Doesn't work with

-   Other frameworks
-   Rotated frames
-   Any other image formats

## Options

-   `--sourcedir` or `-sd` | The full or relative path to input atlas files from. | Default: `./`
-   `--outputdir` or `-od` | The full or relative path to output extracted frames to. | Default: `./output/`
-   `--textureonly` or `-to` | The file name (including file extension) to extract frames from, if no atlas JSON is present. | No default
-   `--sourcewidth` or `-so` | The width of all frames for textureonly mode. | No default
-   `--sourceheight` or `-so` | The height of all frames for textureonly mode. | No default
