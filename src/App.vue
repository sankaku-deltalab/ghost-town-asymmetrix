<template>
  <v-app>
    <Toolbar v-on:choice-menu="choiceMenu" />
    <v-content>
      <v-container fluid fill-height class="zero-padding">
        <v-layout justify-center align-center>
          <v-flex shrink>
            <Settings
              v-show="currentPageType === MainPageType.settings"
              v-on:image-change="imageChange"
              v-on:character-name-change="characterNameChange"
              v-on:color-change="changeColor"
            />
            <Canvas
              v-show="currentPageType === MainPageType.editor"
              ref="canvas"
            />
            <License v-show="currentPageType === MainPageType.license" />
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
import License from "./components/License.vue";
import { MenuItem, ImageId, MainPageType } from "./util";

@Component({
  components: {
    Toolbar,
    Settings,
    Canvas,
    License
  }
})
export default class App extends Vue {
  private MainPageType = MainPageType;
  private canvas!: Canvas;
  private currentPageType: MainPageType = MainPageType.editor;

  public mounted(): void {
    this.canvas = this.$refs.canvas as Canvas;
  }

  private choiceMenu(item: MenuItem): void {
    if (item.id === "edit") {
      this.setMainPage(MainPageType.editor);
    } else if (item.id === "settings") {
      this.setMainPage(MainPageType.settings);
    } else if (item.id === "license") {
      this.setMainPage(MainPageType.license);
    } else if (item.id === "export_as_card") {
      this.exportImageAsCard();
    } else if (item.id === "export_photo_size") {
      this.exportImageAsPhotoSize();
    } else if (item.id === "export") {
      this.exportImageRaw();
    } else {
      alert(item.title);
    }
  }

  private setMainPage(pageType: MainPageType): void {
    this.currentPageType = pageType;
  }

  private imageChange(imageId: ImageId, imageURL: string): void {
    this.canvas.imageChange(imageId, imageURL);
  }

  private characterNameChange(name: string): void {
    this.canvas.changeCharacterName(name);
  }

  private changeColor(color: string): void {
    this.canvas.changeColor(color);
  }

  private async exportImageAsPhotoSize(): Promise<void> {
    this.download("photo.png", await this.canvas.exportImageAsPhoto());
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
