<template>
    <v-fade-transition mode="out-in">
        <router-view />
    </v-fade-transition>
</template>

<script>
  import '@/styles/overrides.sass'
  export default {
    name: 'App',
    metaInfo: {
      title: 'Seneca',
      titleTemplate: '%s | Laboratory Project Management Tool',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  }
</script>
