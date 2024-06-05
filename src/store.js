import { createStore } from 'vuex';

export default createStore({
    state: {
        cart: []
    },
    mutations: {
        ADD_TO_CART(state, cake) {
            state.cart.push(cake);
        },
        REMOVE_FROM_CART(state, cakeId) {
            state.cart = state.cart.filter(cake => cake.id !== cakeId);
        },
        CLEAR_CART(state) {
            state.cart = [];
        }
    },
    actions: {
        addToCart({ commit }, cake) {
            commit('ADD_TO_CART', cake);
        },
        removeFromCart({ commit }, cakeId) {
            commit('REMOVE_FROM_CART', cakeId);
        },
        clearCart({ commit }) {
            commit('CLEAR_CART');
        }
    },
    getters: {
        cartItems: state => state.cart,
        cartTotal: state => state.cart.reduce((total, cake) => total + cake.price, 0)
    }
});