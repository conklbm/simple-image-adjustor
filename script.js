// Global variables
let originalImage = null;
let currentImage = null;
let watermarkImage = null;
let canvas = null;
let ctx = null;

// Crop variables
let isCropping = false;
let cropStartX = 0;
let cropStartY = 0;
let cropWidth = 0;
let cropHeight = 0;
let isDragging = false;
let isResizing = false;
let resizeHandle = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    setupEventListeners();
});

function setupEventListeners() {
    // Image upload
    document.getElementById('imageInput').addEventListener('change', handleImageUpload);

    // Watermark upload
    document.getElementById('watermarkInput').addEventListener('change', handleWatermarkUpload);
    document.getElementById('removeWatermarkBtn').addEventListener('click', removeWatermark);

    // Crop controls
    document.getElementById('enableCropBtn').addEventListener('click', enableCrop);
    document.getElementById('applyCropBtn').addEventListener('click', applyCrop);
    document.getElementById('cancelCropBtn').addEventListener('click', cancelCrop);

    // Slider updates
    document.getElementById('colorEnhancement').addEventListener('input', (e) => {
        document.getElementById('colorValue').textContent = e.target.value;
    });

    document.getElementById('rotationAngle').addEventListener('input', (e) => {
        document.getElementById('rotationValue').textContent = e.target.value;
    });

    document.getElementById('watermarkOpacity').addEventListener('input', (e) => {
        document.getElementById('opacityValue').textContent = e.target.value;
    });

    document.getElementById('watermarkSize').addEventListener('input', (e) => {
        document.getElementById('watermarkSizeValue').textContent = e.target.value;
    });

    // Action buttons
    document.getElementById('previewBtn').addEventListener('click', previewChanges);
    document.getElementById('downloadBtn').addEventListener('click', downloadImage);
    document.getElementById('resetBtn').addEventListener('click', resetToOriginal);
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            originalImage = img;
            currentImage = img;
            displayImage(img);
            document.getElementById('editorSection').style.display = 'grid';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function handleWatermarkUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            watermarkImage = img;
            document.getElementById('watermarkName').textContent = file.name;
            document.getElementById('watermarkControls').style.display = 'block';
            document.getElementById('removeWatermarkBtn').style.display = 'inline-block';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function removeWatermark() {
    watermarkImage = null;
    document.getElementById('watermarkName').textContent = '';
    document.getElementById('watermarkControls').style.display = 'none';
    document.getElementById('removeWatermarkBtn').style.display = 'none';
    document.getElementById('watermarkInput').value = '';
}

function displayImage(img) {
    // Calculate display size while maintaining aspect ratio
    const maxWidth = 800;
    const maxHeight = 700;
    let width = img.width;
    let height = img.height;

    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
}

// Crop functionality
function enableCrop() {
    isCropping = true;
    const overlay = document.getElementById('cropOverlay');
    const cropBox = document.getElementById('cropBox');

    overlay.style.display = 'block';
    document.getElementById('enableCropBtn').style.display = 'none';
    document.getElementById('applyCropBtn').style.display = 'block';
    document.getElementById('cancelCropBtn').style.display = 'block';

    // Initialize crop box in center
    const canvasRect = canvas.getBoundingClientRect();
    cropWidth = canvasRect.width * 0.6;
    cropHeight = canvasRect.height * 0.6;
    cropStartX = (canvasRect.width - cropWidth) / 2;
    cropStartY = (canvasRect.height - cropHeight) / 2;

    updateCropBox();

    // Add event listeners for crop interaction
    overlay.addEventListener('mousedown', startCropDrag);
    overlay.addEventListener('mousemove', doCropDrag);
    overlay.addEventListener('mouseup', endCropDrag);
}

function updateCropBox() {
    const cropBox = document.getElementById('cropBox');
    cropBox.style.left = cropStartX + 'px';
    cropBox.style.top = cropStartY + 'px';
    cropBox.style.width = cropWidth + 'px';
    cropBox.style.height = cropHeight + 'px';
}

function startCropDrag(e) {
    const cropBox = document.getElementById('cropBox');
    const rect = cropBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a handle
    const handles = cropBox.querySelectorAll('.crop-handle');
    let clickedHandle = null;

    handles.forEach(handle => {
        const handleRect = handle.getBoundingClientRect();
        if (e.clientX >= handleRect.left && e.clientX <= handleRect.right &&
            e.clientY >= handleRect.top && e.clientY <= handleRect.bottom) {
            clickedHandle = handle;
        }
    });

    if (clickedHandle) {
        isResizing = true;
        resizeHandle = clickedHandle.className.split(' ')[1];
    } else if (x >= 0 && x <= cropWidth && y >= 0 && y <= cropHeight) {
        isDragging = true;
    }

    cropStartX = e.clientX - document.getElementById('cropOverlay').getBoundingClientRect().left;
    cropStartY = e.clientY - document.getElementById('cropOverlay').getBoundingClientRect().top;
}

function doCropDrag(e) {
    if (!isDragging && !isResizing) return;

    const overlay = document.getElementById('cropOverlay');
    const overlayRect = overlay.getBoundingClientRect();
    const x = e.clientX - overlayRect.left;
    const y = e.clientY - overlayRect.top;

    if (isDragging) {
        const cropBox = document.getElementById('cropBox');
        const rect = cropBox.getBoundingClientRect();
        const deltaX = x - cropStartX;
        const deltaY = y - cropStartY;

        cropStartX = x;
        cropStartY = y;

        let newX = parseFloat(cropBox.style.left) + deltaX;
        let newY = parseFloat(cropBox.style.top) + deltaY;

        // Constrain to canvas bounds
        newX = Math.max(0, Math.min(newX, overlayRect.width - cropWidth));
        newY = Math.max(0, Math.min(newY, overlayRect.height - cropHeight));

        cropBox.style.left = newX + 'px';
        cropBox.style.top = newY + 'px';
    } else if (isResizing) {
        const cropBox = document.getElementById('cropBox');
        const currentLeft = parseFloat(cropBox.style.left);
        const currentTop = parseFloat(cropBox.style.top);

        if (resizeHandle === 'se') {
            cropWidth = Math.max(50, x - currentLeft);
            cropHeight = Math.max(50, y - currentTop);
        } else if (resizeHandle === 'sw') {
            const newWidth = Math.max(50, currentLeft + cropWidth - x);
            cropStartX = x;
            cropBox.style.left = x + 'px';
            cropWidth = newWidth;
            cropHeight = Math.max(50, y - currentTop);
        } else if (resizeHandle === 'ne') {
            cropWidth = Math.max(50, x - currentLeft);
            const newHeight = Math.max(50, currentTop + cropHeight - y);
            cropStartY = y;
            cropBox.style.top = y + 'px';
            cropHeight = newHeight;
        } else if (resizeHandle === 'nw') {
            const newWidth = Math.max(50, currentLeft + cropWidth - x);
            const newHeight = Math.max(50, currentTop + cropHeight - y);
            cropStartX = x;
            cropStartY = y;
            cropBox.style.left = x + 'px';
            cropBox.style.top = y + 'px';
            cropWidth = newWidth;
            cropHeight = newHeight;
        }

        cropBox.style.width = cropWidth + 'px';
        cropBox.style.height = cropHeight + 'px';
    }
}

function endCropDrag() {
    isDragging = false;
    isResizing = false;
    resizeHandle = null;
}

function applyCrop() {
    const cropBox = document.getElementById('cropBox');
    const canvasRect = canvas.getBoundingClientRect();

    // Calculate crop coordinates relative to actual canvas size
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    const x = parseFloat(cropBox.style.left) * scaleX;
    const y = parseFloat(cropBox.style.top) * scaleY;
    const w = cropWidth * scaleX;
    const h = cropHeight * scaleY;

    // Create a temporary canvas for cropping
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw cropped portion
    tempCtx.drawImage(canvas, x, y, w, h, 0, 0, w, h);

    // Update current image
    const croppedImage = new Image();
    croppedImage.onload = () => {
        currentImage = croppedImage;
        displayImage(croppedImage);
        cancelCrop();
    };
    croppedImage.src = tempCanvas.toDataURL();
}

function cancelCrop() {
    isCropping = false;
    document.getElementById('cropOverlay').style.display = 'none';
    document.getElementById('enableCropBtn').style.display = 'block';
    document.getElementById('applyCropBtn').style.display = 'none';
    document.getElementById('cancelCropBtn').style.display = 'none';

    // Remove event listeners
    const overlay = document.getElementById('cropOverlay');
    overlay.removeEventListener('mousedown', startCropDrag);
    overlay.removeEventListener('mousemove', doCropDrag);
    overlay.removeEventListener('mouseup', endCropDrag);
}

function previewChanges() {
    if (!currentImage) return;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Get settings
    const colorFactor = parseFloat(document.getElementById('colorEnhancement').value);
    const rotation = parseFloat(document.getElementById('rotationAngle').value);
    const fbSize = document.getElementById('facebookSize').value;

    // Get Facebook dimensions
    let targetWidth, targetHeight;
    if (fbSize === 'square') {
        targetWidth = targetHeight = 1080;
    } else if (fbSize === 'portrait') {
        targetWidth = 1080;
        targetHeight = 1350;
    } else { // landscape
        targetWidth = 1080;
        targetHeight = 566;
    }

    // Set canvas to Facebook size
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;

    // Fill with white background
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, targetWidth, targetHeight);

    // Calculate scaling to fit within Facebook size while maintaining aspect ratio
    const scale = Math.min(targetWidth / currentImage.width, targetHeight / currentImage.height);
    const scaledWidth = currentImage.width * scale;
    const scaledHeight = currentImage.height * scale;

    // Center the image
    const x = (targetWidth - scaledWidth) / 2;
    const y = (targetHeight - scaledHeight) / 2;

    // Apply rotation
    tempCtx.save();
    tempCtx.translate(targetWidth / 2, targetHeight / 2);
    tempCtx.rotate((rotation * Math.PI) / 180);
    tempCtx.translate(-targetWidth / 2, -targetHeight / 2);

    // Draw image
    tempCtx.drawImage(currentImage, x, y, scaledWidth, scaledHeight);
    tempCtx.restore();

    // Apply color enhancement
    if (colorFactor !== 1.0) {
        const imageData = tempCtx.getImageData(0, 0, targetWidth, targetHeight);
        enhanceColors(imageData, colorFactor);
        tempCtx.putImageData(imageData, 0, 0);
    }

    // Apply watermark if present
    if (watermarkImage) {
        const opacity = parseFloat(document.getElementById('watermarkOpacity').value) / 100;
        const wmSize = parseFloat(document.getElementById('watermarkSize').value) / 100;
        const position = document.getElementById('watermarkPosition').value;

        const wmWidth = targetWidth * wmSize;
        const wmHeight = (watermarkImage.height / watermarkImage.width) * wmWidth;

        let wmX, wmY;
        const padding = 20;

        switch (position) {
            case 'bottom-right':
                wmX = targetWidth - wmWidth - padding;
                wmY = targetHeight - wmHeight - padding;
                break;
            case 'bottom-left':
                wmX = padding;
                wmY = targetHeight - wmHeight - padding;
                break;
            case 'top-right':
                wmX = targetWidth - wmWidth - padding;
                wmY = padding;
                break;
            case 'top-left':
                wmX = padding;
                wmY = padding;
                break;
            case 'center':
                wmX = (targetWidth - wmWidth) / 2;
                wmY = (targetHeight - wmHeight) / 2;
                break;
        }

        tempCtx.globalAlpha = opacity;
        tempCtx.drawImage(watermarkImage, wmX, wmY, wmWidth, wmHeight);
        tempCtx.globalAlpha = 1.0;
    }

    // Display preview
    canvas.width = Math.min(800, targetWidth);
    canvas.height = (canvas.width / targetWidth) * targetHeight;
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
}

function enhanceColors(imageData, factor) {
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Convert to HSL
        const max = Math.max(r, g, b) / 255;
        const min = Math.min(r, g, b) / 255;
        const l = (max + min) / 2;

        if (max === min) continue; // grayscale, no saturation to enhance

        const d = max - min;
        let s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        // Enhance saturation
        s = Math.min(1, s * factor);

        // Convert back to RGB
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((max === r ? (g - b) / d : max === g ? 2 + (b - r) / d : 4 + (r - g) / d) % 6) - 3));
        const m = l - c / 2;

        let rNew, gNew, bNew;

        if (max === r) {
            rNew = c;
            gNew = x;
            bNew = 0;
        } else if (max === g) {
            rNew = x;
            gNew = c;
            bNew = 0;
        } else {
            rNew = 0;
            gNew = x;
            bNew = c;
        }

        if (max === r && g >= b) {
            rNew = c; gNew = x; bNew = 0;
        } else if (max === r && g < b) {
            rNew = c; gNew = 0; bNew = x;
        } else if (max === g && b >= r) {
            rNew = 0; gNew = c; bNew = x;
        } else if (max === g && b < r) {
            rNew = x; gNew = c; bNew = 0;
        } else if (max === b && r >= g) {
            rNew = x; gNew = 0; bNew = c;
        } else {
            rNew = 0; gNew = x; bNew = c;
        }

        data[i] = Math.round((rNew + m) * 255);
        data[i + 1] = Math.round((gNew + m) * 255);
        data[i + 2] = Math.round((bNew + m) * 255);
    }
}

function downloadImage() {
    // Generate the final image with all settings
    previewChanges();

    // Create download link
    const link = document.createElement('a');
    link.download = 'facebook-image.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
}

function resetToOriginal() {
    if (!originalImage) return;

    currentImage = originalImage;
    displayImage(originalImage);

    // Reset controls
    document.getElementById('colorEnhancement').value = 1.3;
    document.getElementById('colorValue').textContent = '1.3';
    document.getElementById('rotationAngle').value = 0.5;
    document.getElementById('rotationValue').textContent = '0.5';
    document.getElementById('facebookSize').value = 'square';
}
