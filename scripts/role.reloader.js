var roleReloader = {

    roleName: 'reloader',
    skills: [CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE],
    calcRequired: function(room) {
        return room.find(FIND_HOSTILE_CREEPS).length != 0 ? 1 : 0;
    },
    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.transfering && creep.carry.energy == 0) {
            creep.memory.transfering = false;
        }
        if (!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                }
            });
            
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            //withdraw
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    var energyNeed = creep.carryCapacity - _.sum(creep.carry);
                    return structure.structureType == STRUCTURE_CONTAINER
                        && structure.store[RESOURCE_ENERGY] > Math.max(energyNeed, structure.storeCapacity * 0.0);
                }
            });
            
            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleReloader;