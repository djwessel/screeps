var roleRangedDefender = {

    roleName: 'rangedDefender',
    max: 2,
    skills: [RANGED_ATTACK,MOVE,MOVE,RANGED_ATTACK,TOUGH],
    /** @param {Creep} creep **/
    run: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) { //  && target.hitsMax <= 1000
            if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            const target = creep.pos.findClosestByRange(FIND_FLAGS, {
                filter: (flag) => flag.color == COLOR_RED && flag.secondaryColor == COLOR_RED
            });
            if (target) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleRangedDefender;