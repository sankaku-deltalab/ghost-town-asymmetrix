<template>
  <v-flex xs12>
    <v-form>
      <!-- Character name -->
      <v-text-field
        label="キャラクター名"
        placeholder="Asuha"
        v-model="characterName"
        @change="characterNameChange"
      />
      <!-- color -->
      <v-card>
        Color
        <Compact v-model="color" @input="colorUpdate" />
      </v-card>
      <!-- image -->
      <ImageUploadButton
        v-for="info of buttonInfoArray"
        v-bind:id="info.id"
        v-bind:name="info.name"
        v-on:image-change="imageChange"
        v-bind:key="info.id"
      />
      <!-- return to edit -->
      <v-btn color="primary" @click="returnToEdit">
        <v-icon>check</v-icon>
        編集に戻る
      </v-btn>
    </v-form>
  </v-flex>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator";
import { Compact } from "vue-color";
import ImageUploadButton from "./ImageUploadButton.vue";
import { ImageId, defaultColor } from "@/util";

interface Color {
  a: number;
  hex: string;
  hsl: { h: number; s: number; l: number; a: number };
  hsv: { h: number; s: number; v: number; a: number };
  rgba: { r: number; g: number; b: number; a: number };
}

@Component({
  components: {
    Compact,
    ImageUploadButton
  }
})
export default class Settings extends Vue {
  private characterName: string = "Asuha";
  private color: Color | string = defaultColor;
  private buttonInfoArray: { id: ImageId; name: string }[] = [
    { id: ImageId.titleLogo, name: "タイトルロゴ" },
    { id: ImageId.character, name: "キャラクター" },
    { id: ImageId.mech, name: "背景" }
  ];

  private pickFile() {
    (this.$refs.image as HTMLInputElement).click();
  }

  private colorUpdate(newColor: Color): void {
    if (typeof newColor === "string") throw new Error();
    this.colorChange(newColor.hex);
  }

  @Emit()
  private colorChange(newColor: string): void {}

  @Emit()
  private imageChange(imageId: ImageId, imageURL: string) {}

  @Emit()
  private characterNameChange(name: string) {}

  @Emit()
  private returnToEdit() {}
}
</script>

<style scoped></style>
