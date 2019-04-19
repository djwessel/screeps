import { Tasks } from "../utils/creep-tasks/Tasks";
import { getWithdrawTask } from "../utils/helperFunctions";

export class RoleBuilder {
  public static roleName: string = "builder";
  public static priority: boolean = false;

  public static numRequired(room: Room): number {
    let num = 0;
    let level = room.controller ? room.controller.level : 0;
    switch (level) {
      case 1:
        num = 1;
        break;
      case 2:
        num = 2;
        break;
      case 3:
        num = 3;
        break;
      case 4:
        num = 2;
        break;
      case 5:
        num = 1;
        break;
      case 6:
        num = 1;
        break;
      case 7:
        num = 1;
        break;
      case 8:
        num = 1;
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
      body = [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE]; // 1000
    } else if (capacity >= 1300) {
      body = [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE]; // 800
    } else if (capacity >= 800) {
      body = [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE]; // 600
    } else if (capacity >= 550) {
      body = [WORK, CARRY, MOVE, WORK, CARRY, MOVE]; // 400
    } else {
      body = [WORK, CARRY, MOVE]; // 200
    }
    return body;
  }

  public static newTask(creep: Creep): void {
    if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
      creep.memory.working = true;
    } else if (creep.memory.working && _.sum(creep.carry) === 0) {
      creep.memory.working = false;
    }

    if (creep.memory.working) {
      // Repair anything below 50%
      let repairTargets = creep.room.find(FIND_STRUCTURES, {
        filter: struct =>
          struct.hits < struct.hitsMax * 0.75 &&
          !(
            (struct.structureType === STRUCTURE_WALL || struct.structureType === STRUCTURE_RAMPART) &&
            struct.hits > 25000
          )
      });
      repairTargets.sort((a, b) => (b.hitsMax - b.hits) / b.hitsMax - (a.hitsMax - a.hits) / a.hitsMax);
      if (repairTargets.length > 0 && repairTargets[0].hits / repairTargets[0].hitsMax < 0.5) {
        creep.task = Tasks.repair(repairTargets[0]);
        return;
      }

      // Build Construction Sites
      let constructionSite = creep.pos.findClosestByPathThenRange(FIND_CONSTRUCTION_SITES);
      if (constructionSite) {
        creep.task = Tasks.build(constructionSite);
        return;
      }

      // Repair anything below 75%
      if (repairTargets.length > 0) {
        creep.task = Tasks.repair(repairTargets[0]);
        return;
      }

      // Repair Walls and Ramparts
      let walls = creep.room.find(FIND_STRUCTURES, {
        filter: struct =>
          (struct.structureType === STRUCTURE_WALL || struct.structureType === STRUCTURE_RAMPART) &&
          struct.hits < struct.hitsMax
      });
      walls.sort((a, b) => {
        if (a.structureType === b.structureType)
          return (b.hitsMax - b.hits) / b.hitsMax - (a.hitsMax - a.hits) / a.hitsMax;
        return a.structureType === STRUCTURE_WALL ? 1 : -1;
      });
      if (walls.length > 0) {
        creep.task = Tasks.repair(walls[0]);
      }
    } else {
      let task = getWithdrawTask(creep);
      if (task) {
        creep.task = task;
      }
    }
  }
}
