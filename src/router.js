import { createRouter, createWebHistory } from 'vue-router';
import Products from './components/ProductList.vue';
import Cart from './components/CartList.vue';
import OrderConfirmation from './components/OrderConfirmation.vue';
import EmployeeOrders from './components/EmployeeOrders.vue';
import AdminCakes from './components/AdminCakes.vue';
import AdminAddCake from './components/AdminAddCake.vue';
import AdminEditCake from './components/AdminEditCake.vue';

const routes = [
    { path: '/', component: Products },
    { path: '/koszyk', component: Cart },
    { path: '/potwierdzenie-zamowienia', component: OrderConfirmation },
    { path: '/zamowienia-pracownik', component: EmployeeOrders },
    { path: '/ciastka-admin', component: AdminCakes },
    { path: '/dodaj-ciastko-admin', component: AdminAddCake },
    { path: '/edytuj-ciastko-admin/:id', component: AdminEditCake }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
