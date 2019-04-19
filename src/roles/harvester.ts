import { Tasks } from "../utils/creep-tasks/Tasks";
import { transferTargetType } from "../utils/creep-tasks/TaskInstances/task_transfer";
import { getSourceInfo, isDepositTarget } from "../utils/helperFunctions";

export class RoleHarvester {
  public static roleName: string = "harvester";
  public static priority: boolean = true;

  public static numRequired(room: Room): number {
    let sourceInfo = getSourceInfo(room);

    let num = 0;
    let max = sourceInfo.sourceCapacity + sourceInfo.numSources;
    let level = room.controller ? room.controller.level : 0;
    switch (level) {
      case 1:
        num = max;
        break;
      case 2:
        num = max;
        break;
      case 3:
        num = max;
        break;
      case 4:
        num = max;
        break;
      case 5:
        num = max;
        break;
      case 6:
        num = max;
        break;
      case 7:
        num = max;
        break;
      case 8:
        num = max;
        break;
    }
    return num;
  }

  public static getBody(room: Room): BodyPartConstant[] {
    let body: BodyPartConstant[] = [];
    let capacity = room.energyCapacityAvailable;
    /*
    case (capacity >= 12900):
    case (capacity >= 5600):
    case (capacity >= 2300):
     */
    if (capacity >= 1800) {
      body = [
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE
      ]; // 1800
    } else if (capacity >= 1300) {
      body = [
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        WORK,
        CARRY,
        MOVE,
        CARRY,
        MOVE
      ]; // 1300
    } else if (capacity >= 800) {
      body = [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE]; // 800
    } else if (capacity >= 550) {
      body = [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, MOVE]; // 550
    } else {
      body = [WORK, CARRY, MOVE, WORK]; // 300
    }
    return body;
  }

  public static newTask(creep: Creep): void {
    if (creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
      creep.memory.working = false;
    } else if (!creep.memory.working && _.sum(creep.carry) === 0) {
      creep.memory.working = true;
    }

    if (creep.memory.working) {
      let sourceInfo = getSourceInfo(creep.room);

      let sources = creep.room.find(FIND_SOURCES);
      sources.sort((a, b) => {
        let aTargetedRatio = a.targetedBy.length / sourceInfo.sourceCounts[a.id];
        let bTargetedRatio = b.targetedBy.length / sourceInfo.sourceCounts[b.id];
        if (aTargetedRatio === bTargetedRatio) {
          return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
        }
        return aTargetedRatio - bTargetedRatio;
      });
      let nonMaxedSources = _.filter(sources, source => source.targetedBy.length < sourceInfo.sourceCounts[source.id]);
      if (nonMaxedSources.length) {
        creep.task = Tasks.harvest(nonMaxedSources[0]);
      } else {
        let nonEmptySources = _.filter(sources, source => source.energy !== 0);
        if (nonEmptySources.length) {
          creep.task = Tasks.harvest(nonEmptySources[0]);
        } else {
          creep.task = Tasks.harvest(sources[0]);
        }
      }
    } else {
      let depositTarget = creep.pos.findClosestByPathThenRange(FIND_MY_STRUCTURES, {
        filter: structure => isDepositTarget(structure, creep.carryCapacity)
      });
      if (!depositTarget) {
        depositTarget = creep.pos.findClosestByPathThenRange(FIND_MY_STRUCTURES, {
          filter: structure => isDepositTarget(structure)
        });
      }
      if (depositTarget) {
        creep.task = Tasks.transfer(depositTarget as transferTargetType);
      } else {
        console.log("WAITING");
      }
    }
  }
}
