# Simple Image Adjustor

A web-based image editing tool designed to prepare images for Facebook posting with intuitive controls and professional results.

## Features

- **Interactive Crop Tool** - Select and adjust the exact portion of your image to keep
- **Color Enhancement** - Boost image colors with adjustable saturation (0.5x - 2.0x)
- **Smart Rotation** - Rotate images by small angles (0.5° default, adjustable -5° to +5°)
- **Facebook Size Presets** - Choose from optimal Facebook dimensions:
  - 1080 x 1080 pixels (Square) - Recommended
  - 1080 x 1350 pixels (Portrait)
  - 1080 x 566 pixels (Landscape)
- **Optional Watermark** - Add your logo or watermark with:
  - Adjustable opacity (0-100%)
  - Flexible positioning (corners, center)
  - Customizable size (5-50% of image)

## How to Use

### Quick Start

1. **Open the app** - Simply open `index.html` in any modern web browser
2. **Upload an image** - Click the upload area and select your image
3. **Edit your image** - Use the controls on the right panel
4. **Preview** - Click "Preview Changes" to see the result
5. **Download** - Click "Download Image" to save your edited image

### No Installation Required!

This is a 100% client-side web app. Just open `index.html` in your browser and start editing. Your images never leave your computer!

## Detailed Instructions

### 1. Upload Your Image

Click the "Click to upload image" area and select any image file from your computer. Supported formats include:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- BMP (.bmp)

### 2. Crop Your Image (Optional)

1. Click **"Enable Crop Selection"**
2. A white border will appear - this is your crop area
3. **Drag the box** to move it
4. **Drag the corner handles** to resize it
5. Click **"Apply Crop"** to crop, or **"Cancel"** to go back

### 3. Adjust Color Enhancement

Use the slider to increase or decrease color saturation:
- **< 1.0** - Desaturate (more muted colors)
- **1.0** - No change
- **> 1.0** - Enhanced saturation (more vibrant colors)
- **Default: 1.3x** (recommended for social media)

### 4. Adjust Rotation

Fine-tune your image angle with the rotation slider:
- Range: -5° to +5°
- **Default: 0.5°** (subtle adjustment)
- Useful for straightening horizons or adding slight tilt

### 5. Select Facebook Size

Choose the aspect ratio that best fits your image:

- **Square (1080x1080)** - Best for profile pictures, general posts
- **Portrait (1080x1350)** - Best for tall/vertical images
- **Landscape (1080x566)** - Best for wide/horizontal images

The app will automatically resize and center your image on a white background.

### 6. Add Watermark (Optional)

1. Click **"Upload Watermark"**
2. Choose your logo/watermark file
3. Adjust settings:
   - **Opacity** - How transparent the watermark appears (50% recommended)
   - **Position** - Where to place it (bottom-right is common)
   - **Size** - How large the watermark should be (20% recommended)
4. To remove: Click **"Remove"** button

### 7. Preview and Download

- Click **"Preview Changes"** to see your final image
- Make any adjustments needed
- Click **"Download Image"** to save as `facebook-image.jpg`
- Click **"Reset to Original"** to start over

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Privacy

All image processing happens **locally in your browser**. Your images are never uploaded to any server. This app works completely offline once loaded.

## Tips for Best Results

1. **Use high-quality source images** - The app maintains quality, but can't improve low-resolution sources
2. **Crop first** - Get your composition right before adjusting colors
3. **Preview often** - Check your changes before downloading
4. **Square is safest** - The 1080x1080 format works for most Facebook contexts
5. **Subtle enhancements** - Don't over-saturate colors (1.2x-1.5x is usually ideal)
6. **Watermark placement** - Bottom-right is standard, but top-left works for landscape images

## Technical Details

- Built with pure HTML, CSS, and JavaScript
- Uses HTML5 Canvas API for image manipulation
- No frameworks or dependencies
- File size: ~50KB total
- Processing speed: Instant (client-side)

## File Structure

```
simple-image-adjustor/
├── index.html          # Main HTML file
├── style.css           # Styling and layout
├── script.js           # Image processing logic
└── README.md           # This file
```

## Keyboard Shortcuts

- **Escape** - Cancel crop mode
- **Enter** - Apply crop

## Troubleshooting

**Image won't upload**
- Check file format (JPEG, PNG, GIF, WebP supported)
- Try a smaller file size (< 10MB recommended)

**Preview looks different than expected**
- Click "Preview Changes" again
- Try adjusting settings one at a time
- Click "Reset to Original" and start over

**Download not working**
- Make sure you've clicked "Preview Changes" first
- Check your browser's download settings
- Try a different browser

## License

Free to use and modify. No attribution required.

## Support

For issues or suggestions, please open an issue on the GitHub repository.

---

**Made with HTML5 Canvas** | **No server required** | **Privacy-focused**
