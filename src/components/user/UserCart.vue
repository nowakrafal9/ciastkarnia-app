<template>
  <div class="cart-container">
    <h1 class="title">Twój Koszyk</h1>
    <div v-if="cartItems.length === 0" class="empty-cart">
      <h2>Koszyk jest pusty</h2>
      <router-link to="/">
        <button class="btn">Wróć do zakupów</button>
      </router-link>
    </div>
    <div v-else>
      <table class="cart-table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Cena</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sortedCartItems" :key="item.uuid">
            <td>{{ item.name }}</td>
            <td>{{ item.price }} zł</td>
            <td>
              <button class="btn" @click="removeItem(item.uuid)">Usuń</button>
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Łączna kwota: {{ cartTotal }} zł</h2>
      <div class="button-group">
        <button class="btn" @click="emptyCart">Opróżnij koszyk</button>
        <router-link to="/potwierdzenie-zamowienia">
          <button class="btn">Potwierdź zamówienie</button>
        </router-link>
        <router-link to="/">
          <button class="btn">Wróć do zakupów</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['cartItems', 'cartTotal']),
    sortedCartItems() {
      return this.cartItems.slice().sort((a, b) => a.name.localeCompare(b.name));
    }
  },
  methods: {
    ...mapActions(['removeFromCart', 'clearCart']),
    removeItem(uuid) {
      this.removeFromCart(uuid);
    },
    emptyCart() {
      this.clearCart();
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

.cart-container {
  text-align: center;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 50vh;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.cart-table th,
.cart-table td {
  border: 1px solid #7f3f00;
  padding: 8px;
  text-align: center;
}

.cart-table th {
  background-color: #E7A66C;
  color: #7f3f00;
}

button.btn {
  background-color: #E7A66C;
  color: #7f3f00;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
}

button.btn:hover {
  background-color: #d9985c;
}

button.btn {
  margin: 0 5px;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

button.router-link + button.router-link {
  margin-left: 10px;
}
</style>
