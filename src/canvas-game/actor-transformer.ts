import * as ex from "excalibur";

/**
 * Transform actor.
 *
 * ```typescript
 * import * as ex from "excalibur";
 *
 * const actor = new ex.Actor({ x: 0, y: 0 });
 * const trans = new ActorTransformer();
 * trans.grab(actor, ex.Vector(1, 2));
 * trans.notifyGrabPointerWasMovedTo(ex.Vector(1, 0));
 * trans.release();
 * actor.x;  // 0
 * actor.y;  // -2
 * ```
 */
export class ActorTransformer {
  private previousGrabbedActor: ex.Actor | null;
  private grabbingActorInner: ex.Actor | null;
  private currentPointerPosition: ex.Vector | null;

  constructor() {
    this.previousGrabbedActor = null;
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
    if (this.grabbingActorInner === null) return;
    this.previousGrabbedActor = this.grabbingActorInner;
    this.grabbingActorInner = null;
    this.currentPointerPosition = null;
  }

  public addScaleGrabbed(add: number): void {
    if (this.previousGrabbedActor === null) return;
    this.previousGrabbedActor.scale = this.previousGrabbedActor.scale.add(
      new ex.Vector(add, add)
    );
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

/**
 * Bind game pointer move event to ActorTransformer.
 *
 * @param trans
 * @param game
 */
export const setupActorTransformer = (
  trans: ActorTransformer,
  game: ex.Engine
): void => {
  game.input.pointers.primary.on(
    "move",
    (ev): void => {
      if (!(ev instanceof ex.Input.PointerEvent)) {
        return;
      }
      trans.notifyGrabPointerWasMovedTo(ev.screenPos);
    }
  );

  game.input.pointers.primary.on("wheel", ev => {
    if (!(ev instanceof ex.Input.WheelEvent)) {
      return;
    }
    if (ev.deltaY !== 0) {
      trans.addScaleGrabbed(-ev.deltaY / 5000);
    }
  });
};

/**
 * Set actor to touched then grabbed.
 *
 * @param trans
 * @param actor
 */
export const enableGrabbing = (
  trans: ActorTransformer,
  actor: ex.Actor
): void => {
  // Enable move event
  actor.on(
    "pointerdown",
    (ev): void => {
      if (!(ev instanceof ex.Input.PointerEvent)) {
        return;
      }
      trans.grab(actor, ev.screenPos);
    }
  );
  actor.on(
    "pointerup",
    (ev): void => {
      if (ev === undefined) return;
      trans.release();
    }
  );
  // TODO: enable scaling
};
