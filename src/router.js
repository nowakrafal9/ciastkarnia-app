import { createRouter, createWebHistory } from 'vue-router';
import Products from './components/ProductList.vue';
import Cart from './components/CartList.vue';

const routes = [
    { path: '/', component: Products },
    { path: '/koszyk', component: Cart }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
