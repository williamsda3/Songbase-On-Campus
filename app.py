from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route('/songs', methods=['GET'])
def get_songs():
    try:
        response = requests.get('https://songbase.life/api/v2/app_data')
        data = response.json()
        songs = data['songs']
        return jsonify(songs)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
