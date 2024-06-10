<template>
    <div>
      <h1 class="title">Moje Zamówienia</h1>
      <div v-if="orders.length === 0" class="no-orders">
        <h2>Brak zamówień</h2>
        <router-link to="/">
          <button class="btn">Wróć do zakupów</button>
        </router-link>
      </div>
      <ul style="list-style-type: none;">
        <li v-for="order in paginatedOrders" :key="order.id" class="order">
          <div>
            <p>Data: {{ order.date.toDate().toLocaleString() }}</p>
            <p>Szczegóły zamówienia:</p>
            <ul>
                <li v-for="item in order.items" :key="item.name">
                    {{ item.name }} - {{ item.price }} zł
                </li>
            </ul>
            <p>Łączna wartość: {{ order.total }} zł</p>
            <button @click="confirmCancelOrder(order)">Anuluj zamówienie</button>
          </div>
        </li>
      </ul>
      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="currentPage === 1">Poprzednia</button>
        <span>Strona {{ currentPage }} z {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Następna</button>
      </div>
    </div>
</template>
  
<script>
import { db, auth } from '@/firebase';
import { collection, query, where, orderBy, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default {
  data() {
    return {
      orders: [],
      currentPage: 1,
      pageSize: 5,
      totalOrders: 0,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalOrders / this.pageSize);
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.orders.slice(start, end);
    },
  },
  async created() {
    await this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('date', 'asc')
        );
        const querySnapshot = await getDocs(q);
        this.orders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.totalOrders = this.orders.length;
      }
    },
    async cancelOrder(order) {
      await addDoc(collection(db, 'archivedOrders'), {
        ...order,
        status: 'cancelled'
      });
      await deleteDoc(doc(db, 'orders', order.id));
      await this.fetchOrders();
    },
    confirmCancelOrder(order) {
      if (confirm('Czy na pewno chcesz anulować zamówienie?')) {
        this.cancelOrder(order);
      }
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
  },
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

  .no-orders {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 50vh;
  }

  .order{
    padding-bottom: 1rem;
    border-bottom: 2px solid #7f3f00;
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
  
  .pagination button {
    padding: 0.5rem 1rem;
    background-color: #E7A66C;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  button {
    background-color: #E7A66C;
    color: #7f3f00;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s;
    font-weight: bold;
  }

  button:hover {
    background-color: #d9985c;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>
  