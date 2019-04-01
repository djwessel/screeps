var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMeleeDefender = require('role.meleeDefender');
var roleRangedDefender = require('role.rangedDefender');

var utils = require('utils');

const roles = [roleHarvester, roleUpgrader, roleBuilder, roleMeleeDefender, roleRangedDefender];
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

module.exports.loop = function () {
    cleanup();

    controlCreeps();
    
    runSpawn(Game.spawns['Spawn1']);
}