import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = () => new Vuex.Store({
  state: {
    isConnected: false,
    message: null,
  },
  mutations: {
    SOCKET_CONNECT: (state, status) => {
      state.isConnected = true;
    },
    SOCKET_USER_MESSAGE: (state, message) => {
      state.message = message;
    },
  },
  actions: {
    socket_userMessage: ({ commit, dispatch }, message) => {
      console.log(1)
      // ...
    },
  },
})

export default store


