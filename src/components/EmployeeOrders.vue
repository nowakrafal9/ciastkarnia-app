<template>
    <div>
      <h1>Wszystkie Zamówienia</h1>
      <table>
        <thead>
          <tr>
            <th>Data Zamówienia</th>
            <th>Produkty</th>
            <th>Łączna Cena</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.id">
            <td>{{ formatDate(order.date.toDate()) }}</td>
            <td>
              <ul>
                <li v-for="item in order.items" :key="item.id">{{ item.name }} - {{ item.price }} PLN</li>
              </ul>
            </td>
            <td>{{ order.total }} PLN</td>
            <td>
              <button @click="confirmOrder(order, 'closed')">Potwierdź odbiór</button>
              <button @click="confirmOrder(order, 'canceled')">Anuluj zamówienie</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Poprzednia</button>
        <button @click="nextPage" :disabled="currentPage === totalPages">Następna</button>
      </div>
    </div>
  </template>
  
  <script>
  import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc } from "firebase/firestore";
  import { db } from '../firebase';
  
  export default {
    data() {
      return {
        orders: [],
        currentPage: 1,
        perPage: 10,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.orders.length / this.perPage);
      },
      paginatedOrders() {
        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        return this.orders.slice(start, end);
      },
    },
    async created() {
      await this.fetchOrders();
    },
    methods: {
      async fetchOrders() {
        const q = query(collection(db, "orders"), orderBy("date", "asc"));
        const querySnapshot = await getDocs(q);
        this.orders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      },
      formatDate(date) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return date.toLocaleDateString(undefined, options);
      },
      async confirmOrder(order, status) {
        await addDoc(collection(db, 'archivedOrders'), {
        ...order,
        status
        });
        await deleteDoc(doc(db, 'orders', order.id));
        await this.fetchOrders();
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
    margin-top: 20px;
  }
  </style>
  