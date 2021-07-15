<template>
  <v-list-item class="mb-0 justify-space-between pl-3">
    <v-list-item-avatar>
      <v-img :src="require('@/assets/slc-logo.png')" />
    </v-list-item-avatar>
    <v-list-item-content class="pl-2">
      <v-list-item-title class="text-h3 mb-2">
        Seneca
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>

export default {
  name: "DefaultDrawerHeader",
};
</script>
