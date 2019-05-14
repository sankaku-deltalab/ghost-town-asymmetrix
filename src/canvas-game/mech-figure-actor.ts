import * as ex from "excalibur";
import { FigureActor } from "./figure-actor";
import { FigureActorArgs } from "./figure-actor";
import mechMaskImage from "@/assets/honeycomb_hikari.png";
import { defaultColor } from "@/util";

export interface MechFigureActorArgs extends FigureActorArgs {
  canvasSize: ex.Vector;
  maskSizeMin: ex.Vector;
}

export class MechFigureActor extends FigureActor {
  public maskColor: string;
  private maskImg: HTMLImageElement;
  private canvasSize: ex.Vector;
  private maskSizeMin: ex.Vector;

  constructor(config: MechFigureActorArgs) {
    super(config);

    const maskImg = new Image();
    maskImg.src = mechMaskImage;
    this.maskImg = maskImg;
    this.maskColor = defaultColor;
    this.canvasSize = config.canvasSize;
    this.maskSizeMin = config.maskSizeMin;
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number): void {
    ctx.save();

    // Draw mech
    super.draw(ctx, delta);

    // Draw color
    ctx.fillStyle = this.maskColor + "55";
    ctx.fillRect(0, 0, this.canvasSize.x, this.canvasSize.y);

    this.drawMask(ctx);

    ctx.restore();
  }

  private drawMask(ctx: CanvasRenderingContext2D) {
    this.maskSizeMin;
    const originalOp = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "destination-in";

    const maskScale = Math.max(
      this.maskSizeMin.x / this.maskImg.width,
      this.maskSizeMin.y / this.maskImg.height
    );
    const maskSize = new ex.Vector(
      this.maskImg.width * maskScale,
      this.maskImg.height * maskScale
    );
    const nw = new ex.Vector(
      (this.canvasSize.x - maskSize.x) / 2,
      (this.canvasSize.y - maskSize.y) / 2
    );

    ctx.drawImage(this.maskImg, nw.x, nw.y, maskSize.x, maskSize.y);

    ctx.globalCompositeOperation = originalOp;
  }
}
