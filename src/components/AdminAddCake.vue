<template>
    <div>
      <h1>Dodaj Nowe Ciastko</h1>
      <form @submit.prevent="addCake">
        <div>
          <label for="nazwa">Nazwa:</label>
          <input type="text" v-model="newCake.name" required>
        </div>
        <div>
          <label for="cena">Cena:</label>
          <input type="number" v-model="newCake.price" required>
        </div>
        <div>
          <label for="description">Opis:</label>
          <textarea v-model="newCake.description" required></textarea>
        </div>
        <button type="submit">Dodaj Ciastko</button>
        <button @click="cancel">Anuluj</button>
      </form>
    </div>
  </template>
  
  <script>
  import { collection, addDoc } from "firebase/firestore";
  import { db } from '../firebase';
  
  export default {
    data() {
      return {
        newCake: {
          name: '',
          price: '',
          description: ''
        }
      };
    },
    methods: {
      async addCake() {
        await addDoc(collection(db, 'cakes'), { ...this.newCake });
        this.$router.push('/ciastka-admin');
      },
      cancel() {
        this.$router.push('/ciastka-admin');
      }
    }
  };
  </script>
  
  <style scoped>
  form {
    margin-bottom: 20px;
  }
  textarea {
    width: 100%;
    height: 100px;
  }
  </style>
  