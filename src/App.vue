<template>
  <v-app>
    <Toolbar v-on:choice-menu="choiceMenu" />
    <v-content>
      <v-container fluid fill-height class="zero-padding">
        <v-layout justify-center align-center>
          <v-flex shrink>
            <Settings v-show="showSettings" v-on:image-change="imageChange" />
            <Canvas v-show="!showSettings" ref="canvas" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Toolbar from "./components/Toolbar.vue";
import Settings from "./components/Settings.vue";
import Canvas from "./components/Canvas.vue";
import { MenuItem, ImageId } from "./util";

@Component({
  components: {
    Toolbar,
    Settings,
    Canvas
  }
})
export default class App extends Vue {
  private canvas!: Canvas;
  private showSettings: boolean = false;

  public mounted(): void {
    this.canvas = this.$refs.canvas as Canvas;
  }

  private choiceMenu(item: MenuItem): void {
    if (item.id === "edit") {
      this.showSettings = false;
    } else if (item.id === "settings") {
      this.showSettings = true;
    } else if (item.id === "export_as_card") {
      this.exportImageAsCard();
    } else if (item.id === "export") {
      this.exportImageRaw();
    } else {
      alert(item.title);
    }
  }

  private imageChange(imageId: ImageId, imageURL: string): void {
    this.canvas.imageChange(imageId, imageURL);
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

<style scoped>
.zero-padding {
  padding: 0px;
}
</style>
