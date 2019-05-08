import * as ex from "excalibur";

export class ActorTransformer {
  private grabbingActorInner: ex.Actor | null;
  private currentPointerPosition: ex.Vector | null;

  constructor() {
    this.grabbingActorInner = null;
    this.currentPointerPosition = null;
  }

  public get grabbingActor(): ex.Actor | null {
    return this.grabbingActorInner;
  }

  public grab(grabbedActor: ex.Actor, pointerPosition: ex.Vector): void {
    this.grabbingActorInner = grabbedActor;
    this.currentPointerPosition = pointerPosition;
  }

  public release(): void {
    this.grabbingActorInner = null;
    this.currentPointerPosition = null;
  }

  public notifyGrabPointerWasMovedTo(movedPointerPosition: ex.Vector): void {
    if (this.grabbingActorInner === null) return;
    if (this.currentPointerPosition === null) return;

    const delta = movedPointerPosition.sub(this.currentPointerPosition);
    this.currentPointerPosition = movedPointerPosition;
    this.grabbingActorInner.x += delta.x;
    this.grabbingActorInner.y += delta.y;
  }
}
