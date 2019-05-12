<template>
  <v-form>
    <v-text-field
      label="Character Image"
      @click="pickFile"
      v-model="characterImageName"
      prepend-icon="attach_file"
    ></v-text-field>
    <input
      type="file"
      style="display: none"
      ref="image"
      accept="image/*"
      @change="characterImageChanged"
    />
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator";

@Component({})
export default class Settings extends Vue {
  private characterImageName: string = "";

  private pickFile() {
    (this.$refs.image as HTMLInputElement).click();
  }

  private characterImageChanged(event: Event): void {
    this.characterImageName = this.loadImage("character", event);
  }

  private loadImage(imageId: string, event: Event): string {
    const target = event.target as HTMLInputElement;
    if (target.files === null || target.files.length !== 1) return "";
    const imageFile = target.files[0];

    // When file is not image, then warn
    if (!imageFile.type.match("image.*")) {
      alert("Select image file");
      return "";
    }

    // Read image and emit uploaded image url
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string")
        throw new Error("Image reading failed");
      this.imageChange(imageId, reader.result);
    };
    reader.readAsDataURL(imageFile);

    return imageFile.name;
  }

  @Emit()
  private imageChange(imageId: string, imageURL: string) {}
}
</script>

<style scoped></style>
