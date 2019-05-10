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
import logoImage from "@/assets/title-logo.png";
import charImage from "@/assets/f066.png";
import mechImage from "@/assets/f054.png";
import backgroundImage from "@/assets/background_frame_set.png";
import { GlowTextActor } from "./glow-text-actor";
import { Vector } from "excalibur";

export class GameManager {
  private game: ex.Engine;

  constructor(canvas: HTMLCanvasElement) {
    const game = this.createGame(canvas);
    this.game = game;

    const scene = new ex.Scene(game);
    const canvasSize = new ex.Vector(game.drawWidth, game.drawHeight);

    // Create transformer
    const trans = new ActorTransformer();
    setupActorTransformer(trans, game);

    // Add frame
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
    scene.add(frame);
    frame.setZIndex(5);

    // Add logo
    const logoPos = mat.applyToPoint(frameTrans, { x: 0, y: 0.25 });
    const logo = new FigureActor({
      name: "logo",
      defaultFigurePath: logoImage,
      initialSize: frameSize,
      x: logoPos.x,
      y: logoPos.y,
      width: 50,
      height: 50
    });
    scene.add(logo);
    enableGrabbing(trans, logo);
    logo.setZIndex(5);

    // Add character name
    const namePos = mat.applyToPoint(frameTrans, { x: -0.45, y: -0.125 });
    const nameActor = new GlowTextActor("Asuha", {
      x: namePos.x,
      y: namePos.y,
      scale: new Vector(2, 2),
      width: 50,
      height: 50
    });
    scene.add(nameActor);
    enableGrabbing(trans, nameActor);
    nameActor.setZIndex(4);

    // Add character
    const charPos = mat.applyToPoint(frameTrans, { x: -0.2, y: 0.125 });
    const char = new FigureActor({
      name: "char",
      defaultFigurePath: charImage,
      initialSize: frameSize.scale(1.25),
      x: charPos.x,
      y: charPos.y,
      width: 50,
      height: 50
    });
    scene.add(char);
    enableGrabbing(trans, char);
    char.setZIndex(3);

    // Add background
    const backgroundPos = mat.applyToPoint(frameTrans, { x: 0, y: 0 });
    const background = new FigureActor({
      name: "background",
      defaultFigurePath: backgroundImage,
      initialSize: frameSize.scale(1.25),
      x: backgroundPos.x,
      y: backgroundPos.y
    });
    scene.add(background);
    background.setZIndex(2);

    // Add Mech
    const mechPos = mat.applyToPoint(frameTrans, { x: 0.25, y: 0.125 });
    const mech = new MechFigureActor({
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
    scene.add(mech);
    enableGrabbing(trans, mech);
    mech.setZIndex(1);

    this.game.addScene("main", scene);
    this.game.start();
    this.game.goToScene("main");
  }

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
}
