<template>
  <div>
    <h1>Zarządzanie Kontami Użytkowników</h1>
    <div class="filters">
      <div>
        <label for="emailFilter">Email:</label>
        <input type="text" v-model="filters.email" @input="applyFilters">
      </div>
      <div>
        <label for="firstNameFilter">Imię:</label>
        <input type="text" v-model="filters.firstName" @input="applyFilters">
      </div>
      <div>
        <label for="lastNameFilter">Nazwisko:</label>
        <input type="text" v-model="filters.lastName" @input="applyFilters">
      </div>
      <div>
        <label for="phoneNumberFilter">Numer Telefonu:</label>
        <input type="text" v-model="filters.phoneNumber" @input="applyFilters">
      </div>
      <div>
        <label>Role:</label>
        <div>
          <input type="checkbox" id="userRole" value="user" v-model="filters.roles" @change="applyFilters">
          <label for="userRole">User</label>
        </div>
        <div>
          <input type="checkbox" id="employeeRole" value="employee" v-model="filters.roles" @change="applyFilters">
          <label for="employeeRole">Employee</label>
        </div>
        <div>
          <input type="checkbox" id="adminRole" value="admin" v-model="filters.roles" @change="applyFilters">
          <label for="adminRole">Admin</label>
        </div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Imię</th>
          <th>Nazwisko</th>
          <th>Numer Telefonu</th>
          <th>Rola</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.email || 'brak informacji' }}</td>
          <td>{{ user.firstName || 'brak informacji' }}</td>
          <td>{{ user.lastName || 'brak informacji' }}</td>
          <td>{{ user.phoneNumber || 'brak informacji' }}</td>
          <td>{{ user.role || 'brak informacji' }}</td>
          <td>
            <button v-if="user.role === 'employee'" @click="deleteUser(user.id)">Usuń</button>
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
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';

export default {
  data() {
    return {
      users: [],
      currentPage: 1,
      perPage: 10,
      filters: {
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        roles: ['user', 'employee', 'admin']
      }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.perPage);
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredUsers.slice(start, end);
    },
    filteredUsers() {
      return this.users.filter(user => {
        const email = user.email ? user.email.toLowerCase() : '';
        const firstName = user.firstName ? user.firstName.toLowerCase() : '';
        const lastName = user.lastName ? user.lastName.toLowerCase() : '';
        const phoneNumber = user.phoneNumber ? user.phoneNumber.toLowerCase() : '';
        const filterEmail = this.filters.email.toLowerCase();
        const filterFirstName = this.filters.firstName.toLowerCase();
        const filterLastName = this.filters.lastName.toLowerCase();
        const filterPhoneNumber = this.filters.phoneNumber.toLowerCase();

        return (
          (!filterEmail || email.includes(filterEmail)) &&
          (!filterFirstName || firstName.includes(filterFirstName)) &&
          (!filterLastName || lastName.includes(filterLastName)) &&
          (!filterPhoneNumber || phoneNumber.includes(filterPhoneNumber)) &&
          (this.filters.roles.includes(user.role))
        );
      });
    }
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      const q = query(collection(db, "users"), orderBy("role"), orderBy("email"));
      const querySnapshot = await getDocs(q);
      this.users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    async deleteUser(userId) {
      await deleteDoc(doc(db, 'users', userId));
      await this.fetchUsers();
    },
    applyFilters() {
      this.currentPage = 1; // Reset current page to 1 when filters are applied
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
.filters {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.filters div {
  margin-bottom: 10px;
}
.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
