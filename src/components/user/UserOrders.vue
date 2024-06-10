<template>
    <div>
      <h1>Moje Zamówienia</h1>
      <ul>
        <li v-for="order in paginatedOrders" :key="order.id">
          <div>
            <p>Data: {{ order.date.toDate().toLocaleString() }}</p>
            <p>Szczegóły zamówienia:</p>
            <ul>
                <li v-for="item in order.items" :key="item.name">
                    {{ item.name }} - {{ item.price }} PLN
                </li>
            </ul>
            <p>Łączna wartość: {{ order.total }} PLN</p>
          </div>
        </li>
      </ul>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Poprzednia</button>
        <span>Strona {{ currentPage }} z {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Następna</button>
      </div>
    </div>
  </template>
  
  <script>
  import { db, auth } from '@/firebase';
  import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
  
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
        console.log(user);
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
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
    },
  };
  </script>
  
  <style scoped>
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
  </style>
  