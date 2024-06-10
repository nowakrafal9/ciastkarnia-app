<template>
    <div>
      <h1>Logowanie</h1>
      <form @submit.prevent="login">
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required>
        </div>
        <div>
          <label for="password">Hasło:</label>
          <input type="password" v-model="password" required>
        </div>
        <button type="submit">Zaloguj</button>
      </form>
      <button @click="register">Zarejestruj</button>
    </div>
  </template>
  
  <script>
  import { auth } from '@/firebase';
  import { signInWithEmailAndPassword } from "firebase/auth";
  
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      async login() {
        try {
          await signInWithEmailAndPassword(auth, this.email, this.password);
          this.$router.push('/');
        } catch (error) {
          alert(error.message);
        }
      },
      async register() {
        try {
          this.$router.push('/register');
        } catch (error) {
          alert(error.message);
        }
      }
    }
  };
  </script>
  