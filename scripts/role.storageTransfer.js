var MIN_PREC = 0.5;
var roleStorageTransfer = {

    roleName: 'storageTransfer',
    max: 1,
    skills: [CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE],
    /** @param {Creep} creep **/
    run: function(creep) {

        var tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
            filter: (tombstone) => {
                return tombstone.store[RESOURCE_ENERGY] > 0;
            }
        })
        if (tombstone) {
            if (creep.withdraw(tombstone, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(tombstone);
            }
        }

        if (creep.memory.transfering && creep.carry.energy == 0) {
            creep.memory.transfering = false;
        }
        if (!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
            var target = null;
            if (creep.memory.target) {
                target = Game.getObjectById(creep.memory.target);
                if (!target || target.store[RESOURCE_ENERGY] < target.storeCapacity * MIN_PREC) {
                    target = null;
                }
            }
            
            if (!target) {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity * MIN_PREC;
                    }
                });
            }
            
            if (target) {
                creep.memory.target = target.id;
                
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else {
            creep.memory.target = null;
            //withdraw
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    var energyNeed = 0//creep.carryCapacity - _.sum(creep.carry);
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store[RESOURCE_ENERGY] > Math.max(energyNeed, structure.storeCapacity * MIN_PREC);
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

module.exports = roleStorageTransfer;