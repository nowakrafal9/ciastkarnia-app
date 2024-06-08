<template>
    <div>
      <h1>Potwierdzenie Zamówienia</h1>
      <div>
        <label for="order-date">Wybierz datę zamówienia:</label>
        <DatePicker v-model="orderDate" />
      </div>
      <h2>Twoje Zamówienie:</h2>
      <ul>
        <li v-for="item in cartItems" :key="item.id">
          {{ item.name }} - {{ item.price }} PLN
        </li>
      </ul>
      <h3>Total: {{ cartTotal }} PLN</h3>
      <button @click="confirmOrder">Potwierdź Zamówienie</button>
      <router-link to="/">
        <button>Anuluj</button>
      </router-link>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  import { db, auth } from '../firebase';
  import { collection, addDoc } from 'firebase/firestore';
  import DatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  
  export default {
    components: {
      DatePicker
    },
    data() {
      return {
        orderDate: null
      };
    },
    computed: {
      ...mapGetters(['cartItems', 'cartTotal'])
    },
    methods: {
      async confirmOrder() {
        if (!this.orderDate) {
          alert('Proszę wybrać datę zamówienia.');
          return;
        }
        
        if (this.cartItems.length === 0) {
            alert('Koszyk jest pusty. Dodaj produkty do koszyka przed potwierdzeniem zamówienia.');
            return;
        }

        const userId = auth.currentUser.uid;

        const order = {
          date: this.orderDate,
          items: this.cartItems,
          total: this.cartTotal,
          userId: userId
        };
  
        try {
          await addDoc(collection(db, 'orders'), order);
          alert('Zamówienie zostało złożone pomyślnie.');
          this.$store.dispatch('clearCart');
          this.$router.push('/');
        } catch (error) {
          console.error('Błąd podczas składania zamówienia: ', error);
          alert('Wystąpił błąd podczas składania zamówienia. Proszę spróbować ponownie.');
        }
      }
    }
  };
  </script>
  