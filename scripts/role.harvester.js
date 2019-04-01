var roleHarvester = {

    roleName: 'harvester',
    max: 20,
    skills: [WORK,CARRY,MOVE],
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.carry.energy < creep.carryCapacity) {
            var source = null;
            if (creep.memory.target) {
                source = Game.getObjectById(creep.memory.target);
            }
            else {
                source = creep.pos.findClosestByPath(FIND_SOURCES, {
                    filter: (structure) => {
                        return !structure.pos.findInRange(FIND_HOSTILE_CREEPS, 5).length;
                    }
                });
            }
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            //var targets = creep.room.find(FIND_STRUCTURES, {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_STORAGE) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            //targets.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
            //if (targets.length > 0) {
            
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            //}
        }
    }
};

module.exports = roleHarvester;