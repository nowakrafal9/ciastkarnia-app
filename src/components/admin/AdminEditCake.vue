<template>
  <div class="edit-cake-container">
    <h1>Edytuj produkt</h1>
    <form @submit.prevent="updateCake" class="edit-cake-form">
      <div class="form-group">
        <label for="nazwa">Nazwa:</label>
        <input type="text" v-model="cake.name" required>
      </div>
      <div class="form-group">
        <label for="cena">Cena:</label>
        <input type="number" v-model="cake.price" required>
      </div>
      <div class="form-group">
        <label for="description">Opis:</label>
        <textarea v-model="cake.description" required></textarea>
      </div>
      <div class="button-group">
        <button type="submit" class="btn save-btn">Zapisz</button>
        <button @click="cancel" class="btn cancel-btn" type="button">Anuluj</button>
      </div>
    </form>
  </div>
</template>

<script>
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '@/firebase';

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
      this.$router.push('/admin-cakes');
    },
    cancel() {
      this.$router.push('/admin-cakes');
    }
  }
};
</script>

<style scoped>
.edit-cake-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  text-align: center;
  color: #7f3f00;
  margin-bottom: 20px;
}

.edit-cake-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #7f3f00;
}

.form-group input,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.form-group textarea {
  min-width: calc(100% - 22px);
  resize: vertical;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
}

.save-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #da190b;
}
</style>
