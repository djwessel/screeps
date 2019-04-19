import { Tasks } from "../utils/creep-tasks/Tasks";
import { isDepositTarget, getSourceInfo } from "../utils/helperFunctions";
import { transferTargetType } from "../utils/creep-tasks/TaskInstances/task_transfer";

export class RoleHarvester {
  //implements CreepRole {
  static roleName: string = "harvester";
  static priority: boolean = true;

  static numRequired(room: Room): number {
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

  static getBody(room: Room): BodyPartConstant[] {
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

  static newTask(creep: Creep): void {
    if (creep.memory.working && _.sum(creep.carry) == creep.carryCapacity) {
      creep.memory.working = false;
    } else if (!creep.memory.working && _.sum(creep.carry) == 0) {
      creep.memory.working = true;
    }

    if (creep.memory.working) {
      let sourceInfo = getSourceInfo(creep.room);

      let sources = creep.room.find(FIND_SOURCES);
      sources.sort((a, b) => {
        let a_targeted_ratio = a.targetedBy.length / sourceInfo.sourceCounts[a.id];
        let b_targeted_ratio = b.targetedBy.length / sourceInfo.sourceCounts[b.id];
        if (a_targeted_ratio === b_targeted_ratio) return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
        return a_targeted_ratio - b_targeted_ratio;
      });
      //sources.forEach(function(s) {console.log(s.targetedBy.length)});
      let nonMaxedSources = _.filter(sources, source => source.targetedBy.length < sourceInfo.sourceCounts[source.id]);
      if (nonMaxedSources.length) {
        //nonMaxedSources.forEach(function(s) {console.log('nonMaxed: ' + s.targetedBy.length)});
        creep.task = Tasks.harvest(nonMaxedSources[0]);
      } else {
        let nonEmptySources = _.filter(sources, source => source.energy !== 0);
        if (nonEmptySources.length) {
          //nonEmptySources.forEach(function(s) {console.log('nonEmpty: ' + s.targetedBy.length)});
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
