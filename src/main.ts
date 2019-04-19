import "prototypes";
import "./utils/creep-tasks/prototypes";
import { RoleBuilder } from "./roles/builder";
import { RoleHarvester } from "./roles/harvester";
import { RoleUpgrader } from "./roles/upgrader";
import { ErrorMapper } from "./utils/ErrorMapper";

const roles = [RoleHarvester, RoleBuilder, RoleUpgrader];

function cleanup(): void {
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}

function testSpawn(spawn: StructureSpawn, body: BodyPartConstant[]): boolean {
  return spawn.spawnCreep(body, "test", { dryRun: true }) === OK;
}

function spawnCreeps(spawn: StructureSpawn): void {
  if (spawn.spawning) {
    let spawningCreep = Game.creeps[spawn.spawning.name];
    spawn.room.visual.text(spawningCreep.memory.role, spawn.pos.x + 1, spawn.pos.y, {
      align: "left",
      opacity: 0.8
    });
    return;
  }
  let creeps = _.values(Game.creeps) as Creep[];

  for (let role of roles) {
    let creepsOfRole = _.filter(
      creeps,
      creep => creep.memory.room === spawn.room.name && creep.memory.role === role.roleName
    );
    let required = role.numRequired(spawn.room);
    console.log(role.roleName + ": " + creepsOfRole.length + "/" + required);

    if (creepsOfRole.length < required) {
      let body = role.getBody(spawn.room);

      if (role.priority || testSpawn(spawn, body)) {
        // TODO: Need a way of reserving energy for priority roles to prevent crashes in early RCL
        let options = {
          memory: {
            role: role.roleName,
            room: spawn.room.name
          }
        } as SpawnOptions;
        spawn.spawnCreep(body, role.roleName + Game.time, options);
        break;
      }
    }
  }
}

function setupTasks(spawn: StructureSpawn): void {
  let creeps = _.values(Game.creeps) as Creep[];

  for (let role of roles) {
    let creepsOfRole = _.filter(
      creeps,
      creep => creep.memory.room === spawn.room.name && creep.memory.role === role.roleName
    );
    for (let creep of creepsOfRole) {
      if (creep.isIdle) {
        role.newTask(creep);
      }
    }
  }
}

function runTasks(): void {
  let creeps = _.values(Game.creeps) as Creep[];

  // Run tasks
  for (const creep of creeps) {
    creep.run();
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  cleanup();

  for (const i in Game.spawns) {
    let spawn = Game.spawns[i];

    spawnCreeps(spawn);
    setupTasks(spawn);
  }

  runTasks();
});
