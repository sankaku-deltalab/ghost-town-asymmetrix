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

@Component({
  components: {
    ImageUploadButton
  }
})
export default class Settings extends Vue {
  private buttonInfoArray: { id: string; name: string }[] = [
    { id: "logo", name: "Title logo" },
    { id: "character", name: "Character" },
    { id: "mech", name: "Machine" }
  ];

  private pickFile() {
    (this.$refs.image as HTMLInputElement).click();
  }

  @Emit()
  private imageChange(imageId: string, imageURL: string) {}
}
</script>

<style scoped></style>
