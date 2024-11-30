// API Configuration
const API_BASE_URL = 'https://external.api.recraft.ai/v1';
let API_KEY = localStorage.getItem('recraftApiKey');

// Substyles Configuration
const SUBSTYLES = {
    recraftv3: {
        realistic_image: ['b_and_w', 'enterprise', 'evening_light', 'faded_nostalgia', 'forest_life', 'hard_flash', 'hdr', 'motion_blur', 'mystic_naturalism', 'natural_light', 'natural_tones', 'organic_calm', 'real_life_glow', 'retro_realism', 'retro_snapshot', 'studio_portrait', 'urban_drama', 'village_realism', 'warm_folk'],
        digital_illustration: ['2d_art_poster', '2d_art_poster_2', 'engraving_color', 'grain', 'hand_drawn', 'hand_drawn_outline', 'handmade_3d', 'infantile_sketch', 'pixel_art', 'antiquarian', 'bold_fantasy', 'child_book', 'child_books', 'cover', 'crosshatch', 'digital_engraving', 'expressionism', 'freehand_details', 'grain_20', 'graphic_intensity', 'hard_comics', 'long_shadow', 'modern_folk', 'multicolor', 'neon_calm', 'noir', 'nostalgic_pastel', 'outline_details', 'pastel_gradient', 'pastel_sketch', 'pop_art', 'pop_renaissance', 'street_art', 'tablet_sketch', 'urban_glow', 'urban_sketching', 'vanilla_dreams', 'young_adult_book', 'young_adult_book_2'],
        vector_illustration: ['bold_stroke', 'chemistry', 'colored_stencil', 'contour_pop_art', 'cosmics', 'cutout', 'depressive', 'editorial', 'emotional_flat', 'engraving', 'infographical', 'line_art', 'line_circuit', 'linocut', 'marker_outline', 'mosaic', 'naivector', 'roundish_flat', 'segmented_colors', 'sharp_contrast', 'thin', 'vector_photo', 'vivid_shapes']
    },
    recraft20b: {
        realistic_image: ['b_and_w', 'enterprise', 'hard_flash', 'hdr', 'motion_blur', 'natural_light', 'studio_portrait'],
        digital_illustration: ['2d_art_poster', '2d_art_poster_2', '3d', '80s', 'engraving_color', 'glow', 'grain', 'hand_drawn', 'hand_drawn_outline', 'handmade_3d', 'infantile_sketch', 'kawaii', 'pixel_art', 'psychedelic', 'seamless', 'voxel', 'watercolor'],
        vector_illustration: ['cartoon', 'doodle_line_art', 'engraving', 'flat_2', 'kawaii', 'line_art', 'line_circuit', 'linocut', 'seamless'],
        icon: ['broken_line', 'colored_outline', 'colored_shapes', 'colored_shapes_gradient', 'doodle_fill', 'doodle_offset_fill', 'offset_fill', 'outline', 'outline_gradient', 'uneven_fill']
    }
};

// DOM Elements
const elements = {
    apiKeyInput: document.getElementById('apiKey'),
    saveKeyBtn: document.getElementById('saveKey'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    generateBtn: document.getElementById('generateBtn'),
    vectorizeBtn: document.getElementById('vectorizeBtn'),
    removeBackgroundBtn: document.getElementById('removeBackgroundBtn'),
    upscaleBtn: document.getElementById('upscaleBtn'),
    resultImage: document.getElementById('resultImage'),
    downloadBtn: document.getElementById('downloadBtn'),
    loadingSpinner: document.querySelector('.loading-spinner'),
    errorMessage: document.querySelector('.error-message'),
    modelSelect: document.getElementById('model'),
    styleSelect: document.getElementById('style'),
    substyleSelect: document.getElementById('substyle'),
    preferredColorInput: document.getElementById('preferredColor'),
    addColorBtn: document.getElementById('addColorBtn'),
    selectedColors: document.getElementById('selectedColors'),
    backgroundColorInput: document.getElementById('backgroundColor')
};

// Selected Colors State
let selectedColors = [];

// Event Listeners
elements.saveKeyBtn.addEventListener('click', saveApiKey);
elements.tabBtns.forEach(btn => btn.addEventListener('click', switchTab));
elements.generateBtn.addEventListener('click', generateImage);
elements.vectorizeBtn.addEventListener('click', vectorizeImage);
elements.removeBackgroundBtn.addEventListener('click', removeBackground);
elements.upscaleBtn.addEventListener('click', upscaleImage);
elements.downloadBtn.addEventListener('click', downloadImage);
elements.modelSelect.addEventListener('change', updateSubstyles);
elements.styleSelect.addEventListener('change', updateSubstyles);
elements.addColorBtn.addEventListener('click', addColor);
elements.preferredColorInput.addEventListener('change', updatePreferredColorPreview);

// Style and Model Management
function updateSubstyles() {
    const model = elements.modelSelect.value;
    const style = elements.styleSelect.value;
    const substyles = SUBSTYLES[model]?.[style] || [];
    
    elements.substyleSelect.innerHTML = `
        <option value="">No substyle</option>
        ${substyles.map(substyle => `<option value="${substyle}">${substyle.replace(/_/g, ' ')}</option>`).join('')}
    `;
    
    elements.substyleSelect.classList.toggle('hidden', substyles.length === 0);
}

// Color Management
function addColor() {
    const color = elements.preferredColorInput.value;
    const rgb = hexToRgb(color);
    
    if (rgb) {
        selectedColors.push(rgb);
        updateColorChips();
    }
}

function removeColor(index) {
    selectedColors.splice(index, 1);
    updateColorChips();
}

function updateColorChips() {
    elements.selectedColors.innerHTML = selectedColors.map((rgb, index) => `
        <div class="color-chip">
            <div class="color-preview" style="background-color: rgb(${rgb.join(',')})"></div>
            <span>${rgb.join(', ')}</span>
            <button class="remove-color" onclick="removeColor(${index})">×</button>
        </div>
    `).join('');
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function updatePreferredColorPreview() {
    const color = elements.preferredColorInput.value;
    elements.preferredColorInput.style.backgroundColor = color;
}

// API Key Management
function saveApiKey() {
    const key = elements.apiKeyInput.value.trim();
    if (key) {
        API_KEY = key;
        localStorage.setItem('recraftApiKey', key);
        showMessage('API key saved successfully!', false);
    } else {
        showMessage('Please enter a valid API key', true);
    }
}

// Tab Switching
function switchTab(e) {
    const tabId = e.target.dataset.tab;
    
    elements.tabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    elements.tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    e.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// API Requests
async function makeRequest(endpoint, options) {
    if (!API_KEY) {
        throw new Error('Please enter your API key first');
    }

    const headers = {
        'Authorization': `Bearer ${API_KEY}`,
        ...options.headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Request failed');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'Request failed');
    }
}

// Image Generation
async function generateImage() {
    const prompt = document.getElementById('prompt').value;
    const model = elements.modelSelect.value;
    const style = elements.styleSelect.value;
    const substyle = elements.substyleSelect.value;
    const size = document.getElementById('size').value;
    const backgroundColor = elements.backgroundColorInput.value;
    const bgRgb = hexToRgb(backgroundColor);

    if (!prompt) {
        showMessage('Please enter a prompt', true);
        return;
    }

    showLoading(true);

    try {
        const requestBody = {
            prompt,
            model,
            style,
            size,
            n: 1,
            response_format: 'url'
        };

        // Add substyle if selected
        if (substyle) {
            requestBody.substyle = substyle;
        }

        // Add controls if colors are selected
        if (selectedColors.length > 0 || bgRgb) {
            requestBody.controls = {
                colors: selectedColors.map(rgb => ({ rgb }))
            };
            
            if (bgRgb) {
                requestBody.controls.background_color = { rgb: bgRgb };
            }
        }

        const response = await makeRequest('/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        displayResult(response.data[0].url);
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        showLoading(false);
    }
}

// Image Vectorization
async function vectorizeImage() {
    const file = document.getElementById('vectorizeFile').files[0];
    if (!file) {
        showMessage('Please select a file', true);
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    showLoading(true);

    try {
        const response = await makeRequest('/images/vectorize', {
            method: 'POST',
            body: formData
        });

        displayResult(response.image.url);
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        showLoading(false);
    }
}

// Background Removal
async function removeBackground() {
    const file = document.getElementById('bgRemovalFile').files[0];
    if (!file) {
        showMessage('Please select a file', true);
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    showLoading(true);

    try {
        const response = await makeRequest('/images/removeBackground', {
            method: 'POST',
            body: formData
        });

        displayResult(response.image.url);
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        showLoading(false);
    }
}

// Image Upscaling
async function upscaleImage() {
    const file = document.getElementById('upscaleFile').files[0];
    const type = document.getElementById('upscaleType').value;
    
    if (!file) {
        showMessage('Please select a file', true);
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    showLoading(true);

    try {
        const endpoint = type === 'clarity' ? '/images/clarityUpscale' : '/images/generativeUpscale';
        const response = await makeRequest(endpoint, {
            method: 'POST',
            body: formData
        });

        displayResult(response.image.url);
    } catch (error) {
        showMessage(error.message, true);
    } finally {
        showLoading(false);
    }
}

// UI Helpers
function showLoading(show) {
    elements.loadingSpinner.classList.toggle('hidden', !show);
    elements.errorMessage.classList.add('hidden');
}

function showMessage(message, isError) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.errorMessage.style.backgroundColor = isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)';
    elements.errorMessage.style.color = isError ? 'var(--error-color)' : 'var(--success-color)';
}

function displayResult(url) {
    elements.resultImage.src = url;
    elements.resultImage.classList.remove('hidden');
    elements.downloadBtn.classList.remove('hidden');
    elements.downloadBtn.onclick = () => downloadImage(url);
}

async function downloadImage(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'recraft-image.png';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
    } catch (error) {
        showMessage('Failed to download image', true);
    }
}

// Initialize
if (API_KEY) {
    elements.apiKeyInput.value = API_KEY;
}

// Initialize substyles
updateSubstyles();

// Initialize color input preview
updatePreferredColorPreview();