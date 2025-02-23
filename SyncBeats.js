const songs = [
    {
        title: "Blue",
        artist: "Yung Kai",
        src: "titles/Blue-Yung-Kai.mp3",
        cover: "titles/image.png",
    },
    {
        title: "From The Start",
        artist: "Rock Version",
        src: "titles/From-The-Start.mp3",
        cover: "titles/image copy 2.png",
    },
    {
        title: "Suzume",
        artist: "mi-ka",
        src: "titles/suzume.mp3",
        cover: "titles/suzume.jpg",
    },
    {
        title: "Matsuri",
        artist: "fujii kaze",
        src: "titles/Fujii Kaze - まつり (Matsuri) (1).mp3",
        cover: "titles/image copy.png",
    }
];

let currentSongIndex = 0;
let isShuffle = false;
let isRepeat = false;

const audio = document.getElementById('audio');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const cover = document.getElementById('cover');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const progress = document.getElementById('progress');
const currentTime = document.getElementById('current-time');
const duration = document.getElementById('duration');
const volumeControl = document.getElementById('volume');
const lyricsText = document.getElementById('lyrics-text');
const playlist = document.getElementById('playlist');
const themeToggle = document.getElementById('theme-toggle');

function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = song.src;
    cover.src = song.cover;
    fetch(song.lyrics)
        .then(response => response.text())
        .then(text => lyricsText.innerText = text);
}

function playSong() {
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    cover.classList.add('rotate');
}

function pauseSong() {
    audio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    cover.classList.remove('rotate');
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }
    loadSong(songs[currentSongIndex]);
    playSong();
}

function nextSong() {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
    }
    loadSong(songs[currentSongIndex]);
    playSong();
}

function updateProgress() {
    const { duration: totalDuration, currentTime: current } = audio;
    progress.value = (current / totalDuration) * 100;
    currentTime.innerText = formatTime(current);
    duration.innerText = formatTime(totalDuration);
}



function setProgress() {
    const totalDuration = audio.duration;
    audio.currentTime = (progress.value / 100) * totalDuration;
}

function updateVolume() {
    audio.volume = volumeControl.value;
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? 'var(--primary-color)' : 'var(--text-color)';
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.style.color = isRepeat ? 'var(--primary-color)' : 'var(--text-color)';
}

function toggleTheme() {
    const body = document.body;
    body.dataset.theme = body.dataset.theme === 'light' ? 'dark' : 'light';
    themeToggle.innerHTML = body.dataset.theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

function loadPlaylist() {
    playlist.innerHTML = songs.map((song, index) => `
        <li onclick="playSongFromPlaylist(${index})">${song.title} - ${song.artist}</li>
    `).join('');
}

function playSongFromPlaylist(index) {
    currentSongIndex = index;
    loadSong(songs[currentSongIndex]);
    playSong();
}

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
audio.addEventListener('timeupdate', updateProgress);
progress.addEventListener('input', setProgress);
volumeControl.addEventListener('input', updateVolume);
themeToggle.addEventListener('click', toggleTheme);

audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
});

// Load the first song and playlist
loadSong(songs[currentSongIndex]);
loadPlaylist();


function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = song.src;
    cover.src = song.cover;

    // Extract colors from the cover image
    extractColorsFromCover(song.cover);

    // Fetch lyrics (if available)
    if (song.lyrics) {
        fetch(song.lyrics)
            .then(response => response.text())
            .then(text => lyricsText.innerText = text);
    }
}

function extractColorsFromCover(coverSrc) {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Enable CORS for external images
    img.src = coverSrc;

    img.onload = () => {
        Vibrant.from(img).getPalette((err, palette) => {
            if (err) {
                console.error("Error extracting colors:", err);
                return;
            }

            // Apply colors to UI elements
            applyColorsToUI(palette);
        });
    };
}

function applyColorsToUI(palette) {
    // Example: Use the vibrant color for the background and muted color for text
    const vibrantColor = palette.Vibrant.hex;
    const mutedColor = palette.Muted.hex;

    // Apply colors to specific elements
    document.body.style.backgroundColor = vibrantColor;
    title.style.color = mutedColor;
    artist.style.color = mutedColor;
    progress.style.backgroundColor = mutedColor;
    volumeControl.style.backgroundColor = mutedColor;

    // You can customize this further based on your design
}