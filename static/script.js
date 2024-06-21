document.addEventListener('DOMContentLoaded', async () => {
  const songListContainer = document.getElementById('song-list');

  try {
    const response = await fetch('https://songbase-on-campus.onrender.com/curated_songs');
    const songs = await response.json();
    displaySongTitles(songs);
  } catch (error) {
    console.error('Error fetching curated songs:', error);
    songListContainer.innerHTML = '<p>Failed to load songs. Please try again later.</p>';
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

function goBack() {
  document.dispatchEvent(new Event('DOMContentLoaded')); // Reload the song list
}

function processLyrics(lyrics) {
  return lyrics.replace(/\[.*?\]/g, ''); // Remove all chords from the lyrics
}

function searchSongs() {
  const query = document.getElementById('search').value.toLowerCase();
  const songTitles = document.querySelectorAll('.song-title');
  songTitles.forEach(song => {
    if (song.textContent.toLowerCase().includes(query)) {
      song.style.display = '';
    } else {
      song.style.display = 'none';
    }
  });
}
