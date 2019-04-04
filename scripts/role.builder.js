var utils = require('utils');

var roleBuilder = {

    roleName: 'builder',
    skills: [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK],
    calcRequired: function(room) {
        return 2;
    },
    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            creep.memory.withdrawTarget = null;
            var target = null;
            if (creep.memory.target) {
                target = Game.getObjectById(creep.memory.target);
                if (!target ||
                        target instanceof Structure && target.hits == target.hitsMax ||
                        target instanceof ConstructionSite && target.progress == target.progressTotal) {
                    target = null;
                }
            }
            
            
            if (!target) {
                // Repair
                const repairTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax * 0.75 && !((object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART) && object.hits > 25000)
                });
                
                // Construct
                const constructionTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                
                repairTargets.sort((a,b) => (b.hitsMax - b.hits)/b.hitsMax - (a.hitsMax - a.hits)/a.hitsMax);
                if (repairTargets.length > 0 && repairTargets[0].hits / repairTargets[0].hitsMax < 0.5) {
                    target = repairTargets[0];
                }
                else if (constructionTarget) {
                    target = constructionTarget;
                }
                else if (repairTargets.length > 0) {
                    target = repairTargets[0];
                }
                else {
                    const walls = creep.room.find(FIND_STRUCTURES, {
                        filter: object => object.hits < object.hitsMax && (object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART)
                    });
                    walls.sort((a,b) => {
                        if (a.structureType == b.structureType)
                            return (b.hitsMax - b.hits) / b.hitsMax - (a.hitsMax - a.hits) / a.hitsMax;
                        return a.structureType == STRUCTURE_WALL ? 1 : -1;
                    });
                    if (walls.length > 0) {
                        target = walls[0];
                    }
                }
            }
            
            if (target) {
                creep.memory.target = target.id;
                
                if (target instanceof Structure) {
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else if (target instanceof ConstructionSite) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }
            
            
        }
        else {
            creep.memory.target = null;
            utils.withdrawAction(creep);
        }
    }
};

module.exports = roleBuilder;