<template>
  <span>
    <v-toolbar app fixed absolute clipped-left>
      <v-toolbar-side-icon @click="toggleNavigation"></v-toolbar-side-icon>
      <v-toolbar-title>星翼ネシカジェネレータ</v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer app fixed clipped v-model="showNavigation">
      <v-list>
        <template v-for="item in items">
          <v-list-tile :key="item.name" @click="menuItemPressed(item)">
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
    { id: "edit", title: "編集", action: "edit" },
    { id: "settings", title: "設定", action: "settings" },
    {
      id: "export_photo_size",
      title: "写真印刷用に画像を出力",
      action: "get_app"
    },
    { id: "export_as_card", title: "枠内のみの画像を出力", action: "get_app" },
    { id: "usage", title: "使い方", action: "help" },
    { id: "license", title: "Third Party Licenses", action: "people" }
  ];

  private toggleNavigation(): void {
    this.showNavigation = !this.showNavigation;
  }

  private menuItemPressed(item: MenuItem): void {
    this.showNavigation = false;
    this.choiceMenu(item);
  }

  @Emit()
  private choiceMenu(item: MenuItem): void {}
}
</script>

<style scoped></style>
