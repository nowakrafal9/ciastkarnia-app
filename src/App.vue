<template>
  <div id="app">
    <router-link to="/">Produkty</router-link>
    <router-link v-if="userRole === 'user' || userRole === 'admin'" to="/koszyk">Koszyk</router-link>
    <router-link v-if="userRole === 'employee' || userRole === 'admin'" to="/zamowienia-pracownik">Zamówienia Pracownika</router-link>
    <router-link v-if="userRole === 'admin'" to="/ciastka-admin">Admin</router-link>
    <router-link to="/login" v-if="!user">Login</router-link>
    <button @click="logout" v-if="user">Wyloguj</button>

    <router-view></router-view>
  </div>
</template>

<script>
import { auth } from './firebase';
import { signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from './firebase';

export default {
  data() {
    return {
      user: null,
      userRole: null
    };
  },
  async created() {
    this.updateUserState();

    auth.onAuthStateChanged(() => {
      this.updateUserState();
    });
  },
  methods: {
    async updateUserState() {
      const user = auth.currentUser;
      if (user) {
        this.user = user;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          this.userRole = userDoc.data().role;
        }
      } else {
        this.user = null;
        this.userRole = null;
      }
    },
    async logout() {
      await signOut(auth);
      this.$router.push('/');
    }
  }
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
