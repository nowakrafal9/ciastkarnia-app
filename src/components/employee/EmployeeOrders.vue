<template>
  <div class="order-list-container">
    <h1 class="title">Wszystkie Zamówienia</h1>
    <table class="order-table">
      <thead>
        <tr>
          <th>Data Zamówienia</th>
          <th>Produkty</th>
          <th>Łączna Cena</th>
          <th>Zamawiający</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in paginatedOrders" :key="order.id">
          <td>{{ formatDate(order.date.toDate()) }}</td>
          <td>
            <ul class="product-list">
              <li v-for="item in order.items" :key="item.id">{{ item.name }} - {{ item.price }} zł</li>
            </ul>
          </td>
          <td class="total-price">{{ order.total }} zł</td>
          <td>{{ getUser(order.userId) }}</td>
          <td>
            <button class="action-button confirm" @click="confirmAction(order, 'closed')">Potwierdź odbiór</button>
            <button class="action-button cancel" @click="confirmAction(order, 'canceled')">Anuluj zamówienie</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="currentPage === 1">Poprzednia</button>
      <button @click="nextPage" :disabled="currentPage === totalPages">Następna</button>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase';

export default {
  data() {
    return {
      orders: [],
      currentPage: 1,
      perPage: 10,
      users: {}
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
    await this.fetchUsers();
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
    async fetchUsers() {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        this.users[doc.id] = doc.data();
      });
    },
    getUser(userId) {
      const user = this.users[userId];
      return user ? `${user.firstName} ${user.lastName}, tel. ${user.phoneNumber}` : 'brak informacji';
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
    confirmAction(order, status) {
      const message = status === 'closed' ? 'Potwierdź odbiór tego zamówienia?' : 'Czy na pewno chcesz anulować to zamówienie?';
      if (confirm(message)) {
        this.confirmOrder(order, status);
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
.order-list-container {
  margin: 0 20px;
  padding: 0 20px;
}

.title {
  text-align: center;
  font-family: 'Cursive', sans-serif;
  font-size: 2rem;
  color: #7f3f00;
  margin-bottom: 20px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.order-table th,
.order-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #7f3f00;
}

.order-table td:last-child {
  text-align: right;
}

.order-table th {
  background-color: #E7A66C;
  color: #7f3f00;
}

.product-list {
  list-style-type: none;
  padding: 0;
}

.product-list li {
  margin-bottom: 5px;
}

.total-price {
  text-align: right;
}

.action-button {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button.confirm {
  background-color: #28a745;
  color: white;
}

.action-button.cancel {
  background-color: #dc3545;
  color: white;
}

.action-button:hover {
  opacity: 0.8;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 20px;
  margin: 0 5px;
  background-color: #E7A66C;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination button:hover {
  background-color: #d9985c;
}
</style>
