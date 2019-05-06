<template>
  <v-app>
    <Toolbar />
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Toolbar from "./components/Toolbar.vue";

@Component({
  components: {
    Toolbar
  }
})
export default class App extends Vue {}
</script>
