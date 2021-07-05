<template>
  <v-app>
    <v-container
      id="error-view"
      :class="['fill-height', 'text-center']"
      tag="section"
      fluid
    >
      <v-row justify="center">
        <v-col cols="auto">

          <v-img
            contain
             max-height="450"
            src="../assets/Lost-Tourist-big.png"
          ></v-img>

          <div class="text-h2 pt-8 ">
            This Page is Not on the Map
          </div>

          <v-btn class="mt-8" depressed large to="/">
            Get me out of here!
          </v-btn>

        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default { name: "ErrorView" };
</script>

<style lang="sass">
#error-view
  background-color: #23D990
  width: 100%
</style>
