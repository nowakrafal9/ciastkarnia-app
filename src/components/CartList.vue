<template>
    <div>
      <h1>Twój Koszyk</h1>
      <ul>
        <li v-for="item in cartItems" :key="item.id">
          {{ item.name }} - {{ item.price }} PLN
          <button @click="removeItem(item.id)">Usuń</button>
        </li>
      </ul>
      <h2>Total: {{ cartTotal }} PLN</h2>
      <button @click="emptyCart">Opróżnij koszyk</button>
      <router-link to="/">
        <button>Wróć do zakupów</button>
      </router-link>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    computed: {
      ...mapGetters(['cartItems', 'cartTotal'])
    },
    methods: {
    ...mapActions(['removeFromCart', 'clearCart']),
    removeItem(cakeId) {
      this.removeFromCart(cakeId);
    },
    emptyCart() {
      this.clearCart();
    }
  }
  };
  </script>
  