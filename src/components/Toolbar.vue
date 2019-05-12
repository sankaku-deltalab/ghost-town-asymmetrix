<template>
  <span>
    <v-toolbar app clipped-left>
      <v-toolbar-side-icon @click="toggleNavigation"></v-toolbar-side-icon>
      <v-toolbar-title>星翼ネシカジェネレータ</v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer app fixed clipped v-model="showNavigation">
      <v-list>
        <template v-for="item in items">
          <v-list-tile :key="item.name" @click="choiceMenu(item)">
            <v-list-tile-action>
              <v-icon>{{ item.action }}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator";
import { MenuItem } from "../util";

@Component({})
export default class Toolbar extends Vue {
  private showNavigation: boolean = false;

  private items: MenuItem[] = [
    { id: "settings", title: "settings", action: "settings" },
    { id: "export", title: "export", action: "get_app" },
    { id: "export_as_card", title: "export as card", action: "get_app" }
  ];

  private toggleNavigation(): void {
    this.showNavigation = !this.showNavigation;
  }

  @Emit()
  private choiceMenu(item: MenuItem): void {}
}
</script>

<style scoped></style>
