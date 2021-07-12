// Utilities
import { make } from 'vuex-pathify'

// Globals
import { IN_BROWSER } from '@/util/globals'

const state = {
  dark: false,
  isExist: false,
  currSemester: {
    // "text" : "",
    // "value" : ""
  },
  currCourses: [
    {
      group: {
        Group: {
          GroupNumber: false
        }
      },
      subject: {
        ClassTransactionId: false
      }
    }
  ],
  isOnline: false,
  currCourse: {
    group: {
      Group: {
        GroupNumber: false
      }
    },
    subject: {
      ClassTransactionId: false
    }
  },
  drawer: {
    mini: false,
  },
  notifications: [],
  rtl: false,
}

const mutations = make.mutations(state)

const actions = {
  fetch: ({ commit }) => {
    const local = localStorage.getItem('vuetify@user') || '{}'
    
    const user = JSON.parse(local)

    for (const key in user) {
      commit(key, user[key])
    }

    if (user.dark === undefined) {
      commit('dark', window.matchMedia('(prefers-color-scheme: dark)'))
    }
  },
  update: ({ state }) => {
    if (!IN_BROWSER) return

    localStorage.setItem('vuetify@user', JSON.stringify(state))

  },
}

const getters = {
  dark: (state) => {
    return (
      state.dark
    )
  },
  // gradient: state => {
  //   return state.gradients[state.drawer.gradient]
  // },
  // image: state => {
  //   return state.drawer.image === '' ? state.drawer.image : state.images[state.drawer.image]
  // },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
