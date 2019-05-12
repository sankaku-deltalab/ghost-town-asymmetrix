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
    const frameNW = this.gameManager.getRawFrameNW();
    const frameSize = this.gameManager.getRawFrameSize();
    return await this.exportImageWithoutFrame(frameNW, frameSize);
  }

  private async exportImageWithoutFrame(
    nw: ex.Vector,
    size: ex.Vector
  ): Promise<string> {
    // 別キャンバスのサイズを変更
    this.exportCanvas.width = size.x;
    this.exportCanvas.height = size.y;

    // キャンバスのフレームを一時的に消す
    await this.gameManager.hideFrame();

    // フレームが消えたらキャンバスを別キャンバスへコピー
    const ctx = this.exportCanvas.getContext("2d");
    if (ctx === null) throw new Error("can not get exportCanvas context");
    ctx.fillRect(0, 0, size.x, size.y);
    ctx.drawImage(
      this.canvas,
      nw.x,
      nw.y,
      size.x,
      size.y,
      0,
      0,
      size.x,
      size.y
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
