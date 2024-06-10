<template>
  <div class="admin-panel">
    <h1>Panel Administratora - lista produktów</h1>
    <table class="cake-table">
      <thead>
        <tr>
          <th>Nazwa</th>
          <th>Cena</th>
          <th>Opis</th>
          <th class="actions">
            <button @click="goToAddCake" class="btn btn-add">+</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cake in cakes" :key="cake.id">
          <td>{{ cake.name }}</td>
          <td>{{ cake.price }}</td>
          <td>{{ cake.description }}</td>
          <td class="actions">
            <button @click="editCake(cake.id)" class="btn btn-edit">Edytuj</button>
            <button @click="confirmDeleteCake(cake.id)" class="btn btn-delete">Usuń</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '@/firebase';

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
      })).sort((a, b) => a.name.localeCompare(b.name));
    },
    goToAddCake() {
      this.$router.push('/admin-add-cake');
    },
    editCake(id) {
      this.$router.push(`/admin-edit-cake/${id}`);
    },
    async deleteCake(id) {
      await deleteDoc(doc(db, 'cakes', id));
      await this.fetchCake();
    },
    confirmDeleteCake(id) {
      if (confirm('Czy na pewno chcesz usunąć to ciastko?')) {
        this.deleteCake(id);
      }
    }
  }
};
</script>

<style scoped>
.admin-panel {
  padding: 0 20px;
  margin: 0 20px;
}

h1 {
  text-align: center;
  color: #7f3f00;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border-bottom: 1px solid #7f3f00;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #E7A66C;
  color: #7f3f00;
}

.actions {
  text-align: right;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn-add {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  font-size: 1.5rem;
  line-height: 1rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.btn-add:hover {
  background-color: #45a049;
}

.btn-edit {
  background-color: #E7A66C;
  color: #7f3f00;
  margin-right: 10px;
}

.btn-edit:hover {
  background-color: #d9985c;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-delete:hover {
  background-color: #da190b;
}
</style>
