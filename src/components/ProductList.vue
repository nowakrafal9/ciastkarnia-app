<template>
  <div>
    <h1 class="title">Nasza oferta</h1>
    <ul class="cake-list">
      <li v-for="cake in paginatedCakes" :key="cake.id" class="cake-item">
        <div class="cake-details">
          <img :src="cake.image || require('@/assets/cakes/cake_placeholder.jpg')" alt="Cake image" class="cake-image">
          <div class="cake-info">
            <h2>{{ cake.name }}</h2>
            <p>{{ cake.price }} PLN</p>
            <p>{{ cake.description }}</p>
          </div>
          <button :class="{'add-to-cart-button': true, 'disabled-button': !userRole}" 
                  :disabled="!userRole" 
                  @click="addToCart(cake)">
            <img src="@/assets/cartAdd.svg" alt="Cart add">
            <span class="button-text">dodaj do koszyka</span>
          </button>
        </div>
      </li>
    </ul>
    <div v-if="cakes.length > itemsPerPage" class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Poprzednia</button>
      <span>Strona {{ currentPage }} z {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Następna</button>
    </div>
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
      userRole: null,
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    paginatedCakes() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.cakes.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.cakes.length / this.itemsPerPage);
    }
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
      })).sort((a, b) => a.name.localeCompare(b.name));
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
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }
};
</script>

<style scoped>
.title {
  text-align: center;
  font-family: 'Cursive', sans-serif;
  font-size: 2rem;
  color: #7f3f00;
  margin-bottom: 20px;
}

.cake-list {
  list-style-type: none;
  padding: 0;
}

.cake-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  margin-bottom: 10px;
}

.cake-details {
  display: flex;
  align-items: center;
  width: 100%;
}

.cake-image {
  width: 100px;
  height: auto;
  margin-right: 20px;
}

.cake-info {
  flex-grow: 1;
}

.cake-info h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #7f3f00;
}

.cake-info p {
  margin: 5px 0;
}

.add-to-cart-button {
  background-color: #E7A66C;
  border: none;
  padding: 10px;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.add-to-cart-button img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.add-to-cart-button .button-text {
  font-style: italic;
  color: #fff;
}

.add-to-cart-button:hover {
  background-color: #d9985c;
}

.disabled-button {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #E7A66C;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin: 0 10px;
  font-weight: bold;
  color: #fff;
  border-radius: 5px;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1rem;
  font-weight: bold;
  color: #7f3f00;
}
</style>
