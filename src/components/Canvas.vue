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
  private exportCanvas!: HTMLCanvasElement;
  private gameManager!: GameManager;

  public mounted() {
    const h = this.$parent.$el.clientHeight;
    const w = this.$parent.$el.clientWidth;
    this.canvas = this.$refs.viewerCanvas as HTMLCanvasElement;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gameManager = new GameManager(this.canvas);

    this.exportCanvas = document.createElement("canvas");
  }

  public async exportImageAsCard(): Promise<string> {
    // 別キャンバスのサイズを変更
    const frameSize = this.gameManager.getRawFrameSize();
    this.exportCanvas.width = frameSize.x;
    this.exportCanvas.height = frameSize.y;

    // キャンバスのフレームを一時的に消す
    await this.gameManager.hideFrame();

    // フレームが消えたらキャンバスを別キャンバスへコピー
    const ctx = this.exportCanvas.getContext("2d");
    if (ctx === null) throw new Error("can not get exportCanvas context");
    const frameNW = this.gameManager.getRawFrameNW();
    ctx.fillRect(0, 0, frameSize.x, frameSize.y);
    ctx.drawImage(
      this.canvas,
      frameNW.x,
      frameNW.y,
      frameSize.x,
      frameSize.y,
      0,
      0,
      frameSize.x,
      frameSize.y
    );

    // フレームを再表示
    this.gameManager.unhideFrame();

    return this.exportCanvas.toDataURL("png");
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
