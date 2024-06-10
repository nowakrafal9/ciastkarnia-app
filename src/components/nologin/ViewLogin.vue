<template>
  <div class="login-container">
    <h1 class="title">Logowanie</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Hasło:</label>
        <input type="password" v-model="password" required>
      </div>
      <div class="button-group">
        <button type="submit" class="btn">Zaloguj</button>
        <button @click="register" type="button" class="btn">Zarejestruj</button>
      </div>
    </form>
  </div>
</template>

<script>
import { auth } from '@/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push('/');
      } catch (error) {
        alert(error.message);
      }
    },
    async register() {
      try {
        this.$router.push('/register');
      } catch (error) {
        alert(error.message);
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

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff; */
  border-radius: 10px;
  margin: 0 auto;
}

.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #7f3f00;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.button-group {
  display: flex;
  justify-content: space-between;
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
</style>
