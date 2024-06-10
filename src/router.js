import { createRouter, createWebHistory } from 'vue-router';
import Products from './components/nologin/ProductList.vue';
import Login from './components/nologin/ViewLogin.vue';
import Register from './components/nologin/ViewRegister.vue';

import UserCart from './components/user/UserCart.vue';
import OrderConfirm from './components/user/OrderConfirm.vue';
import UserOrders from './components/user/UserOrders.vue'

import EmployeeOrders from './components/employee/EmployeeOrders.vue';

import AdminCakes from './components/admin/AdminCakes.vue';
import AdminAddCake from './components/admin/AdminAddCake.vue';
import AdminEditCake from './components/admin/AdminEditCake.vue';
import AdminUserList from './components/admin/AdminUsersList.vue';

import { auth, db } from './firebase';
import { getDoc, doc } from "firebase/firestore";

const routes = [
    { path: '/', component: Products },
    { path: '/cart', component: UserCart, meta: { requiresAuth: true, roles: ['user'] } },
    { path: '/confirm-order', component: OrderConfirm, meta: { requiresAuth: true, roles: ['user'] } },
    { path: '/my-orders', component: UserOrders, meta: { requiresAuth: true, roles: ['user'] } },
    { path: '/zamowienia-pracownik', component: EmployeeOrders, meta: { requiresAuth: true, roles: ['employee', 'admin'] } },
    { path: '/ciastka-admin', component: AdminCakes, meta: { requiresAuth: true, roles: ['admin'] } },
    { path: '/dodaj-ciastko-admin', component: AdminAddCake, meta: { requiresAuth: true, roles: ['admin'] } },
    { path: '/edytuj-ciastko-admin/:id', component: AdminEditCake, meta: { requiresAuth: true, roles: ['admin'] } },
    { path: '/lista-uzytkownikow-admin', component: AdminUserList, meta: { requiresAuth: true, roles: ['admin'] } },
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
