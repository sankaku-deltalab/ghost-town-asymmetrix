<template>
  <v-toolbar-side-icon>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-icon v-on="on">menu</v-icon>
      </template>
      <v-list>
        <v-list-tile
          v-for="item in items"
          :key="item.name"
          @click="choiceMenu(item)"
        >
          <v-list-tile-title>{{ item.name }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar-side-icon>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

interface MenuItem {
  name: string;
}

@Component
export default class ToolbarMenu extends Vue {
  private items: MenuItem[] = [
    { name: "setup" },
    { name: "reset" },
    { name: "toggle collision view" },
    { name: "export" }
  ];

  public choiceMenu(item: MenuItem): void {
    alert(item.name); // TODO: Do something
  }
}
</script>

<style scoped></style>
