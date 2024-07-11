<template>
  <div>
    <h1 class="my-4">Free-to-Play Games</h1>
    <input type="text" v-model="search" @input="fetchGames" placeholder="Search games..." class="form-control mb-3">
    <div class="form-row">
      <div class="form-group col-md-6">
        <select v-model="selectedGenre" @change="fetchGames" class="form-control">
          <option value="">All Genres</option>
          <option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
        </select>
      </div>
      <div class="form-group col-md-6">
        <select v-model="selectedPlatform" @change="fetchGames" class="form-control">
          <option value="">All Platforms</option>
          <option v-for="platform in platforms" :key="platform" :value="platform">{{ platform }}</option>
        </select>
      </div>
    </div>
    <div class="row">
      <div v-for="game in games" :key="game.title" class="col-md-4 game-card mb-3">
        <div class="card">
          <img :src="game.thumbnail" class="card-img-top game-thumbnail" :alt="game.title">
          <div class="card-body">
            <h5 class="card-title">{{ game.title }}</h5>
            <p class="card-text">{{ game.short_description }}</p>
            <p class="card-text"><small class="text-muted">{{ game.genre }} | {{ game.platform }}</small></p>
            <a :href="game.game_url" class="btn btn-primary" target="_blank">Play Now</a>
          </div>
        </div>
      </div>
    </div>
    <nav>
      <ul class="pagination">
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
      perPage: 10,
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
.game-card {
  margin-bottom: 20px;
}
.game-thumbnail {
  width: 100%;
  height: auto;
}
</style>
