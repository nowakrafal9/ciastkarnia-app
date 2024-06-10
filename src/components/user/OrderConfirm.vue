<template>
  <div class="confirmation-container">
    <h1 class="title">Potwierdzenie Zamówienia</h1>
    <div class="form-group">
      <label for="order-date">Wybierz datę zamówienia:</label>
      <DatePicker v-model="orderDate" />
    </div>
    <h2 class="subtitle">Twoje Zamówienie:</h2>
    <table class="order-table">
      <tbody>
        <tr v-for="item in cartItems" :key="item.id">
          <td class="item-name">{{ item.name }}</td>
          <td class="item-price">{{ item.price }} zł</td>
        </tr>
      </tbody>
    </table>
    <h3>Łączna kwota: {{ cartTotal }} zł</h3>
    <div class="button-group">
      <button @click="confirmOrder" class="btn btn-confirm">Potwierdź Zamówienie</button>
      <router-link to="/cart">
        <button class="btn btn-cancel">Anuluj</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { db, auth } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
  components: {
    DatePicker
  },
  data() {
    return {
      orderDate: null
    };
  },
  computed: {
    ...mapGetters(['cartItems', 'cartTotal'])
  },
  methods: {
    async confirmOrder() {
      if (!this.orderDate) {
        alert('Proszę wybrać datę zamówienia.');
        return;
      }

      if (this.cartItems.length === 0) {
        alert('Koszyk jest pusty. Dodaj produkty do koszyka przed potwierdzeniem zamówienia.');
        return;
      }

      const userId = auth.currentUser.uid;

      const order = {
        date: this.orderDate,
        items: this.cartItems,
        total: this.cartTotal,
        userId: userId
      };

      try {
        await addDoc(collection(db, 'orders'), order);
        alert('Zamówienie zostało złożone pomyślnie.');
        this.$store.dispatch('clearCart');
        this.$router.push('/');
      } catch (error) {
        console.error('Błąd podczas składania zamówienia: ', error);
        alert('Wystąpił błąd podczas składania zamówienia. Proszę spróbować ponownie.');
      }
    }
  }
};
</script>

<style scoped>
.confirmation-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 600px;
  padding: 1rem;
  /* background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
}

.title {
  text-align: center;
  font-family: 'Cursive', sans-serif;
  font-size: 2rem;
  color: #7f3f00;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
}

.subtitle {
  text-align: center;
  font-family: 'Cursive', sans-serif;
  font-size: 1.5rem;
  color: #7f3f00;
  margin-bottom: 15px;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
}

.order-table td {
  padding: 8px;
  border: none;
}

.item-name {
  text-align: left;
}

.item-price {
  text-align: right;
}

.button-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.btn {
  background-color: #E7A66C;
  color: #7f3f00;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
}

.btn:hover {
  background-color: #d9985c;
}

.btn+.btn {
  margin-left: 10px;
}

.btn-confirm {
  background-color: #2ecc71;
  color: #fff;
}

.btn-confirm:hover {
  background-color: #27ae60;
}

.btn-cancel {
  background-color: #e74c3c;
  color: #fff;
}

.btn-cancel:hover {
  background-color: #c0392b;
}
</style>
