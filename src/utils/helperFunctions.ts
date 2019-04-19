import { Task } from "../utils/creep-tasks/Task";
import { Tasks } from "../utils/creep-tasks/Tasks";
import { withdrawTargetType } from "../utils/creep-tasks/TaskInstances/task_withdraw";
import {
  EnergyStructure,
  isEnergyStructure,
  isStoreStructure,
  StoreStructure
} from "../utils/creep-tasks/utilities/helpers";

export function isDepositTarget(structure: Structure, amount = 0): boolean {
  if (isEnergyStructure(structure)) {
    let energyStruct = structure as EnergyStructure;
    return energyStruct.energy < energyStruct.energyCapacity - amount;
  } else if (isStoreStructure(structure)) {
    let storeStruct = structure as StoreStructure;
    return _.sum(storeStruct.store) < storeStruct.storeCapacity - amount;
  }
  return false;
}

const isObstacle = _.transform(
  OBSTACLE_OBJECT_TYPES,
  (o, type) => {
    o[type] = true;
  },
  {}
);

const neighborMatrix = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function getNeighbors(pos: RoomPosition): RoomPosition[] {
  let neighbors = [] as RoomPosition[];
  neighborMatrix.forEach(dir => {
    let newX = pos.x + dir[0];
    let newY = pos.y + dir[1];
    if (newX >= 0 && newX < 50 && newY >= 0 && newY < 50) {
      neighbors.push(new RoomPosition(newX, newY, pos.roomName));
    }
  });
  return neighbors;
}

function isEnterable(pos: RoomPosition): boolean {
  return (
    _.every(pos.lookFor(LOOK_TERRAIN), item => item !== "wall") &&
    _.every(pos.lookFor(LOOK_STRUCTURES), item => !isObstacle[item.structureType])
  );
}

export function getSourceInfo(room: Room) {
  let sourceCounts: { [sourceId: string]: number } = {};
  let sources = room.find(FIND_SOURCES);

  sources.forEach(source => {
    sourceCounts[source.id] = _.filter(getNeighbors(source.pos), pos => isEnterable(pos)).length;
  });

  return {
    numSources: sources.length,
    sourceCapacity: _.sum(sourceCounts),
    sourceCounts: sourceCounts
  };
}

function isValidWithdrawTarget(creep: Creep, structure: Structure, energyNeed: number = 0) {
  if (structure.structureType === STRUCTURE_SPAWN) {
    let energyStruct = structure as EnergyStructure;
    return energyStruct.energy > energyNeed;
  } else if (isStoreStructure(structure)) {
    let storeStruct = structure as StoreStructure;
    return storeStruct.store[RESOURCE_ENERGY] > Math.max(energyNeed, storeStruct.storeCapacity * 0.1);
  }
  return false;
}

export function getWithdrawTask(creep: Creep): Task | null {
  let energyNeed = creep.carryCapacity - _.sum(creep.carry);
  let target = creep.pos.findClosestByPathThenRange(FIND_STRUCTURES, {
    filter: structure => {
      return isValidWithdrawTarget(creep, structure, energyNeed);
    }
  });
  if (!target) {
    target = creep.pos.findClosestByPathThenRange(FIND_STRUCTURES, {
      filter: structure => {
        return isValidWithdrawTarget(creep, structure, 0);
      }
    });
  }

  if (target) {
    return Tasks.withdraw(target as withdrawTargetType);
  }
  return null;
}
