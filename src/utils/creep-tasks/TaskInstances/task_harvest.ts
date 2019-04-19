import { Task } from "../Task";

export type harvestTargetType = Source | Mineral;

function isSource(obj: Source | Mineral): obj is Source {
  return (<Source>obj).energy != undefined;
}

export class TaskHarvest extends Task {
  static taskName = "harvest";
  target!: harvestTargetType;

  constructor(target: harvestTargetType, options = {} as TaskOptions) {
    super(TaskHarvest.taskName, target, options);
  }

  isValidTask() {
    return _.sum(this.creep.carry) < this.creep.carryCapacity;
  }

  isValidTarget() {
    if (isSource(this.target)) {
      return this.target.energy > 0;
    } else {
      return this.target.mineralAmount > 0;
    }
  }

  work() {
    return this.creep.harvest(this.target);
  }
}
