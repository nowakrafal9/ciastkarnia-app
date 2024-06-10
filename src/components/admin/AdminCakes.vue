<template>
    <div>
      <h1>Panel Administratora</h1>
      <button @click="goToAddCake">Dodaj Ciastko</button>
      <h2>Edytuj/Usuń Ciastka</h2>
      <table>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Cena</th>
            <th>Opis</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cake in cakes" :key="cake.id">
            <td>{{ cake.name }}</td>
            <td>{{ cake.price }}</td>
            <td>{{ cake.description }}</td>
            <td>
              <button @click="editCake(cake.id)">Edytuj</button>
              <button @click="deleteCake(cake.id)">Usuń</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
  import { db } from '../../firebase';
  
  export default {
    data() {
      return {
        cakes: []
      };
    },
    async created() {
      await this.fetchCake();
    },
    methods: {
      async fetchCake() {
        const querySnapshot = await getDocs(collection(db, 'cakes'));
        this.cakes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      },
      goToAddCake() {
        this.$router.push('/dodaj-ciastko-admin');
      },
      editCake(id) {
        this.$router.push(`/edytuj-ciastko-admin/${id}`);
      },
      async deleteCake(id) {
        await deleteDoc(doc(db, 'cakes', id));
        await this.fetchCake();
      }
    }
  };
  </script>
  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  </style>
  