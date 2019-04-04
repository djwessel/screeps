var utils = require('utils');
var MIN_PREC = 0.5;
var roleStorageTransfer = {

    roleName: 'storageTransfer',
    skills: [CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE],
    calcRequired: function(room) {
        return 2;
    },
    /** @param {Creep} creep **/
    run: function(creep) {

        

        if (creep.memory.transfering && creep.carry.energy == 0) {
            creep.memory.transfering = false;
        }
        if (!creep.memory.transfering && _.sum(creep.carry) > 0) {//== creep.carryCapacity
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
            var target = null;
            if (_.sum(creep.carry) != creep.carry.energy) {
                // Target Storage
                target = creep.room.storage;
            }
            else {
                if (creep.memory.target) {
                    target = Game.getObjectById(creep.memory.target);
                    if (!target || target.store[RESOURCE_ENERGY] < target.storeCapacity * MIN_PREC) {
                        target = null;
                    }
                }
                
                if (!target) {
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                                && structure.store[RESOURCE_ENERGY] < structure.storeCapacity * MIN_PREC
                                && structure.id != creep.memory.last
                        }
                    });
                }
            }
            
            if (target) {
                creep.memory.target = target.id;
                
                if (creep.transfer(target, _.findKey(creep.carry)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else {
                    creep.memory.last = target.id;
                }
            }
        }
        else {
            creep.memory.target = null;
            
            if (utils.lootTombstone(creep)) {
                return;
            }
            
            if (utils.pickupDropped(creep)) {
                return
            }
        
            //withdraw
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    var energyNeed = 0//creep.carryCapacity - _.sum(creep.carry);
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                        && structure.store[RESOURCE_ENERGY] > Math.max(energyNeed, structure.storeCapacity * MIN_PREC);
                }
            });
            
            if (target) {
                //console.log(target.currentCount)
                var amount = Math.min(creep.carryCapacity - _.sum(creep.carry), target.store[RESOURCE_ENERGY] - target.storeCapacity * MIN_PREC);
                //target.currentCount = target.store[RESOURCE_ENERGY] - amount;
                if (creep.withdraw(target, RESOURCE_ENERGY, amount) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else {
                    creep.memory.last = target.id;
                }
            }
        }
    }
};

module.exports = roleStorageTransfer;