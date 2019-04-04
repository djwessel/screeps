var utils = require('utils');

var roleUpgrader = {

    roleName: 'upgrader',
    skills: [WORK,CARRY,MOVE,CARRY,MOVE,CARRY,WORK,WORK,CARRY,WORK,CARRY,MOVE,CARRY,WORK],
    calcRequired: function(room) {
        return 4;
    },
    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.upgrading) {
            creep.memory.withdrawTarget = null;
            
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'black'}});
            }
        }
        else {
            utils.withdrawAction(creep);
        }
    }
};

module.exports = roleUpgrader;