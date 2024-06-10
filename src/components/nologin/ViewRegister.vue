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
        <label for="firstName">Imię:</label>
        <input type="text" v-model="firstName" required>
        </div>
        <div>
          <label for="lastName">Nazwisko:</label>
          <input type="text" v-model="lastName" required>
        </div>
        <div>
          <label for="phoneNumber">Numer Telefonu:</label>
          <input type="text" v-model="phoneNumber" required>
        </div>
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  </template>
  
  <script>
  import { auth, db } from '@/firebase';
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { collection, doc, setDoc } from "firebase/firestore"; 
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
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
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
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
  