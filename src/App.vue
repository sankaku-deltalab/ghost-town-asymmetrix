<template>
  <v-app>
    <Toolbar />
    <Canvas />
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Toolbar from "./components/Toolbar.vue";
import Canvas from "./components/Canvas.vue";

@Component({
  components: {
    Toolbar,
    Canvas
  }
})
export default class App extends Vue {}
</script>
