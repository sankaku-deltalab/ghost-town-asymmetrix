import * as ex from "excalibur";

export class FrameActor extends ex.Actor {
  private canvasSize: ex.Vector;

  constructor(canvasSize: ex.Vector, config: ex.IActorArgs) {
    super(config);
    this.canvasSize = canvasSize;
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number): void {
    super.draw(ctx, delta);
    this.drawInnerFrame(ctx);
  }

  private drawInnerFrame(ctx: CanvasRenderingContext2D): void {
    const w = this.getWidth();
    const h = this.getHeight();
    const nw = new ex.Vector(
      (this.canvasSize.x - w) / 2,
      (this.canvasSize.y - h) / 2
    );

    ctx.strokeRect(nw.x, nw.y, w, h);
  }
}
