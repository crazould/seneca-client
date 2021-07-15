// Utilities
import { make } from 'vuex-pathify'

// Globals
import { IN_BROWSER } from '@/util/globals'

const state = {
  dark: false,
  isExist: false,
  isShowMessage: false,
  currSemester: {},
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
