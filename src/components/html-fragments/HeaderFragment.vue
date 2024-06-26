<template>
    <header class="no-select">
        <router-link to="/"><img src="@/assets/logo.svg" alt="Ciastkarnia Logo" class="logo"></router-link>
        <nav>
            <div class="user-info" v-if="!user">
                <span @click="toggleDropdown" class="login-status">
                    <img src="@/assets/user.svg" alt="User img" class="user-logo">
                    Niezalogowano
                    <span class="triangle" :class="{ open: isDropdownOpen }">&#9660;</span>
                </span>
                <div v-if="isDropdownOpen" class="dropdown-content" ref="dropdownContent">
                    <router-link to="/login" v-if="!user" class="login-button">Zaloguj się</router-link>
                </div>
            </div>

            <div class="user-info" v-if="user">
                <span @click="toggleDropdown" class="login-status">
                    <img src="@/assets/user.svg" alt="User img" class="user-logo">
                    {{ userDisplayName }}
                    <span class="triangle" :class="{ open: isDropdownOpen }">&#9660;</span>
                </span>
                <div v-if="isDropdownOpen" class="dropdown-content" ref="dropdownContent">
                    <router-link v-if="userRole === 'employee' || userRole === 'admin'" to="/all-orders">Podgląd
                        zamówień</router-link>

                    <router-link v-if="userRole === 'admin'" to="/admin-cakes">Zarządzenie produktami</router-link>
                    <router-link v-if="userRole === 'admin'" to="/admin-users">Zarządzanie
                        Użytkownikami</router-link>

                    <router-link v-if="userRole === 'user'" to="/cart">
                        Koszyk
                        <span class="cart-count" v-if="cartItemCount > 0">({{ cartItemCount }})</span>
                    </router-link>
                    <router-link v-if="userRole === 'user'" to="/my-orders">Moje zamówienia</router-link>
                    <button @click="confirmLogout" class="logout">Wyloguj</button>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
import { auth, db } from '@/firebase';
import { signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { mapState } from 'vuex';

export default {
    data() {
        return {
            user: null,
            userRole: null,
            userDisplayName: '',
            isDropdownOpen: false,
        };
    },
    computed: {
        ...mapState({
            cartItemCount: state => state.cart.length
        })
    },
    async created() {
        this.updateUserState();

        auth.onAuthStateChanged(() => {
            this.updateUserState();
        });

        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        async updateUserState() {
            const user = auth.currentUser;
            if (user) {
                this.user = user;
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    this.userRole = userData.role;
                    this.userDisplayName = `${userData.firstName} ${userData.lastName}`;
                }
            } else {
                this.user = null;
                this.userRole = null;
                this.userDisplayName = '';
            }
        },
        toggleDropdown(event) {
            event.stopPropagation();
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        handleClickOutside(event) {
            const dropdownContent = this.$refs.dropdownContent;
            if (dropdownContent && !dropdownContent.contains(event.target) && this.isDropdownOpen) {
                this.isDropdownOpen = false;
            }
        },
        confirmLogout() {
            if (confirm('Czy na pewno chcesz się wylogować?')) {
                this.logout();
            }
        },
        async logout() {
            await signOut(auth);
            this.$router.push('/');
        }
    }
};
</script>

<style scoped>
header {
    background-color: rgb(253, 223, 166);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    color: #fff;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    height: 5rem;
}

nav {
    display: flex;
    align-items: center;
}

nav a {
    text-decoration: none;
    margin: 0 1rem;
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

.user-info .login-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    font-weight: bolder;
    font-size: 1rem;
    color: #7f3f00;
}

.user-info .user-logo {
    width: 40px;
    height: 40px;
    margin-bottom: 5px;
}

.user-info .triangle {
    display: block;
    text-align: center;
    color: #7f3f00;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%) rotate(90deg);
    transition: transform 0.3s;
}

.user-info .triangle.open {
    transform: translateY(-50%) rotate(0deg);
}

.user-info .dropdown-content {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #ffffff;
    border-radius: 5px;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    box-sizing: border-box;
}

.user-info .dropdown-content .login-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #7f3f00;
    border: 2px solid #7f3f00;
    color: rgb(253, 223, 166);
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
}

.user-info .dropdown-content .login-button:hover {
    background-color: rgb(253, 223, 166);
    color: #7f3f00;
    font-size: 1rem;
}

.user-info .dropdown-content .logout {
    background-color: #7f3f00;
    color: rgb(253, 223, 166);
    text-decoration: none;
    border-radius: 0 0 5px 5px;
    border: 0;
}

.user-info .dropdown-content .logout:hover {
    background-color: rgb(253, 223, 166);
    color: #7f3f00;
    ;
    text-decoration: none;
    border-radius: 0 0 5px 5px;
    border: 0;
}

.user-info .dropdown-content a,
.user-info .dropdown-content button {
    color: #7f3f00;
    padding: 12px 16px;
    text-decoration: none;
    font-weight: bold;
    display: block;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    font-size: 16px;
}

.user-info .dropdown-content a:hover,
.user-info .dropdown-content button:hover {
    background-color: rgb(247, 231, 202);
    color: #7f3f00;
}
</style>
