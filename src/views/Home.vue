<template>
  <GameList />
  <footer>
      <p>&copy; 2024 Dun Central. All rights reserved.</p>
  </footer>
</template>

<script>
import GameList from '@/components/GameList.vue';

export default {
  name: 'Home',
  components: {
    GameList,
  },
};
</script>

<style>
body {
  background: black;
}
</style>

<style scoped>
footer {
  width: 80%;
  margin: auto;
  text-align: center;
  font-weight: bold;
  font-size: 0.8rem;
}
</style>
