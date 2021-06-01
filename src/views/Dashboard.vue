<template>
  <div>
    <h1>Dashboard</h1>
   
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "Dashboard",
  components: {},
  mounted(){
    axios
      .get("https://laboratory.binus.ac.id/lapi/api/Schedule/GetSemesters")
      .then(response => {console.log(response)})
  },
  data: () => ({
    drawer: null,
  }),
};
</script>
