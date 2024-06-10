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
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sortedCartItems" :key="item.uuid">
            <td>{{ item.name }}</td>
            <td>{{ item.price }} zł</td>
            <td>
              <button class="btn btn-delete" @click="removeItem(item.uuid, item.name)">Usuń</button>
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Łączna kwota: {{ cartTotal }} zł</h2>
      <div class="button-group">
        <button class="btn btn-empty" @click="emptyCart">Opróżnij koszyk</button>
        <router-link to="/confirm-order">
          <button class="btn btn-confirm">Potwierdź zamówienie</button>
        </router-link>
      </div>
      <router-link to="/" class="to-back">
        <button class="btn">Wróć do zakupów</button>
      </router-link>
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
    removeItem(uuid, name) {
      if (confirm('Czy na pewno chcesz usunąć "' + name + '" z koszyka?')) {
        this.removeFromCart(uuid);
      }
    },
    emptyCart() {
      if (confirm('Czy na pewno chcesz opróżnić koszyk?')) {
        this.clearCart();
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
  border-bottom: 1px solid #7f3f00;
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
  margin: 0 5px;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-weight: bold;
}

button.btn:hover {
  background-color: #d9985c;
}

button.btn-empty,
button.btn-delete {
  background-color: #e74c3c;
  color: #fff;
}

button.btn-empty:hover,
button.btn-delete:hover {
  background-color: #c0392b;
}

button.btn-confirm {
  background-color: #2ecc71;
  color: #fff;
}

button.btn-confirm:hover {
  background-color: #27ae60;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

button.router-link+button.router-link {
  margin-left: 10px;
}

.button-group .btn {
  margin: 0 10px 20px;
}

button.router-link+button.router-link {
  margin-left: 10px;
}

.router-link.to-back {
  display: block;
  text-align: center;
  margin-top: 10px;
}
</style>
