<template>
  <div>
    <h1>Dostępne Ciastka</h1>
    <ul>
      <li v-for="cake in cakes" :key="cake.id">
        {{ cake.name }} - {{ cake.price }} PLN
        <button @click="addCake(cake)">Dodaj do koszyka</button>
      </li>
    </ul>
    <router-link to="/koszyk">
      <button>Zobacz koszyk</button>
    </router-link>
  </div>
</template>

<script>
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      cakes: []
    };
  },
  async created() {
    const querySnapshot = await getDocs(collection(db, 'cakes'));
    this.cakes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },
  methods: {
    ...mapActions(['addToCart']),
    addCake(cake) {
      this.addToCart(cake);
    }
  }
};
</script>
