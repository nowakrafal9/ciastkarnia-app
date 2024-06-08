<template>
    <header>
        <router-link to="/"><img src="@/assets/logo.svg" alt="Ciastkarnia Logo" class="logo"></router-link>
        <nav>
            <div class="user-info" v-if="!user">
                Użytkownik:<br/> niezalogowany <br/>
                <router-link to="/login" v-if="!user" class="login-button">Zaloguj się</router-link>
            </div>
            <div class="user-info" v-if="user">
                <span @click="toggleDropdown">
                    Użytkownik:<br/>
                    {{ userDisplayName }} 
                    <span class="triangle">&#9660;</span>
                </span>
                <div v-if="isDropdownOpen" class="dropdown-content" ref="dropdownContent">
                    <router-link v-if="userRole === 'employee' || userRole === 'admin'" to="/zamowienia-pracownik">Podgląd zamówień</router-link>
                    
                    <router-link v-if="userRole === 'admin'" to="/ciastka-admin">Zarządzenie ciastkami</router-link>
                    <router-link v-if="userRole === 'admin'" to="/lista-uzytkownikow-admin">Zarządzanie Użytkownikami</router-link>

                    <router-link v-if="userRole === 'user' || userRole === 'admin'" to="/koszyk">Koszyk</router-link>
                    <router-link to="/moje-zamowienia">Moje zamówienia</router-link>
                    <button @click="logout">Wyloguj</button>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
    import { auth, db } from '@/firebase';
    import { signOut } from "firebase/auth";
    import { getDoc, doc } from "firebase/firestore";

    export default {
        data() {
            return {
                user: null,
                userRole: null,
                userDisplayName: '',
                isDropdownOpen: false,
                title: 'Tytuł podstrony'
            };
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
    position: relative;
    cursor: pointer;
}

.user-info .triangle {
    display: inline-block;
}

.user-info .dropdown-content {
    display: none;
    position: absolute;
    top: 30px;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1;
    color: black;
    padding: 1rem;
    border-radius: 5px;
}

.user-info .dropdown-content a,
.user-info .dropdown-content button {
    display: block;
    padding: 0.5rem 0;
    text-decoration: none;
    color: black;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
}

.user-info .dropdown-content a:hover,
.user-info .dropdown-content button:hover {
    background-color: #f1f1f1;
}

.user-info .dropdown-content {
    display: block;
}
</style>
