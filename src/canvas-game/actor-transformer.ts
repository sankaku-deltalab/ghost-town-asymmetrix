import * as ex from "excalibur";
import * as mat from "transformation-matrix";

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
  private pinchPointerPosition: ex.Vector | null;
  private pinchLength: number;

  constructor() {
    this.previousGrabbedActor = null;
    this.grabbingActorInner = null;
    this.currentPointerPosition = null;
    this.pinchPointerPosition = null;
    this.pinchLength = 0;
  }

  public get grabbingActor(): ex.Actor | null {
    return this.grabbingActorInner;
  }

  public grab(grabbedActor: ex.Actor, pointerPosition: ex.Vector): void {
    if (this.grabbingActorInner !== null) return;
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
    if (this.grabbingActorInner !== null) {
      this.scaleActor(this.grabbingActorInner, add);
    } else if (this.previousGrabbedActor !== null) {
      this.scaleActor(this.previousGrabbedActor, add);
    }
  }

  private scaleActor(actor: ex.Actor, add: number): void {
    actor.scale = actor.scale.add(new ex.Vector(add, add));
  }

  public setPinchTouch(pointerPosition: ex.Vector): void {
    if (
      this.grabbingActorInner === null ||
      this.currentPointerPosition === null
    )
      return;
    this.pinchPointerPosition = pointerPosition;
    this.pinchLength = pointerPosition.distance(this.currentPointerPosition);
  }

  public notifySecondPointerMoved(pointerPosition: ex.Vector): void {
    if (
      this.grabbingActorInner === null ||
      this.currentPointerPosition === null
    )
      return;
    const currentPinchLength = pointerPosition.distance(
      this.currentPointerPosition
    );
    const scaling = currentPinchLength / this.pinchLength;
    this.grabbingActorInner.scale = this.grabbingActorInner.scale.scale(
      scaling
    );

    this.pinchPointerPosition = pointerPosition;
    this.pinchLength = currentPinchLength;
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
  game.input.pointers.at(0).on(
    "move",
    (ev): void => {
      if (!(ev instanceof ex.Input.PointerEvent)) {
        return;
      }
      trans.notifyGrabPointerWasMovedTo(ev.screenPos);
    }
  );

  game.input.pointers.at(1).on(
    "down",
    (ev): void => {
      if (!(ev instanceof ex.Input.PointerEvent)) {
        return;
      }
      trans.setPinchTouch(ev.screenPos);
    }
  );

  game.input.pointers.at(1).on(
    "move",
    (ev): void => {
      if (!(ev instanceof ex.Input.PointerEvent)) {
        return;
      }
      trans.notifySecondPointerMoved(ev.screenPos);
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
