<template>
  <div id="app">
    <router-link to="/">Produkty</router-link>
    <router-link to="/koszyk">Koszyk</router-link>
    <router-link to="/zamowienia-pracownik">Zamówienia Pracownika</router-link>
    <router-link to="/ciastka-admin">Admin</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
