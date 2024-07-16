<template>
  <div>
    <h1>-=- F2P GAMES -=-</h1>
    <div class="search-container">
      <input type="text" v-model="search" @input="fetchGames" placeholder="Search games..." class="form-control mb-3 search-input">
    </div>
    <div class="filter-container">
      <div class="form-group">
        <select v-model="selectedGenre" @change="fetchGames" class="form-control">
          <option value="">All Genres</option>
          <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
        </select>
      </div>
      <div class="form-group">
        <select v-model="selectedPlatform" @change="fetchGames" class="form-control">
          <option value="">All Platforms</option>
          <option v-for="platform in platforms" :key="platform" :value="platform">{{ platform }}</option>
        </select>
      </div>
    </div>
    <div class="games-container">
      <div v-for="game in games" :key="game.title" class="game-card mb-4">
        <div class="card h-100">
          <img :src="game.thumbnail" class="card-img-top game-thumbnail" :alt="game.title">
          <div class="card-body">
            <h5 class="card-title">{{ game.title }}</h5>
            <p class="card-text">{{ game.short_description }}</p>
            <p class="card-text"><small class="text-muted">{{ game.genre }} | {{ game.platform }}</small></p>
            <a :href="game.game_url" class="btn btn-primary" target="_blank">PLAY NOW</a>
          </div>
        </div>
      </div>
    </div>
    <nav>
      <ul class="pagination justify-content-center">
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';
import Papa from 'papaparse';

export default {
  data() {
    return {
      games: [],
      genres: [],
      platforms: [],
      search: '',
      selectedGenre: '',
      selectedPlatform: '',
      currentPage: 1,
      perPage: 15,
      totalPages: 0,
    };
  },
  created() {
    this.fetchGames();
    this.fetchFilters();
  },
  methods: {
    async fetchGames() {
      const response = await axios.get('/data/free-to-play-games.csv');
      const csvData = response.data;
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          let games = results.data;
          games = games.filter(game =>
            (!this.search || game.title.toLowerCase().includes(this.search.toLowerCase())) &&
            (!this.selectedGenre || game.genre === this.selectedGenre) &&
            (!this.selectedPlatform || game.platform === this.selectedPlatform)
          );
          this.totalPages = Math.ceil(games.length / this.perPage);
          const start = (this.currentPage - 1) * this.perPage;
          const end = start + this.perPage;
          this.games = games.slice(start, end);
        }
      });
    },
    async fetchFilters() {
      const response = await axios.get('/data/free-to-play-games.csv');
      const csvData = response.data;
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          const allGames = results.data;
          this.genres = [...new Set(allGames.map(game => game.genre))];
          this.platforms = [...new Set(allGames.map(game => game.platform))];
        }
      });
    },
    goToPage(page) {
      this.currentPage = page;
      this.fetchGames();
    },
  },
};
</script>

<style>
h1 {
  font-family: Dubai, serif;
  font-size: 1.4rem;
  font-weight: bold;
  text-align: center;
  padding-top: 40px;
  margin: 40px auto;
}

/* General Styles */
body {
  font-family: Arial, sans-serif;
}

/* Search Container */
.search-container {
  display: flex;
  justify-content: center;
  width: 80%;
  margin: auto;
}

.search-input {
  border-radius: 10px;
  padding: 10px;
}

/* Filter Container */
.filter-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 80%;
  margin: 0 auto; /* Center the container */
  margin-bottom: 20px;
}

/* Form Group */
.filter-container .form-group {
  flex: 1;
  width: 40%;
}

/* Form Control */
.filter-container .form-group .form-control {
  width: 100%;
  border-radius: 10px;
  padding: 10px;
}

/* Game Container */
.games-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin: 0 8%;
}

/* Game Card */
.game-card {
  flex: 0 1 calc(33.333% - 20px);
  box-sizing: border-box;
}

/* Card */
.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}

/* Card Image */
.card-img-top {
  width: 100%;
  height: auto;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

/* Card Body */
.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
}

/* Card Title */
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

/* Card Text */
.card-text {
  font-size: 1rem;
  color: #666;
  margin-bottom: 10px;
}

.card-text small {
  color: #999;
}

/* Button */
.btn-primary {
  align-self: flex-start;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 0.9rem;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* Pagination */
.pagination {
  margin-top: 20px;
}

.pagination .page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.pagination .page-link {
  color: #007bff;
}

.pagination .page-link:hover {
  color: #0056b3;
}

.btn {
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
  letter-spacing: 10px;
  font-family: "Source Code Pro Black",serif;
  color: lightblue;
  text-decoration: none;
}
</style>
