import { createRouter, createWebHistory } from 'vue-router';
import Products from './components/ProductList.vue';
import Cart from './components/CartList.vue';
import OrderConfirmation from './components/OrderConfirmation.vue';
import EmployeeOrders from './components/EmployeeOrders.vue';
import AdminCakes from './components/AdminCakes.vue';
import AdminAddCake from './components/AdminAddCake.vue';
import AdminEditCake from './components/AdminEditCake.vue';
import Login from './components/LoginView.vue';
import Register from './components/RegisterView.vue';

import { auth, db } from './firebase';
import { getDoc, doc } from "firebase/firestore";

const routes = [
    { path: '/', component: Products },
    { path: '/koszyk', component: Cart, meta: { requiresAuth: true, roles: ['user', 'admin'] } },
    { path: '/potwierdzenie-zamowienia', component: OrderConfirmation, meta: { requiresAuth: true, roles: ['user', 'admin'] } },
    { path: '/zamowienia-pracownik', component: EmployeeOrders, meta: { requiresAuth: true, roles: ['employee', 'admin'] } },
    { path: '/ciastka-admin', component: AdminCakes, meta: { requiresAuth: true, roles: ['admin'] } },
    { path: '/dodaj-ciastko-admin', component: AdminAddCake, meta: { requiresAuth: true, roles: ['admin'] } },
    { path: '/edytuj-ciastko-admin/:id', component: AdminEditCake, meta: { requiresAuth: true, roles: ['admin'] } },
    { path: '/login', component: Login },
    { path: '/register', component: Register }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const user = auth.currentUser;

    if (requiresAuth && !user) {
        next('/login');
    } else if (requiresAuth && user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const roles = to.meta.roles;
            if (roles && roles.includes(userData.role)) {
                next();
            } else {
                next('/');
            }
        } else {
            next('/');
        }
    } else {
        next();
    }
});

export default router;
