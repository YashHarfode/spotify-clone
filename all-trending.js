// all-trending.js
const trendingContainer = document.getElementById("trendingSongs");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const trendingURL = "./spotify-data/trending-songs.json";

let allSongs = [];

function renderTrendingCards(songs) {
  trendingContainer.innerHTML = "";
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
    card.querySelector(".play-btn").addEventListener("click", function () {
      // ✅ You must define playThisSong() in main.js or here
      playThisSong(this.dataset);
    });
    trendingContainer.appendChild(card);
  });
}

function handleSearch() {
  const query = searchInput.value.toLowerCase();
  const filtered = allSongs.filter(song =>
    song.title.toLowerCase().includes(query)
  );
  renderTrendingCards(filtered);
}

async function loadTrendingSongs() {
  try {
    const res = await fetch(trendingURL);
    allSongs = await res.json();
    renderTrendingCards(allSongs);
  } catch (err) {
    console.error("Error loading songs:", err);
  }
}

// INIT
document.addEventListener("DOMContentLoaded", () => {
  loadTrendingSongs();
  searchInput.addEventListener("input", handleSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });
  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch);
  }
});
