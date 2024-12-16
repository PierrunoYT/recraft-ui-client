from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Serve static files
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Proxy routes for Recraft API
@app.route('/api/images/generations', methods=['POST'])
def generate_image():
    try:
        api_key = request.headers.get('Authorization').split(' ')[1]
        response = requests.post(
            'https://external.api.recraft.ai/v1/images/generations',
            headers={'Authorization': f'Bearer {api_key}'},
            json=request.json
        )
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/images/<action>', methods=['POST'])
def process_image(action):
    try:
        api_key = request.headers.get('Authorization').split(' ')[1]
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Create temporary file
        filename = secure_filename(file.filename)
        temp_path = os.path.join('temp', filename)
        os.makedirs('temp', exist_ok=True)
        file.save(temp_path)

        # Send file to Recraft API
        with open(temp_path, 'rb') as f:
            files = {'file': (filename, f, 'image/png')}
            response = requests.post(
                f'https://external.api.recraft.ai/v1/images/{action}',
                headers={'Authorization': f'Bearer {api_key}'},
                files=files
            )

        # Clean up temporary file
        os.remove(temp_path)
        
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/styles', methods=['POST'])
def create_style():
    try:
        api_key = request.headers.get('Authorization').split(' ')[1]
        files = {}
        
        # Handle multiple files
        for key in request.files:
            file = request.files[key]
            filename = secure_filename(file.filename)
            files[key] = (filename, file, 'image/png')

        response = requests.post(
            'https://external.api.recraft.ai/v1/styles',
            headers={'Authorization': f'Bearer {api_key}'},
            files=files,
            data={'style': request.form.get('style')}
        )
        
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create temp directory if it doesn't exist
    os.makedirs('temp', exist_ok=True)
    # Start server
    app.run(host='0.0.0.0', port=5000, debug=True)