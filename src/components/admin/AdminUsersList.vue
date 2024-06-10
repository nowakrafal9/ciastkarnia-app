<template>
  <div class="admin-panel">
    <h1>Panel Administratora - zarządzanie kontami</h1>
    <button @click="toggleFilters" class="btn-toggle-filters">
      {{ showFilters ? 'Ukryj Filtry' : 'Pokaż Filtry' }}
    </button>
    <div v-if="showFilters" class="filters">
      <table>
        <tr>
          <td><label for="emailFilter">Email:</label></td>
          <td><input type="text" v-model="filters.email" @input="applyFilters"></td>
        </tr>
        <tr>
          <td><label for="firstNameFilter">Imię:</label></td>
          <td><input type="text" v-model="filters.firstName" @input="applyFilters"></td>
        </tr>
        <tr>
          <td><label for="lastNameFilter">Nazwisko:</label></td>
          <td><input type="text" v-model="filters.lastName" @input="applyFilters"></td>
        </tr>
        <tr>
          <td><label for="phoneNumberFilter">Numer Telefonu:</label></td>
          <td><input type="text" v-model="filters.phoneNumber" @input="applyFilters"></td>
        </tr>
        <tr>
          <td><label>Role:</label></td>
          <td>
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
          </td>
        </tr>
      </table>
    </div>
    <table class="user-table">
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
            <button v-if="user.role === 'employee'" @click="confirmDeleteUser(user.id)"
              class="btn btn-delete">Usuń</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Poprzednia</button>
      <span>Strona {{ currentPage }} z {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Następna</button>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from '../../firebase';

export default {
  data() {
    return {
      users: [],
      currentPage: 1,
      perPage: 10,
      showFilters: false,
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
    confirmDeleteUser(userId) {
      if (confirm('Czy na pewno chcesz usunąć tego użytkownika?')) {
        this.deleteUser(userId);
      }
    },
    applyFilters() {
      this.currentPage = 1; // Reset current page to 1 when filters are applied
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
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
.admin-panel {
  padding: 0 20px;
}

h1 {
  text-align: center;
  color: #7f3f00;
}

.btn-toggle-filters {
  background-color: #E7A66C;
  color: #7f3f00;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
}

.btn-toggle-filters:hover {
  background-color: #d9985c;
}

.filters {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.filters table {
  width: 25%;
}

.filters td {
  padding: 5px;
  vertical-align: middle;
}

.filters td,
.filters th {
  border: none;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border-bottom: 1px solid #7f3f00;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #E7A66C;
  color: #7f3f00;
}

td .btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-delete:hover {
  background-color: #da190b;
}

.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.pagination button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination button:not(:disabled):hover {
  background-color: #d9985c;
}
</style>
