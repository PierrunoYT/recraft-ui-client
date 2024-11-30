// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let API_KEY = localStorage.getItem('recraftApiKey');

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
    errorMessage: document.querySelector('.error-message')
};

// Event Listeners
elements.saveKeyBtn.addEventListener('click', saveApiKey);
elements.tabBtns.forEach(btn => btn.addEventListener('click', switchTab));
elements.generateBtn.addEventListener('click', generateImage);
elements.vectorizeBtn.addEventListener('click', vectorizeImage);
elements.removeBackgroundBtn.addEventListener('click', removeBackground);
elements.upscaleBtn.addEventListener('click', upscaleImage);
elements.downloadBtn.addEventListener('click', downloadImage);

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
    const style = document.getElementById('style').value;
    const size = document.getElementById('size').value;

    if (!prompt) {
        showMessage('Please enter a prompt', true);
        return;
    }

    showLoading(true);

    try {
        const response = await makeRequest('/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                style,
                size
            })
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