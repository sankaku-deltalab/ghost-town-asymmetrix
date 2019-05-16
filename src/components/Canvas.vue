<template>
  <div class="expanded">
    <canvas ref="viewerCanvas" class="viewer-canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import * as ex from "excalibur";
import { GameManager } from "../canvas-game/game-manager";
import { ImageId } from "@/util";

interface NWAndSize {
  nw: ex.Vector;
  size: ex.Vector;
}

@Component({})
export default class Toolbar extends Vue {
  private canvas!: HTMLCanvasElement;
  private exportCanvas!: HTMLCanvasElement;
  private gameManager!: GameManager;

  public mounted() {
    const h = this.$parent.$el.clientHeight - 100;
    const w = this.$parent.$el.clientWidth;
    this.canvas = this.$refs.viewerCanvas as HTMLCanvasElement;
    this.canvas.width = w;
    this.canvas.height = h;
    this.gameManager = new GameManager(this.canvas);

    this.exportCanvas = document.createElement("canvas");
  }

  public imageChange(imageId: ImageId, imageURL: string): void {
    this.gameManager.imageChange(imageId, imageURL);
  }

  public changeCharacterName(name: string): void {
    this.gameManager.changeCharacterName(name);
  }

  public changeColor(color: string): void {
    this.gameManager.changeColor(color);
  }

  public async exportImageAsCard(): Promise<string> {
    const frameNW = this.gameManager.getRawFrameNW();
    const frameSize = this.gameManager.getRawFrameSize();
    return await this.exportImageWithoutFrame(
      { nw: frameNW, size: frameSize },
      ex.Vector.Zero,
      frameSize
    );
  }

  public async exportImageRaw(): Promise<string> {
    const canvasSize = this.gameManager.getRawCanvasSize();
    return await this.exportImageWithoutFrame(
      { nw: ex.Vector.Zero, size: canvasSize },
      ex.Vector.Zero,
      canvasSize
    );
  }

  public async exportImageAsPhoto(): Promise<string> {
    const canvasSizePX = this.gameManager.getRawCanvasSize();
    const src = {
      nw: ex.Vector.Zero,
      size: canvasSizePX
    };

    const photoSizeMilli = new ex.Vector(89, 127);
    const nesicaSizeMilli = new ex.Vector(55, 85);
    const nesicaSizePX = this.gameManager.getRawFrameSize();
    const photoSizePX = new ex.Vector(
      photoSizeMilli.x * (nesicaSizePX.x / nesicaSizeMilli.x),
      photoSizeMilli.y * (nesicaSizePX.y / nesicaSizeMilli.y)
    );
    const photoNW = photoSizePX.sub(canvasSizePX).scale(0.5);

    return await this.exportImageWithoutFrame(src, photoNW, photoSizePX);
  }

  private async exportImageWithoutFrame(
    src: { nw: ex.Vector; size: ex.Vector },
    destNW: ex.Vector,
    exportSize: ex.Vector
  ): Promise<string> {
    // 別キャンバスのサイズを変更
    this.exportCanvas.width = exportSize.x;
    this.exportCanvas.height = exportSize.y;

    // キャンバスのフレームを一時的に消す
    await this.gameManager.hideFrame();

    // フレームが消えたらキャンバスを別キャンバスへコピー
    const ctx = this.exportCanvas.getContext("2d");
    if (ctx === null) throw new Error("can not get exportCanvas context");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, exportSize.x, exportSize.y);
    ctx.drawImage(
      this.canvas,
      src.nw.x,
      src.nw.y,
      src.size.x,
      src.size.y,
      destNW.x,
      destNW.y,
      src.size.x,
      src.size.y
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
}
.viewer-canvas {
  padding: 0px;
}
</style>
