// 🔗 DOM Elements
const trendingContainer = document.getElementById("trendingSongs");

const audio = document.getElementById("audio");
const playerCover = document.getElementById("playerCover");
const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");

const playPauseBtn = document.getElementById("playPauseBtn");
const playPauseIcon = document.getElementById("playPauseIcon");
const progressBar = document.getElementById("progressBar");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeBar = document.getElementById("volumeBar");

const muteBtn = document.getElementById("muteBtn");
const muteIcon = document.getElementById("muteIcon");


const popularArtistsURL = "./spotify-data/popular-artists.json";
const artistsContainer = document.getElementById("popularArtists");

document.getElementById("musicPlayer").classList.add("show");


// 📁 Local JSON file path
const trendingURL = "./spotify-data/trending-songs.json";

// 🧠 Load & Render Trending Songs
async function loadTrendingSongs() {
    try {
        const songs = await fetch(trendingURL).then(res => res.json());

        songs.forEach(song => {
            const card = document.createElement("div");
            card.classList.add("song-card");

            card.innerHTML = `
        <div class="card-img-container">
          <img src="${song.cover}" alt="${song.title}" />
          <button class="play-btn" 
                  data-audio="${song.audio}"
                  data-title="${song.title}"
                  data-artist="${song.artist}"
                  data-cover="${song.cover}">
            <div class="play-icon"></div>
          </button>
        </div>
        <h4 class="song-title">${song.title}</h4>
        <p class="artist-name">${song.artist}</p>
      `;

            // 🔊 Play Button Click Logic
            // Remove hidden class on first play
            card.querySelector(".play-btn").addEventListener("click", function () {
                audio.src = this.dataset.audio;
                playerCover.src = this.dataset.cover;
                playerTitle.textContent = this.dataset.title;
                playerArtist.textContent = this.dataset.artist;

                // ✅ Show the player
                document.getElementById("musicPlayer").classList.remove("hidden");

                audio.play();
                playPauseIcon.src = "./svgs/pause.svg";
                isPlaying = true;
            });



            trendingContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Failed to load trending songs:", err);
    }
}

loadTrendingSongs();

// ▶️ Custom Play / Pause Toggle

let isPlaying = false;


playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
        audio.pause();
        playPauseIcon.src = "./svgs/play.svg";
        isPlaying = false;
    } else {
        audio.play();
        playPauseIcon.src = "./svgs/pause.svg";
        isPlaying = true;
    }
});


// 📶 Progress Bar (Live Update)
audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress || 0;
});

// 🧭 Seek Through Progress Bar
progressBar.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// 🔁 On Song End → Show Play Icon
audio.addEventListener("ended", () => {
    playPauseIcon.src = "./svgs/play.svg";
});

audio.addEventListener("ended", () => {
    playPauseIcon.src = "./svgs/play.svg";
    isPlaying = false;
});


// Time formatting helper
function formatTime(seconds) {
    const min = Math.floor(seconds / 60) || 0;
    const sec = Math.floor(seconds % 60) || 0;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

// Update time + progress
audio.addEventListener("timeupdate", () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
});

// Seek through song
progressBar.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// Volume control
volumeBar.addEventListener("input", () => {
    audio.volume = volumeBar.value;
});

// Mute / Unmute Button
muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteIcon.src = audio.muted ? "./svgs/mute.svg" : "./svgs/volume.svg";
});

async function loadPopularArtists() {
    try {
        const artists = await fetch(popularArtistsURL).then(res => res.json());

        artists.forEach(artist => {
            const card = document.createElement("div");
            card.classList.add("song-card");
            card.innerHTML = `
        <div class="card-img-container">
          <img src="${artist.image}" alt="${artist.name}" />
        </div>
        <h4 class="song-title">${artist.name}</h4>
      `;
            artistsContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Failed to load popular artists:", err);
    }
}

loadPopularArtists();



// Previous and Next Button Logic

let currentIndex = 0;
let allSongs = [];

async function loadTrendingSongs() {
    try {
        allSongs = await fetch(trendingURL).then(res => res.json());

        allSongs.forEach((song, index) => {
            const card = document.createElement("div");
            card.classList.add("song-card");

            card.innerHTML = `
        <div class="card-img-container">
          <img src="${song.cover}" alt="${song.title}" />
          <button class="play-btn" 
                  data-index="${index}"
                  data-audio="${song.audio}"
                  data-title="${song.title}"
                  data-artist="${song.artist}"
                  data-cover="${song.cover}">
            <div class="play-icon"></div>
          </button>
        </div>
        <h4 class="song-title">${song.title}</h4>
        <p class="artist-name">${song.artist}</p>
      `;

            card.querySelector(".play-btn").addEventListener("click", function () {
                currentIndex = parseInt(this.dataset.index);
                playSong(allSongs[currentIndex]);
            });

            trendingContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Failed to load trending songs:", err);
    }
}

function playSong(song) {
    audio.src = song.audio;
    playerCover.src = song.cover;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    audio.play();
    document.getElementById("musicPlayer").classList.remove("hidden");
    playPauseIcon.src = "./svgs/pause.svg";
    isPlaying = true;
}

// Next/Prev Buttons
document.getElementById("nextBtn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % allSongs.length;
    playSong(allSongs[currentIndex]);
});

document.getElementById("prevBtn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + allSongs.length) % allSongs.length;
    playSong(allSongs[currentIndex]);
});


// Repeat Button and Shuffle Button

let isRepeat = false;
let isShuffle = false;

document.getElementById("repeatBtn").addEventListener("click", () => {
  isRepeat = !isRepeat;
  showToast("Repeat: " + (isRepeat ? "On 🔁" : "Off"));
});

document.getElementById("shuffleBtn").addEventListener("click", () => {
  isShuffle = !isShuffle;
  showToast("Shuffle: " + (isShuffle ? "On 🔀" : "Off"));
});


audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play().then(() => {
      playPauseIcon.src = "./svgs/pause.svg";
    });
    return;
  }

  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * allSongs.length);
    playSong(allSongs[currentIndex]);
    return;
  }

  playPauseIcon.src = "./svgs/play.svg";
  isPlaying = false;
});


audio.play().then(() => {
  playPauseIcon.src = "./svgs/pause.svg";
  isPlaying = true;
});



// Popular Artists – Circular UI + Play Button
card.innerHTML = `
  <div class="artist-img-container">
    <img src="${artist.image}" alt="${artist.name}" />
    <button class="artist-play-btn"
      data-audio="${artist.audio}"
      data-cover="${artist.image}"
      data-title="${artist.name} Song"
      data-artist="${artist.name}">
      <img src="./svgs/play.svg" />
    </button>
  </div>
  <h4 class="song-title">${artist.name}</h4>
`;



// Artist Play Button Logic

card.querySelector(".artist-play-btn").addEventListener("click", function () {
  audio.src = this.dataset.audio;
  playerCover.src = this.dataset.cover;
  playerTitle.textContent = this.dataset.title;
  playerArtist.textContent = this.dataset.artist;

  document.getElementById("musicPlayer").classList.remove("hidden");
  playPauseIcon.src = "./svgs/pause.svg";
  isPlaying = true;
  audio.play();
});


//Toast

function showToast(msg) {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}


