#!/usr/bin/env python3
"""
Simple Image Adjustor Tool
Processes images for Facebook posting with rotation, color enhancement, and resizing.
"""

import argparse
import os
import sys
from pathlib import Path
from PIL import Image, ImageEnhance


def determine_facebook_size(width, height):
    """
    Determine the best Facebook image size based on aspect ratio.

    Facebook sizes:
    - 1080 x 1350 pixels (portrait, 0.8 ratio)
    - 1080 x 1080 pixels (square, 1.0 ratio)
    - 1080 x 566 pixels (landscape, 1.91 ratio)

    Priority: Try to use 1080x1080 when possible.
    """
    aspect_ratio = width / height

    # If close to square (between 0.9 and 1.1), use square format
    if 0.9 <= aspect_ratio <= 1.1:
        return (1080, 1080)
    # If portrait (taller than wide)
    elif aspect_ratio < 0.9:
        return (1080, 1350)
    # If landscape (wider than tall)
    else:
        return (1080, 566)


def rotate_image(image, degrees=1):
    """Rotate image by specified degrees."""
    return image.rotate(degrees, expand=True, fillcolor='white')


def enhance_colors(image, factor=1.3):
    """
    Enhance the colors of the image.
    Factor > 1.0 increases color saturation.
    """
    enhancer = ImageEnhance.Color(image)
    return enhancer.enhance(factor)


def resize_for_facebook(image, target_size):
    """
    Resize image to Facebook dimensions while maintaining aspect ratio.
    Uses high-quality Lanczos resampling.
    """
    # Calculate the scaling to fit the target while maintaining aspect ratio
    target_width, target_height = target_size
    img_width, img_height = image.size

    # Calculate ratios
    width_ratio = target_width / img_width
    height_ratio = target_height / img_height

    # Use the smaller ratio to ensure the image fits within bounds
    scale_ratio = min(width_ratio, height_ratio)

    # Calculate new size
    new_width = int(img_width * scale_ratio)
    new_height = int(img_height * scale_ratio)

    # Resize with high quality
    resized = image.resize((new_width, new_height), Image.Resampling.LANCZOS)

    # Create a new image with the target size and paste the resized image
    final_image = Image.new('RGB', target_size, 'white')
    paste_x = (target_width - new_width) // 2
    paste_y = (target_height - new_height) // 2
    final_image.paste(resized, (paste_x, paste_y))

    return final_image


def process_image(input_path, output_path=None, rotation_degrees=1, color_factor=1.3):
    """
    Process an image with rotation, color enhancement, and Facebook resizing.

    Args:
        input_path: Path to input image
        output_path: Path to save processed image (optional)
        rotation_degrees: Degrees to rotate (default: 1)
        color_factor: Color enhancement factor (default: 1.3)
    """
    # Load image
    try:
        image = Image.open(input_path)
        print(f"Loaded image: {input_path}")
        print(f"Original size: {image.size[0]}x{image.size[1]}")
    except Exception as e:
        print(f"Error loading image: {e}")
        sys.exit(1)

    # Convert to RGB if necessary (handles RGBA, grayscale, etc.)
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Step 1: Rotate
    print(f"Rotating image by {rotation_degrees} degree(s)...")
    image = rotate_image(image, rotation_degrees)

    # Step 2: Enhance colors
    print(f"Enhancing colors (factor: {color_factor})...")
    image = enhance_colors(image, color_factor)

    # Step 3: Determine Facebook size
    fb_size = determine_facebook_size(image.size[0], image.size[1])
    print(f"Target Facebook size: {fb_size[0]}x{fb_size[1]}")

    # Step 4: Resize for Facebook
    print("Resizing for Facebook...")
    image = resize_for_facebook(image, fb_size)

    # Determine output path
    if output_path is None:
        input_file = Path(input_path)
        output_path = input_file.parent / f"{input_file.stem}_facebook{input_file.suffix}"

    # Save processed image
    try:
        image.save(output_path, quality=95)
        print(f"\nProcessed image saved to: {output_path}")
        print(f"Final size: {image.size[0]}x{image.size[1]}")
    except Exception as e:
        print(f"Error saving image: {e}")
        sys.exit(1)

    return output_path


def main():
    parser = argparse.ArgumentParser(
        description="Simple Image Adjustor for Facebook posts",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python image_adjustor.py photo.jpg
  python image_adjustor.py photo.jpg -o output.jpg
  python image_adjustor.py photo.jpg -r 2 -c 1.5
        """
    )

    parser.add_argument('input', help='Input image path')
    parser.add_argument('-o', '--output', help='Output image path (optional)')
    parser.add_argument('-r', '--rotate', type=float, default=1.0,
                        help='Rotation angle in degrees (default: 1)')
    parser.add_argument('-c', '--color', type=float, default=1.3,
                        help='Color enhancement factor (default: 1.3, 1.0=no change)')

    args = parser.parse_args()

    # Validate input file
    if not os.path.exists(args.input):
        print(f"Error: Input file '{args.input}' not found.")
        sys.exit(1)

    # Process the image
    process_image(args.input, args.output, args.rotate, args.color)


if __name__ == '__main__':
    main()
