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
  private nameActor: GlowTextActor;
  private charActor: FigureActor;
  private mechActor: FigureActor;
  private logoActor: FigureActor;

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
    scene.add(frame);
    frame.setZIndex(5);
    const frameSize = new ex.Vector(frame.getWidth(), frame.getHeight());

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
    this.nameActor = this.createCharacterNameActor(frameTrans);
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

  public updateCharacterName(name: string): void {}

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

  private createCharacterNameActor(frameTrans: mat.Matrix): GlowTextActor {
    const namePos = mat.applyToPoint(frameTrans, { x: -0.45, y: -0.125 });
    return new GlowTextActor("Asuha", {
      x: namePos.x,
      y: namePos.y,
      scale: new ex.Vector(2, 2),
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
