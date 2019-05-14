<template>
  <v-form>
    <!-- Character name -->
    <!-- color -->
    <ImageUploadButton
      v-for="info of buttonInfoArray"
      v-bind:id="info.id"
      v-bind:name="info.name"
      v-on:image-change="imageChange"
      v-bind:key="info.id"
    />
  </v-form>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator";
import ImageUploadButton from "./ImageUploadButton.vue";
import { ImageId } from "@/util";

@Component({
  components: {
    ImageUploadButton
  }
})
export default class Settings extends Vue {
  private buttonInfoArray: { id: ImageId; name: string }[] = [
    { id: ImageId.titleLogo, name: "Title logo" },
    { id: ImageId.character, name: "Character" },
    { id: ImageId.mech, name: "Back Character" }
  ];

  private pickFile() {
    (this.$refs.image as HTMLInputElement).click();
  }

  @Emit()
  private imageChange(imageId: ImageId, imageURL: string) {}
}
</script>

<style scoped></style>
