<template>
  <v-app>
    <Toolbar v-on:choice-menu="choiceMenu" />
    <Canvas ref="canvas" />
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Toolbar from "./components/Toolbar.vue";
import Canvas from "./components/Canvas.vue";
import { MenuItem } from "./util";

@Component({
  components: {
    Toolbar,
    Canvas
  }
})
export default class App extends Vue {
  private canvas!: Canvas;

  public mounted(): void {
    this.canvas = this.$refs.canvas as Canvas;
  }

  private choiceMenu(item: MenuItem): void {
    if (item.id === "export_as_card") {
      this.exportImageAsCard();
    } else if (item.id === "export") {
      this.exportImageRaw();
    } else {
      alert(item.title);
    }
  }

  private async exportImageRaw(): Promise<void> {
    this.download("image.png", await this.canvas.exportImageRaw());
  }

  private async exportImageAsCard(): Promise<void> {
    this.download("card.png", await this.canvas.exportImageAsCard());
  }

  private async download(fileName: string, url: string): Promise<void> {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  }
}
</script>
