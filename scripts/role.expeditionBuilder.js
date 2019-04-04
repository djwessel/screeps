var utils = require('utils');

var roleExpeditionBuilder = {

    roleName: 'expeditionBuilder',
    max: 1,
    skills: [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK],
    /** @param {Creep} creep **/
    run: function(creep) {
        //creep.say('expeditionBuild')
        // TODO: Deal with standingon room exits while building...
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            creep.memory.withdrawTarget = null;

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
                        filter: object => object.hits < object.hitsMax * 0.75 && !((object.structureType ==     STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART) && object.hits > 25000)
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
                            filter: object => object.hits < object.hitsMax && (object.structureType ==     STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART)
                        });
                        walls.sort((a,b) => (b.hitsMax - b.hits) / b.hitsMax - (a.hitsMax - a.hits) / a.hitsMax);
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
                utils.withdrawAction(creep);
            }
        }
    }
};

module.exports = roleExpeditionBuilder;