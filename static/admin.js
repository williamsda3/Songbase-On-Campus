let songs = [];
document.addEventListener('DOMContentLoaded', async () => {
    const songListContainer = document.getElementById('song-list');
  
    try {
      const response = await fetch('https://songbase-on-campus.onrender.com/songs');
      songs = await response.json();
      displaySongTitles(songs);
    } catch (error) {
      console.error('Error fetching curated songs:', error);
      songListContainer.innerHTML = '<p>Failed to load songs. Please try again later.</p>';
    }
  });
  
document.getElementById('curate-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('song-title').value;
    try {
      const response = await fetch('https://songbase-on-campus.onrender.com/curate_song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });
      const data = await response.json();
      alert("added song to list!");
      document.getElementById('message').textContent = data.message;
    } catch (error) {
      document.getElementById('message').textContent = 'Error adding song to curated list.';
    }
  });

  document.getElementById('remove-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('remove-title').value;
    try {
      const response = await fetch('https://songbase-on-campus.onrender.com/remove_curated_song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });
      const data = await response.json();
      document.getElementById('message').textContent = data.message;
    } catch (error) {
      document.getElementById('message').textContent = 'Error removing song from curated list.';
    }
  });

  function displaySongTitles(songs) {
    const songListContainer = document.getElementById('song-list');
    songListContainer.innerHTML = '';
  
    songs.forEach(song => {
      const songElement = document.createElement('div');
      songElement.className = 'song-title';
      songElement.textContent = song.title;
      songElement.addEventListener('click', () => displaySongLyrics(song));
      songListContainer.appendChild(songElement);
    });
  }
  
  function displaySongLyrics(song) {
    const songListContainer = document.getElementById('song-list');
    songListContainer.innerHTML = ''; // Clear the list
  
    const songElement = document.createElement('div');
    songElement.className = 'song-lyrics';
    songElement.innerHTML = `
      <h2>${song.title}</h2>
      <p>${processLyrics(song.lyrics)}</p>
      <button onclick="goBack()">Back to list</button>
    `;
    songListContainer.appendChild(songElement);
  }
  
  // 'Back to list' button works - but takes a while to load.
  function goBack() {
    document.dispatchEvent(new Event('DOMContentLoaded')); // Reload the song list
  }
  
  function processLyrics(lyrics) {
    return lyrics.replace(/\[.*?\]/g, ''); // Remove all chords from the lyrics
  }
  
  function searchSongs() {
    const query = document.getElementById('song-title').value.toLowerCase();
    const filteredSongs = songs.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.lyrics.toLowerCase().includes(query)
      );
      displaySongTitles(filteredSongs);
    }
  