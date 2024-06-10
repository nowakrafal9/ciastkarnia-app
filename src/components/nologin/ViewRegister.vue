<template>
  <div class="register-container">
    <h1 class="title">Rejestracja</h1>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Hasło:</label>
        <input type="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="firstName">Imię:</label>
        <input type="text" v-model="firstName" required>
      </div>
      <div class="form-group">
        <label for="lastName">Nazwisko:</label>
        <input type="text" v-model="lastName" required>
      </div>
      <div class="form-group">
        <label for="phoneNumber">Numer Telefonu:</label>
        <input type="text" v-model="phoneNumber" required>
      </div>
      <div class="button-group">
        <button type="submit" class="btn">Zarejestruj</button>
        <button @click="cancel" type="button" class="btn cancel-btn">Cofnij</button>
      </div>
    </form>
  </div>
</template>

<script>
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";

export default {
  data() {
    return {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: 'user'
    };
  },
  methods: {
    async register() {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;
        await setDoc(doc(collection(db, "users"), user.uid), {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          phoneNumber: this.phoneNumber,
          role: this.role
        });
        this.$router.push('/');
      } catch (error) {
        alert(error.message);
      }
    },
    cancel() {
      this.$router.push('/login');
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

.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 10px; */
  margin: 0 auto;
}

.register-form {
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

.cancel-btn {
  background-color: #ccc;
}

.cancel-btn:hover {
  background-color: #bbb;
}

.btn+.btn {
  margin-left: 10px;
}
</style>
