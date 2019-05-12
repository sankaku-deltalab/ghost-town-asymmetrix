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
    } else {
      alert(item.title);
    }
  }

  private async exportImageAsCard(): Promise<void> {
    const url = await this.canvas.exportImageAsCard();

    const link = document.createElement("a");
    link.href = url;
    link.download = "card.png";
    link.click();
  }
}
</script>
