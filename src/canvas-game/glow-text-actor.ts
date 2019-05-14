import * as ex from "excalibur";
import { defaultColor } from "@/util";

export class GlowTextActor extends ex.Actor {
  public glowColor: string;
  private text: string;
  private fontSize: number;

  constructor(text: string, fontSize: number, config: ex.IActorArgs) {
    super(config);

    this.fontSize = fontSize;
    this.text = text;
    this.glowColor = defaultColor;
    this.anchor = new ex.Vector(0, 1);
    this.rotation = Math.PI / 2;
    this.setHeight(this.fontSize);
  }

  public setText(text: string): void {
    this.text = text;
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number): void {
    super.draw(ctx, delta);

    ctx.save();
    this.drawText(ctx);
    ctx.restore();
  }

  public drawText(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale.x, this.scale.y);

    ctx.shadowBlur = 10;
    ctx.shadowColor = this.glowColor;
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = `${this.fontSize}px sans-serif`;
    ctx.fillText(this.text, 0, 0);

    const textSize = ctx.measureText(this.text);
    this.setWidth(textSize.width);
    // this.setHeight(textSize.fontBoundingBoxAscent);
  }
}
