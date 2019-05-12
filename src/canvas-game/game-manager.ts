import * as ex from "excalibur";
import * as mat from "transformation-matrix";
import { FigureActor } from "./figure-actor";
import {
  ActorTransformer,
  setupActorTransformer,
  enableGrabbing
} from "./actor-transformer";
import { MechFigureActor } from "./mech-figure-actor";
import { FrameActor } from "./frame-actor";
import { GlowTextActor } from "./glow-text-actor";
import logoImage from "@/assets/title-logo.png";
import charImage from "@/assets/f066.png";
import mechImage from "@/assets/f054.png";
import backgroundImage from "@/assets/background_frame_set.png";

export class GameManager {
  private game: ex.Engine;
  private frameActor: FrameActor;
  private nameActor: GlowTextActor;
  private charActor: FigureActor;
  private mechActor: FigureActor;
  private logoActor: FigureActor;
  private frameNW: ex.Vector;
  private frameSize: ex.Vector;

  constructor(canvas: HTMLCanvasElement) {
    const game = this.createGame(canvas);
    this.game = game;

    const scene = new ex.Scene(game);
    const canvasSize = new ex.Vector(game.drawWidth, game.drawHeight);

    // Create transformer
    const trans = new ActorTransformer();
    setupActorTransformer(trans, game);

    // Add frame
    const [frame, frameTrans] = this.createFrameActor(canvasSize);
    this.frameActor = frame;
    scene.add(frame);
    frame.setZIndex(5);
    const frameSize = new ex.Vector(frame.getWidth(), frame.getHeight());
    this.frameSize = frameSize;
    const frameNW = mat.applyToPoint(frameTrans, { x: -0.5, y: -0.5 });
    this.frameNW = new ex.Vector(frameNW.x, frameNW.y);

    // Add logo
    this.logoActor = this.createFigureActor(
      "logo",
      { x: 0, y: 0.25 },
      1,
      logoImage,
      frameSize,
      frameTrans
    );
    scene.add(this.logoActor);
    enableGrabbing(trans, this.logoActor);
    this.logoActor.setZIndex(5);

    // Add character name
    this.nameActor = this.createCharacterNameActor(frameSize, frameTrans);
    scene.add(this.nameActor);
    enableGrabbing(trans, this.nameActor);
    this.nameActor.setZIndex(4);

    // Add character
    this.charActor = this.createFigureActor(
      "char",
      { x: -0.2, y: 0.125 },
      1.25,
      charImage,
      frameSize,
      frameTrans
    );
    scene.add(this.charActor);
    enableGrabbing(trans, this.charActor);
    this.charActor.setZIndex(3);

    // Add background
    const background = this.createFigureActor(
      "background",
      { x: 0, y: 0 },
      1.25,
      backgroundImage,
      frameSize,
      frameTrans
    );
    scene.add(background);
    background.setZIndex(2);

    // Add Mech
    this.mechActor = this.createMechActor(canvasSize, frameSize, frameTrans);
    scene.add(this.mechActor);
    enableGrabbing(trans, this.mechActor);
    this.mechActor.setZIndex(1);

    this.game.addScene("main", scene);
    this.game.start();
    this.game.goToScene("main");
  }

  public getRawFrameNW(): ex.Vector {
    return this.frameNW.scale(this.game.pixelRatio);
  }

  public getRawFrameSize(): ex.Vector {
    return this.frameSize.scale(this.game.pixelRatio);
  }

  public getRawCanvasSize(): ex.Vector {
    return new ex.Vector(this.game.drawWidth, this.game.drawHeight).scale(
      this.game.pixelRatio
    );
  }

  public async hideFrame(): Promise<void> {
    this.frameActor.visible = false;
    await new Promise(resolve => {
      const drawnCallback = (_event?: ex.PostDrawEvent): void => {
        this.game.off("postdraw", drawnCallback);
        resolve();
      };
      this.game.on("postdraw", drawnCallback);
    });
  }

  public unhideFrame(): void {
    this.frameActor.visible = true;
  }

  public updateCharacterName(name: string): void {}

  public updateMainColor(color: string): void {}

  public updateLogoFigure(figPath: string): void {}

  public updateCharacterFigure(figPath: string): void {}

  public updateMechFigure(figPath: string): void {}

  private createGame(canvas: HTMLCanvasElement): ex.Engine {
    // Override document.getElementById
    // because ex.Engine use it but vue override it
    const originalGetElementById = document.getElementById;
    document.getElementById = () => canvas;

    const game = new ex.Engine({
      width: canvas.width,
      height: canvas.height,
      canvasElementId: "__anyId",
      pointerScope: ex.Input.PointerScope.Canvas,
      backgroundColor: ex.Color.DarkGray,
      suppressConsoleBootMessage: true
    });

    document.getElementById = originalGetElementById;

    return game;
  }

  private createFrameActor(canvasSize: ex.Vector): [FrameActor, mat.Matrix] {
    const nesicaSize = new ex.Vector(55, 85); // Nesica is 55 x 85 mm
    const canvasSizePerNecisa = new ex.Vector(
      canvasSize.x / nesicaSize.x,
      canvasSize.y / nesicaSize.y
    );
    const frameScale =
      0.8 * Math.min(canvasSizePerNecisa.x, canvasSizePerNecisa.y);
    const frameSize = nesicaSize.scale(frameScale);
    // coordinates is [-0.5, 0.5]^2
    const frameTrans = mat.transform(
      mat.translate(this.game.drawWidth / 2, this.game.drawHeight / 2),
      mat.scale(frameSize.x, frameSize.y)
    );
    const framePos = mat.applyToPoint(frameTrans, { x: 0, y: 0 });
    const frame = new FrameActor(canvasSize, {
      x: framePos.x,
      y: framePos.y,
      width: frameSize.x,
      height: frameSize.y
    });
    return [frame, frameTrans];
  }

  private createFigureActor(
    name: string,
    position: mat.Point,
    initialSizeScale: number,
    figurePath: string,
    frameSize: ex.Vector,
    frameTrans: mat.Matrix
  ): FigureActor {
    const pos = mat.applyToPoint(frameTrans, position);
    return new FigureActor({
      name,
      defaultFigurePath: figurePath,
      initialSize: frameSize.scale(initialSizeScale),
      x: pos.x,
      y: pos.y,
      width: 50,
      height: 50
    });
  }

  private createCharacterNameActor(
    frameSize: ex.Vector,
    frameTrans: mat.Matrix
  ): GlowTextActor {
    const fontSize = 40;
    const namePos = mat.applyToPoint(frameTrans, { x: -0.45, y: -0.125 });
    return new GlowTextActor("Asuha", fontSize, {
      x: namePos.x,
      y: namePos.y,
      scale: ex.Vector.One.scale(frameSize.x / (8 * fontSize)),
      width: 50,
      height: 50
    });
  }

  private createMechActor(
    canvasSize: ex.Vector,
    frameSize: ex.Vector,
    frameTrans: mat.Matrix
  ): MechFigureActor {
    const mechPos = mat.applyToPoint(frameTrans, { x: 0.25, y: 0.125 });
    return new MechFigureActor({
      canvasSize,
      name: "mech",
      defaultFigurePath: mechImage,
      initialSize: frameSize.scale(2),
      maskSizeMin: frameSize.scale(1.25),
      x: mechPos.x,
      y: mechPos.y,
      width: 50,
      height: 50
    });
  }
}
