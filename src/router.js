import { createRouter, createWebHistory } from 'vue-router';
import Products from './components/ProductList.vue';
import Cart from './components/CartList.vue';
import OrderConfirmation from './components/OrderConfirmation.vue';
import EmployeeOrders from './components/EmployeeOrders.vue';

const routes = [
    { path: '/', component: Products },
    { path: '/koszyk', component: Cart },
    { path: '/potwierdzenie-zamowienia', component: OrderConfirmation },
    { path: '/zamowienia-pracownik', component: EmployeeOrders }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
