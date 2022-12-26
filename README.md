# Phaser 3 Texture Unpacker

### Unpacks multi-atlas texture files made by <a href="https://www.codeandweb.com/texturepacker">TexturePacker</a> for Phaser 3.
</br>

Example:

```
node textureunpacker.js male -sd playerchar -od frames
```
This will take a JSON atlas from `./playerchar/male.json`, and output the frames to `./frames/`

If `-sd` is omitted, the default is `./`

If `-od` is omitted, the default is `./output/`
</br>
</br>

## Works with

- Phaser 3 Texture atlases
- Multi-pack enabled
- PNG, JPEG, WebP or TIFF formats
- Trimmed frames
- Duplicated frames

## Doesn't work with

- Other frameworks
- Multi-pack disabled files
- Rotated frames
- Any other image formats
