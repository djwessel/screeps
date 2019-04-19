import { Task } from "../utils/creep-tasks/Task";
import { Tasks } from "../utils/creep-tasks/Tasks";
import { withdrawTargetType } from "../utils/creep-tasks/TaskInstances/task_withdraw";

export interface EnergyStructure extends Structure {
  energy: number;
  energyCapacity: number;
}

export interface StoreStructure extends Structure {
  store: StoreDefinition;
  storeCapacity: number;
}

export function isEnergyStructure(obj: RoomObject): obj is EnergyStructure {
  return (<EnergyStructure>obj).energy != undefined && (<EnergyStructure>obj).energyCapacity != undefined;
}

export function isStoreStructure(obj: RoomObject): obj is StoreStructure {
  return (<StoreStructure>obj).store != undefined && (<StoreStructure>obj).storeCapacity != undefined;
}

export function isDepositTarget(structure: Structure, amount = 0): boolean {
  /*
  return (
    ((structure.structureType === STRUCTURE_EXTENSION ||
      structure.structureType === STRUCTURE_LAB ||
      structure.structureType === STRUCTURE_LINK ||
      structure.structureType === STRUCTURE_NUKER ||
      structure.structureType === STRUCTURE_POWER_SPAWN ||
      //structure.structureType === STRUCTURE_NUKER ||
      structure.structureType === STRUCTURE_SPAWN ||
      structure.structureType === STRUCTURE_TOWER) &&
      structure.energy < structure.energyCapacity - amount) ||
    ((structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
      _.sum(structure.store) < structure.storeCapacity - amount)
  );*/
  if (isEnergyStructure(structure)) {
    let energyStruct = <EnergyStructure>structure;
    return energyStruct.energy < energyStruct.energyCapacity - amount;
  } else if (isStoreStructure(structure)) {
    let storeStruct = <StoreStructure>structure;
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
  neighborMatrix.forEach(function(dir) {
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
  let sourceCounts: { [source_id: string]: number } = {};
  let sources = room.find(FIND_SOURCES);

  sources.forEach(function(source) {
    sourceCounts[source.id] = _.filter(getNeighbors(source.pos), pos => isEnterable(pos)).length;
  });

  return {
    sourceCapacity: _.sum(sourceCounts),
    numSources: sources.length,
    sourceCounts: sourceCounts
  };
}

function isValidWithdrawTarget(creep: Creep, structure: Structure) {
  var energyNeed = creep.carryCapacity - _.sum(creep.carry);
  if (structure.structureType === STRUCTURE_SPAWN) {
    let energyStruct = <EnergyStructure>structure;
    return energyStruct.energy > energyNeed;
  } else if (isStoreStructure(structure)) {
    let storeStruct = <StoreStructure>structure;
    return storeStruct.store[RESOURCE_ENERGY] > Math.max(energyNeed, storeStruct.storeCapacity * 0.1);
  }
  return false;
}

export function getWithdrawTask(creep: Creep) : Task | null {
  let target = creep.pos.findClosestByPathThenRange(FIND_STRUCTURES, {
    filter: structure => {
      return isValidWithdrawTarget(creep, structure);
    }
  });

  if (target) {
    return Tasks.withdraw(<withdrawTargetType>target);
  }
  return null;
}
