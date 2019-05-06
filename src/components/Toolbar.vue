<template>
  <v-toolbar>
    <ToolbarMenu />
    <v-toolbar-title>星翼ネシカジェネレータ</v-toolbar-title>
  </v-toolbar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ToolbarMenu from "./ToolbarMenu.vue";

@Component({
  components: {
    ToolbarMenu
  }
})
export default class Toolbar extends Vue {}
</script>

<style scoped></style>
