var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMeleeDefender = require('role.meleeDefender');
var roleRangedDefender = require('role.rangedDefender');

var roles = [roleHarvester, roleUpgrader, roleBuilder, roleMeleeDefender, roleRangedDefender];

module.exports.loop = function () {

    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }
    else {
        for (var i = 0; i < roles.length; i++) {
            var role = roles[i];
            var screeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.roleName);
            console.log(role.roleName + ': ' + screeps.length);
            if (screeps.length < role.max) {
                var newName = role.roleName + Game.time;
                console.log('Spawning new ' + role.roleName + ': ' + newName);
                Game.spawns['Spawn1'].spawnCreep(role.skills, newName,
                    { memory: { role: role.roleName } });
            }
        }
    }

    // Instruct creeps
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        for (var i = 0; i < roles.length; i++) {
            var role = roles[i];
            if (creep.memory.role == role.roleName) {
                role.run(creep);
            }
        }
    }
}