# Recraft UI

A modern web interface for the Recraft AI Image Generation API. This application provides a user-friendly interface to interact with Recraft's powerful image generation and manipulation capabilities.

![Recraft UI Screenshot](Images/Screenshot%202024-12-01%20at%2016-47-46%20Recraft%20Image%20Generator.png)

## Features

- Image Generation with customizable styles and sizes
- Vector Image Conversion
- Background Removal
- Image Upscaling (Clarity & Generative)
- Custom Style Creation
- Local API key storage
- Direct image download

## Requirements

- Python 3.7+
- Flask
- Modern web browser
- Recraft API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/PierrunoYT/recraft-ui-client.git
cd recraft-ui-client
```

2. Install Python dependencies:
```bash
pip install flask flask-cors requests werkzeug
```

## Usage

1. Start the server:
```bash
python server.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

3. Enter your Recraft API key in the input field and click "Save Key"

4. Use the different tabs to access various features:
   - **Generate Image**: Create images from text prompts
   - **Vectorize**: Convert raster images to vector format
   - **Remove Background**: Remove image backgrounds
   - **Upscale**: Enhance image quality using AI

## API Features

### Image Generation
- Text-to-image generation
- Multiple style options (Digital Illustration, Realistic Image)
- Customizable image sizes

### Image Vectorization
- Convert PNG images to vector format
- Maintains image quality and details

### Background Removal
- Clean background removal from images
- Supports PNG format

### Image Upscaling
Two upscaling options:
1. **Clarity Upscale**: Enhance sharpness and clarity
2. **Generative Upscale**: AI-powered detail enhancement

## Development

The application is built with:
- Backend: Flask (Python)
- Frontend: Vanilla JavaScript
- Styling: Custom CSS

### Project Structure
```
recraft-ui-client/
├── server.py          # Flask backend server
├── app.js            # Frontend JavaScript
├── index.html        # Main HTML file
├── styles.css        # CSS styles
├── Images/           # Screenshot and image assets
└── README.md         # Documentation
```

### API Endpoints

The server provides the following endpoints:

- `POST /api/images/generations` - Generate images
- `POST /api/images/vectorize` - Vectorize images
- `POST /api/images/removeBackground` - Remove image backgrounds
- `POST /api/images/clarityUpscale` - Enhance image clarity
- `POST /api/images/generativeUpscale` - AI upscaling
- `POST /api/styles` - Create custom styles

## Security

- API keys are stored locally in the browser
- Secure file handling with `werkzeug.utils.secure_filename`
- Temporary file cleanup after processing
- CORS enabled for API requests

## Error Handling

The application includes comprehensive error handling:
- API key validation
- File upload validation
- Request error handling
- User-friendly error messages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Copyright (c) 2024 PierrunoYT.

## Acknowledgments

- [Recraft AI](https://recraft.ai) for providing the image generation API
- Flask team for the excellent web framework
- Contributors and users of this project

---
Last updated: December 16, 2024