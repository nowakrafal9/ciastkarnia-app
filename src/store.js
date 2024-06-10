import { createStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';

export default createStore({
    state: {
        cart: []
    },
    mutations: {
        ADD_TO_CART(state, cake) {
            state.cart.push({ ...cake, uuid: uuidv4() });
        },
        REMOVE_FROM_CART(state, uuid) {
            state.cart = state.cart.filter(item => item.uuid !== uuid);
        },
        CLEAR_CART(state) {
            state.cart = [];
        }
    },
    actions: {
        addToCart({ commit }, cake) {
            commit('ADD_TO_CART', cake);
        },
        removeFromCart({ commit }, uuid) {
            commit('REMOVE_FROM_CART', uuid);
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
