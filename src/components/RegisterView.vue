<template>
    <div>
      <h1>Rejestracja</h1>
      <form @submit.prevent="register">
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="email" required>
        </div>
        <div>
          <label for="password">Hasło:</label>
          <input type="password" v-model="password" required>
        </div>
        <div>
          <label for="role">Rola:</label>
          <select v-model="role" required>
            <option value="user">Użytkownik</option>
            <option value="employee">Pracownik</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  </template>
  
  <script>
  import { auth, db } from '../firebase';
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { collection, doc, setDoc } from "firebase/firestore"; 
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        role: 'user'
      };
    },
    methods: {
      async register() {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
          const user = userCredential.user;
          await setDoc(doc(collection(db, "users"), user.uid), {
            email: this.email,
            role: this.role
          });
          this.$router.push('/');
        } catch (error) {
          alert(error.message);
        }
      }
    }
  };
  </script>
  