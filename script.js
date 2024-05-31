document.addEventListener('DOMContentLoaded', async () => {
    const songListContainer = document.getElementById('song-list');
  
    try {
      const response = await fetch('http://127.0.0.1:5000/songs');
      const songs = await response.json();
  
      songs.slice(0, 10).forEach(song => { // Limiting to first 10 songs for testing
        const songElement = document.createElement('div');
        songElement.className = 'song';
        songElement.innerHTML = `
          <h2>${song.title}</h2>
          <p>${song.lyrics}</p>
        `;
        songListContainer.appendChild(songElement);
      });
    } catch (error) {
      console.error('Error fetching songs:', error);
      songListContainer.innerHTML = '<p>Failed to load songs. Please try again later.</p>';
    }
  });
  