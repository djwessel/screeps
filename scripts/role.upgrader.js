var utils = require('utils');

var roleUpgrader = {

    roleName: 'upgrader',
    max: 1,
    skills: [WORK,CARRY,MOVE],
    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            //creep.say('withdraw');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            //creep.say('upgrade');
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            utils.withdrawAction(creep);
        }
    }
};

module.exports = roleUpgrader;