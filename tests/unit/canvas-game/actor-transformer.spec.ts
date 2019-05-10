import * as ex from "excalibur";
import { simpleMock } from "../util";
import { ActorTransformer } from "@/canvas-game/actor-transformer";

describe("ActorTransformer", (): void => {
  it("can grab actor", (): void => {
    // Given Actor
    const initialActorLocation = new ex.Vector(-1, -1.2);
    const actor = simpleMock<ex.Actor>();
    actor.x = initialActorLocation.x;
    actor.y = initialActorLocation.y;

    // And ActorTransformer
    const trans = new ActorTransformer();

    // When ActorTransformer grab Actor
    const grabPoint = new ex.Vector(-1, -1.2);
    trans.grab(actor, grabPoint);

    // Then grab actor
    expect(trans.grabbingActor).toBe(actor);
  });

  it("can override grabbing", (): void => {
    // Given 2 Actors
    const oldActor = simpleMock<ex.Actor>();
    const newActor = simpleMock<ex.Actor>();

    // And ActorTransformer
    const trans = new ActorTransformer();

    // When grab first actor
    const grabPoint = new ex.Vector(0, 0);
    trans.grab(oldActor, grabPoint);

    // And grab second actor
    trans.grab(newActor, grabPoint);

    // Then ActorTransformer grabbing second actor
    expect(trans.grabbingActor).toBe(newActor);
  });

  it("can move actor", (): void => {
    // Given Actor
    const initialActorLocation = new ex.Vector(-1, -1.2);
    const actor = simpleMock<ex.Actor>();
    actor.x = initialActorLocation.x;
    actor.y = initialActorLocation.y;

    // And ActorTransformer
    const trans = new ActorTransformer();

    // When ActorTransformer grab Actor
    const grabPoint = new ex.Vector(-1, -1.2);
    trans.grab(actor, grabPoint);

    // And move pointer
    const pointerMoveDelta = new ex.Vector(-1, -1.2);
    const movedGrabPoint = grabPoint.add(pointerMoveDelta);
    trans.notifyGrabPointerWasMovedTo(movedGrabPoint);

    // Then actor was moved
    const expectedLocation = initialActorLocation.add(pointerMoveDelta);
    expect(actor.x).toBeCloseTo(expectedLocation.x);
    expect(actor.y).toBeCloseTo(expectedLocation.y);
  });

  it("can move actor many times", (): void => {
    // Given Actor
    const initialActorLocation = new ex.Vector(-1, -1.2);
    const actor = simpleMock<ex.Actor>();
    actor.x = initialActorLocation.x;
    actor.y = initialActorLocation.y;

    // And ActorTransformer
    const trans = new ActorTransformer();

    // When ActorTransformer grab Actor
    const grabPoint = new ex.Vector(-1, -1.2);
    trans.grab(actor, grabPoint);

    // And move pointer
    const pointerMoveDeltas = [
      new ex.Vector(-1, -1.2),
      new ex.Vector(-1, -1.2),
      new ex.Vector(-1, -1.2)
    ];
    let movingGrabPoint = grabPoint.clone();
    for (const delta of pointerMoveDeltas) {
      const previousLocation = new ex.Vector(actor.x, actor.y);
      movingGrabPoint = movingGrabPoint.add(delta);
      trans.notifyGrabPointerWasMovedTo(movingGrabPoint);

      // Then actor was moved
      const expectedLocation = previousLocation.add(delta);
      expect(actor.x).toBeCloseTo(expectedLocation.x);
      expect(actor.y).toBeCloseTo(expectedLocation.y);
    }
  });

  it("can override grabbing", (): void => {
    // Given Actor
    const initialActorLocation = new ex.Vector(-1, -1.2);
    const actor = simpleMock<ex.Actor>();
    actor.x = initialActorLocation.x;
    actor.y = initialActorLocation.y;

    // And ActorTransformer
    const trans = new ActorTransformer();

    // And release actor
    const releasing = () => trans.release();

    // Then do not effect
    expect(releasing).not.toThrowError();
  });

  it("can not move actor after released", (): void => {
    // Given Actor
    const initialActorLocation = new ex.Vector(-1, -1.2);
    const actor = simpleMock<ex.Actor>();
    actor.x = initialActorLocation.x;
    actor.y = initialActorLocation.y;

    // And ActorTransformer
    const trans = new ActorTransformer();

    // When ActorTransformer grab Actor
    const grabPoint = new ex.Vector(-1, -1.2);
    trans.grab(actor, grabPoint);

    // And release actor
    trans.release();

    // And move pointer
    const pointerMoveDelta = new ex.Vector(-1, -1.2);
    const movedGrabPoint = grabPoint.add(pointerMoveDelta);
    trans.notifyGrabPointerWasMovedTo(movedGrabPoint);

    // Then actor was not moved
    expect(actor.x).toBeCloseTo(initialActorLocation.x);
    expect(actor.y).toBeCloseTo(initialActorLocation.y);
  });

  it("do not effect if release before grabbing", (): void => {
    // Given Actor
    const initialActorLocation = new ex.Vector(-1, -1.2);
    const actor = simpleMock<ex.Actor>();
    actor.x = initialActorLocation.x;
    actor.y = initialActorLocation.y;

    // And ActorTransformer
    const trans = new ActorTransformer();

    // When release actor
    const releasing = () => trans.release();

    // Then do not effect
    expect(releasing).not.toThrowError();
  });
});
