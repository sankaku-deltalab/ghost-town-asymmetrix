import * as ex from "excalibur";

export interface FigureActorArgs extends ex.IActorArgs {
  name: string;
  defaultFigurePath: string;
  initialSize: { x: number; y: number };
}

export class FigureActor extends ex.Actor {
  private name: string;
  protected currentTexture!: ex.Texture;
  private currentTextureScale: number = 1;
  protected initialSize: { x: number; y: number };

  constructor(config: FigureActorArgs) {
    super(config);
    this.name = config.name;
    this.collisionType = ex.CollisionType.Passive;
    this.color = ex.Color.Magenta;
    this.initialSize = config.initialSize;

    this.setTexture(config.defaultFigurePath);
  }

  public setTexture(texturePath: string): ex.Texture {
    const texture = new ex.Texture(texturePath);
    const loading = async () => {
      await texture.load();
      const newTextureScale = Math.max(
        texture.width / this.initialSize.x,
        texture.height / this.initialSize.y
      );
      this.currentDrawing = texture.asSprite();
      this.setWidth(texture.width * this.scale.x);
      this.setHeight(texture.height * this.scale.y);
      this.scale = this.scale.scale(this.currentTextureScale / newTextureScale);
      this.currentTextureScale = newTextureScale;
    };
    loading();
    this.currentTexture = texture;
    return texture;
  }
}
