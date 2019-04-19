import { Tasks } from "../utils/creep-tasks/Tasks";
import { getWithdrawTask } from "../utils/helperFunctions";

export class RoleUpgrader {
  //implements CreepRole {
  static roleName: string = "upgrader";
  static priority: boolean = false;

  static numRequired(room: Room): number {
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

  static getBody(room: Room): BodyPartConstant[] {
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

  static newTask(creep: Creep): void {
    if (!creep.memory.working && _.sum(creep.carry) === creep.carryCapacity) {
      creep.memory.working = true;
    } else if (creep.memory.working && _.sum(creep.carry) === 0) {
      creep.memory.working = false;
    }

    if (creep.memory.working) {
      creep.task = Tasks.upgrade(creep.room.controller!);
    } else {
      let task = getWithdrawTask(creep);
      if (task) creep.task = task;
    }
  }
}
