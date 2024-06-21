from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import requests
# Search the words you know to show the song it relates to
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///songs.db'
db = SQLAlchemy(app)

class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    lyrics = db.Column(db.Text, nullable=False)

class CuratedSong(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey('song.id'), nullable=False)

def preload_songs():
    try:
        response = requests.get('https://songbase.life/api/v2/app_data')
        data = response.json()
        for song in data['songs']:
            new_song = Song(id=song['id'], title=song['title'], lyrics=song['lyrics'])
            db.session.add(new_song)
        db.session.commit()
    except Exception as e:
        print(f"Error preloading songs: {e}")


@app.route('/', methods=['GET'])
def home():
   return render_template('index.html')

@app.route('/songs', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    return jsonify([{'id': song.id, 'title': song.title, 'lyrics': song.lyrics} for song in songs])

@app.route('/curated_songs', methods=['GET'])
def get_curated_songs():
    curated_songs = CuratedSong.query.all()
    songs = [Song.query.get(cs.song_id) for cs in curated_songs]
    return jsonify([{'id': song.id, 'title': song.title, 'lyrics': song.lyrics} for song in songs])

@app.route('/curate_song', methods=['POST'])
def curate_song():
    data = request.json
    song_title = data.get('title')
    song = Song.query.filter_by(title=song_title).first()
    if song:
        curated_song = CuratedSong(song_id=song.id)
        db.session.add(curated_song)
        db.session.commit()
        return jsonify({'message': 'Song added to curated list.'}), 201
    else:
        return jsonify({'message': 'Song not found.'}), 404

@app.route('/admin', methods=['GET'])
def admin():
   return render_template('admin.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not Song.query.first():  # Preload songs if the database is empty
            preload_songs()
    app.run(debug=True)
