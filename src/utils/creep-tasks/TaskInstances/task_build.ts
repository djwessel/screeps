// TaskBuild: builds a construction site until creep has no energy or site is complete

import { Task } from "../Task";

export type buildTargetType = ConstructionSite;

export class TaskBuild extends Task {
  static taskName = "build";
  target!: buildTargetType;

  constructor(target: buildTargetType, options = {} as TaskOptions) {
    super(TaskBuild.taskName, target, options);
    // Settings
    this.settings.targetRange = 3;
    this.settings.workOffRoad = true;
  }

  isValidTask() {
    return this.creep.carry.energy > 0;
  }

  isValidTarget() {
    return this.target && this.target.my && this.target.progress < this.target.progressTotal;
  }

  work() {
    /* TODO
    if (!this.target.isWalkable) {
      let creepOnTarget = this.target.pos.lookFor(LOOK_CREEPS)[0];
      if (creepOnTarget) {
        const zerg = Overmind.zerg[creepOnTarget.name];
        if (zerg) {
          this.creep.say("move pls");
          zerg.moveOffCurrentPos();
        }
      }
    }
     */

    return this.creep.build(this.target);
  }
}
