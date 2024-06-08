<template>
    <div>
      <h1>Edytuj Ciastko</h1>
      <form @submit.prevent="updateCake">
        <div>
          <label for="nazwa">Nazwa:</label>
          <input type="text" v-model="cake.name" required>
        </div>
        <div>
          <label for="cena">Cena:</label>
          <input type="number" v-model="cake.price" required>
        </div>
        <div>
          <label for="description">Opis:</label>
          <textarea v-model="cake.description" required></textarea>
        </div>
        <button type="submit">Zapisz</button>
        <button @click="cancel">Anuluj</button>
      </form>
    </div>
  </template>
  
  <script>
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { db } from '../firebase';
  
  export default {
    data() {
      return {
        cake: {
          name: '',
          price: '',
          description: ''
        }
      };
    },
    async created() {
      const docRef = doc(db, 'cakes', this.$route.params.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.cake = docSnap.data();
      }
    },
    methods: {
      async updateCake() {
        await updateDoc(doc(db, 'cakes', this.$route.params.id), {
          name: this.cake.name,
          price: this.cake.price,
          description: this.cake.description
        });
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
  