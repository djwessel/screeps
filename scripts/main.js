var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMeleeDefender = require('role.meleeDefender');
var roleRangedDefender = require('role.rangedDefender');
var roleTransfer = require('role.transfer');
var roleStorageTransfer = require('role.storageTransfer');
var roleReloader = require('role.reloader');
var roleConqueror = require('role.conqueror');
var roleExpeditionHarvester = require('role.expeditionHarvester');
var roleExpeditionBuilder = require('role.expeditionBuilder');

var utils = require('utils');

const roles = [
    roleHarvester,
    roleUpgrader,
    roleBuilder,
    roleMeleeDefender,
    roleRangedDefender,
    roleTransfer,
    roleStorageTransfer,
    roleReloader,
    roleConqueror,
    roleExpeditionHarvester,
    roleExpeditionBuilder
];
var rolesDict = {};
roles.forEach(function(role) {
    rolesDict[role.roleName] = role;
});

function cleanup() {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

function runSpawn(spawn) {
    if (spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
            spawningCreep.memory.role,
            spawn.pos.x + 1,
            spawn.pos.y,
            { align: 'left', opacity: 0.8 });
    }
    else {
        // Spawn required
        for (var i = 0; i < roles.length; i++) {
            var role = roles[i];
            var screeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.roleName);
            if (screeps.length < role.max && utils.testSpawn(role.skills)) {
                var newName = role.roleName + Game.time;
                console.log('Spawning new ' + role.roleName + ': ' + newName);
                spawn.spawnCreep(role.skills, newName, { memory: { role: role.roleName } });
                break;
            }
        }
    }
}

function controlCreeps() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        console.log(creep.name)
        var role = rolesDict[creep.memory.role].run(creep);
    }
}

function updateTargetsAndRoles() {
    var sourceCounts = {};

    for (var name in Game.rooms) {
        var room = Game.rooms[name];
        room.find(FIND_SOURCES).forEach(function(source) {
            var count = _.filter(utils.getNeighbors(source.pos), (pos) => utils.isEnterable(pos)).length;
            sourceCounts[source.id] = count;
        });
    }
}

function towerDefense(room) {
    var towers = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_TOWER
    });
    towers.forEach(function(tower) {
        /*var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }*/

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    });
}

module.exports.loop = function () {
    cleanup();
    /*
    var targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                structure.energy < structure.energyCapacity || structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
        }
    });
    console.log(targets);*/

    towerDefense(Game.spawns['Spawn1'].room);

    controlCreeps();
    
    runSpawn(Game.spawns['Spawn1']);
}