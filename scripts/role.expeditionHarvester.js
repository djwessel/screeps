function isDepositTarget(structure) {
    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity || (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
            structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
}

function isSourceTarget(source) {
    return !source.pos.findInRange(FIND_HOSTILE_CREEPS, 5).length && (source.energy != 0 || source.ticksToRegeneration < 40);
}

var roleExpeditionHarvester = {

    roleName: 'expeditionHarvester',
    max: 6,
    skills: [WORK,CARRY,MOVE,WORK,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE],
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            creep.memory.depositTarget = null;

            var expeditionFlag = null;
            for (var name in Game.flags) {
                var flag = Game.flags[name];
                if (flag.color == COLOR_YELLOW && flag.secondaryColor == COLOR_ORANGE) {
                    expeditionFlag = flag
                }
            }
            

            if (expeditionFlag.room.name !== creep.room.name) {
                creep.moveTo(expeditionFlag);
            }
            else {

                var source = null;
                if (creep.memory.target) {
                    source = Game.getObjectById(creep.memory.target);
                    if (!source || !isSourceTarget(source)) {
                        creep.memory.target = null;
                        source = null;
                    }
                }
                if (!source) {
                    source = creep.pos.findClosestByPath(FIND_SOURCES, {
                        filter: isSourceTarget
                    });
                }
                if (source) {
                    creep.memory.target = source.id;
                    var result = creep.harvest(source)
                    //console.log(source.energy, result)
                    if (result == ERR_NOT_IN_RANGE || result == ERR_NOT_ENOUGH_RESOURCES) {
                        //console.log(result)
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
            
        }
        else {
            creep.memory.target = null;
            
            var baseFlag = null;
            for (var name in Game.flags) {
                var flag = Game.flags[name];
                if (flag.color == COLOR_YELLOW && flag.secondaryColor == COLOR_WHITE) {
                    baseFlag = flag
                }
            }
            

            if (baseFlag.room.name !== creep.room.name) {
                creep.moveTo(baseFlag);
            }
            else {

                var target = null;
                if (creep.memory.depositTarget) {
                    target = Game.getObjectById(creep.memory.depositTarget);
                    if (!target || !isDepositTarget(target)) {
                        target = null;
                        creep.memory.depositTarget = null;
                    }
                }
                
                if (!target) {
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: isDepositTarget
                    });
                }
                
                if (target) {
                    creep.memory.depositTarget = target.id;
                    
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
    }
};

module.exports = roleExpeditionHarvester;