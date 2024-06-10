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
  margin: 1rem 1rem 0;
  font-family: 'Arial', sans-serif;
  background-color: rgb(255, 240, 213);
}

main {
  margin-top: 1rem;
  padding: 1rem;
  flex: 1;
  background-color: rgb(253, 223, 166);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  min-height: 80vh;
}

.no-select {
    user-select: none; /* Standard CSS3 */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
}
</style>
