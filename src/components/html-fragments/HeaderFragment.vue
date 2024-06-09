<template>
    <header class="no-select">
        <router-link to="/"><img src="@/assets/logo.svg" alt="Ciastkarnia Logo" class="logo"></router-link>
        <nav>
            <div class="user-info no-select" v-if="!user">
                <span class="login-status">Niezalogowano</span>
                <router-link to="/login" v-if="!user" class="login-button">Zaloguj się</router-link>
            </div>

            <div class="user-info" v-if="user">
                <span @click="toggleDropdown" class="login-status">
                    <img src="@/assets/user.svg" alt="User img" class="user-logo">
                    {{ userDisplayName }} 
                    <span class="triangle" :class="{ open: isDropdownOpen }">&#9660;</span>
                </span>
                <div v-if="isDropdownOpen" class="dropdown-content" ref="dropdownContent">
                    <router-link v-if="userRole === 'employee' || userRole === 'admin'" to="/zamowienia-pracownik">Podgląd zamówień</router-link>
                    
                    <router-link v-if="userRole === 'admin'" to="/ciastka-admin">Zarządzenie ciastkami</router-link>
                    <router-link v-if="userRole === 'admin'" to="/lista-uzytkownikow-admin">Zarządzanie Użytkownikami</router-link>

                    <router-link v-if="userRole === 'user' || userRole === 'admin'" to="/koszyk">
                        Koszyk
                        <span class="cart-count" v-if="cartItemCount > 0">({{ cartItemCount }})</span>
                    </router-link>
                    <router-link to="/moje-zamowienia">Moje zamówienia</router-link>
                    <button @click="logout" class="logout">Wyloguj</button>
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
            async logout() {
                await signOut(auth);
                this.$router.push('/');
            }
        }
    };
</script>

<style scoped>
header {
    background-color: #E7A66C;
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
    color: #fff;
    text-decoration: none;
    margin: 0 1rem;
}

nav a:hover {
    text-decoration: underline;
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

.user-info .login-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #7f3f00;
    color: #E7A66C;
    border: 2px solid #7f3f00;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
}

.user-info .login-button:hover {
    background-color: #E7A66C;
    color: #7f3f00;
    font-size: 1rem;
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
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    box-sizing: border-box;
}

.user-info .dropdown-content .logout{
    background-color: #E7A66C;
    text-decoration: none;
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
    font-family: Arial,sans-serif;
    font-size: 16px;
}

.user-info .dropdown-content a:hover,
.user-info .dropdown-content button:hover {
    background-color: #7f3f00;
    color: #ffffff;
}

.no-select {
    user-select: none; /* Standard CSS3 */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
}

</style>
