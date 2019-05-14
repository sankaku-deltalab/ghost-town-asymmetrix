<template>
  <v-card>
    <pre>{{ license }}</pre>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from "vue-property-decorator";
import jewelLicense from "raw-loader!@/assets/jewel-savior-license.txt";
import packageLicenses from "raw-loader!@/assets/package-licenses.txt";

@Component({})
export default class License extends Vue {
  private license: string = jewelLicense + "-----\n" + packageLicenses;
}
</script>

<style scoped></style>
