<template>
  <div class="expanded">
    <canvas ref="viewerCanvas" class="viewer-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { GameManager } from "../canvas-game/game-manager";

@Component({})
export default class Toolbar extends Vue {
  private canvas!: HTMLCanvasElement;
  private gameManager!: GameManager;

  public mounted() {
    const h = this.$parent.$el.clientHeight;
    const w = this.$parent.$el.clientWidth;
    this.canvas = this.$refs.viewerCanvas as HTMLCanvasElement;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gameManager = new GameManager(this.canvas);
  }
}
</script>

<style scoped>
.expanded {
  padding: 0px;
  height: 100%;
}
.viewer-canvas {
  padding: 0px;
}
</style>
