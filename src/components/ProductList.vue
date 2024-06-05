<template>
  <div>
    <h1>Dostępne Ciastka</h1>
    <ul>
      <li v-for="cake in cakes" :key="cake.id">
        {{ cake.name }} - {{ cake.price }} PLN
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

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
  }
};
</script>
