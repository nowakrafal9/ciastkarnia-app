<template>
  <div>
    <h1>Dostępne Ciastka</h1>
    <ul>
      <li v-for="cake in cakes" :key="cake.id">
        {{ cake.name }} - {{ cake.price }} PLN
        <button v-if="userRole === 'user'" @click="addToCart(cake)">Dodaj do koszyka</button>
      </li> 
    </ul>
  </div>
</template>

<script>
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { mapActions } from 'vuex';
import { auth } from '../firebase';
import { getDoc, doc } from "firebase/firestore";

export default {
  data() {
    return {
      cakes: [],
      userRole: null
    };
  },
  async created() {
    await this.fetchCakes();
    this.setUserRole();

    auth.onAuthStateChanged(() => {
      this.setUserRole();
    });
  },
  methods: {
    async fetchCakes() {
      const querySnapshot = await getDocs(collection(db, 'cakes'));
      this.cakes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
    async setUserRole() {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          this.userRole = userDoc.data().role;
        }
      } else {
        this.userRole = null;
      }
    },
    ...mapActions(['addToCart']),
    addCake(cake) {
      this.addToCart(cake);
    }
  }
};
</script>