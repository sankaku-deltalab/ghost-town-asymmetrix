<template>
  <div>
    <v-btn @click="pickFile">
      <v-icon>attach_file</v-icon>
      {{ this.name }}: {{ imageName }}
    </v-btn>
    <input
      type="file"
      ref="input"
      accept="image/*"
      hidden
      @change="fileChanged"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator";
import { Promise } from "excalibur";

@Component({})
export default class ImageUploadButton extends Vue {
  @Prop() readonly id!: string;
  @Prop() readonly name!: string;
  private imageName: string = "None";

  private pickFile() {
    (this.$refs.input as HTMLInputElement).click();
  }

  private fileChanged(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files === null || target.files.length !== 1) {
      alert("Select only one file");
      return;
    }
    const imageFile = target.files[0];

    // When file is not image, then warn
    if (!imageFile.type.match("image.*")) {
      alert("Select image file");
      return;
    }

    this.imageName = imageFile.name;
    this.loadImageURL(
      imageFile,
      (url: string): void => {
        this.imageChange(this.id, url);
      }
    );
  }

  private loadImageURL(imageFile: File, onLoad: (url: string) => void): void {
    // When file is not image, then warn
    if (!imageFile.type.match("image.*")) {
      alert("Select image file");
      return;
    }

    // Read image and emit uploaded image url
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string")
        throw new Error("Image reading failed");
      onLoad(reader.result);
    };
    reader.readAsDataURL(imageFile);
  }

  @Emit()
  private imageChange(imageId: string, imageURL: string) {}
}
</script>

<style scoped></style>
