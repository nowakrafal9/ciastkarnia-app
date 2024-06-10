<template>
    <Header />
    <main>
      <router-view></router-view>
    </main>
</template>

<script>
import Header from './components/html-fragments/HeaderFragment.vue';

export default {
  components: {
    Header,
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: #f4f1e0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 2rem;
  background-color: #fff;
}

button {
  background-color: #d2b48c;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #c3a384;
}

.no-select {
    user-select: none; /* Standard CSS3 */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
}
</style>
