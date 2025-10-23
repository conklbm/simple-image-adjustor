# Simple Image Adjustor

A simple Python tool to prepare images for Facebook posting with automatic rotation, color enhancement, and intelligent resizing.

## Features

- **Rotate**: Rotates the image by 1 degree (or custom angle)
- **Color Enhancement**: Enhances image colors for better visual appeal
- **Smart Facebook Resizing**: Automatically chooses the best Facebook size based on aspect ratio:
  - 1080 x 1080 pixels (square) - preferred when possible
  - 1080 x 1350 pixels (portrait)
  - 1080 x 566 pixels (landscape)

## Installation

1. Clone this repository
2. Install dependencies:

```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

Process an image with default settings (1 degree rotation, 1.3x color enhancement):

```bash
python image_adjustor.py input_image.jpg
```

This will create a new file called `input_image_facebook.jpg` in the same directory.

### Specify Output File

```bash
python image_adjustor.py input_image.jpg -o output_image.jpg
```

### Custom Rotation Angle

```bash
python image_adjustor.py input_image.jpg -r 2.5
```

### Custom Color Enhancement

```bash
python image_adjustor.py input_image.jpg -c 1.5
```

The color factor works as follows:
- `1.0` = no change
- `> 1.0` = more saturated colors
- `< 1.0` = less saturated colors

### Combine Options

```bash
python image_adjustor.py input_image.jpg -o processed.jpg -r 2 -c 1.4
```

## Command Line Options

```
positional arguments:
  input                 Input image path

optional arguments:
  -h, --help            Show help message and exit
  -o OUTPUT, --output OUTPUT
                        Output image path (optional)
  -r ROTATE, --rotate ROTATE
                        Rotation angle in degrees (default: 1)
  -c COLOR, --color COLOR
                        Color enhancement factor (default: 1.3)
```

## Making the Script Executable (Unix/Linux/Mac)

To run the script directly without typing `python` first:

```bash
chmod +x image_adjustor.py
./image_adjustor.py input_image.jpg
```

## How It Works

1. **Loads** the input image
2. **Converts** to RGB format if needed
3. **Rotates** by specified degrees (default: 1 degree)
4. **Enhances** colors using PIL's Color enhancer
5. **Determines** best Facebook size based on aspect ratio:
   - Square images (0.9-1.1 ratio): 1080x1080
   - Portrait images (< 0.9 ratio): 1080x1350
   - Landscape images (> 1.1 ratio): 1080x566
6. **Resizes** while maintaining aspect ratio and centers on white background
7. **Saves** the processed image with high quality (95%)

## Examples

### Process a portrait photo
```bash
python image_adjustor.py portrait.jpg
# Output: portrait_facebook.jpg (1080x1350)
```

### Process a landscape photo
```bash
python image_adjustor.py landscape.jpg
# Output: landscape_facebook.jpg (1080x566)
```

### Process a square photo
```bash
python image_adjustor.py square.jpg
# Output: square_facebook.jpg (1080x1080)
```

## Supported Image Formats

The tool supports all common image formats:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- BMP (.bmp)
- TIFF (.tiff, .tif)
- WebP (.webp)
- And more formats supported by Pillow

## Requirements

- Python 3.6+
- Pillow (PIL) 10.0.0+

## License

MIT License - Feel free to use and modify as needed.
