var roleRangedDefender = {

    roleName: 'rangedDefender',
    max: 0,
    skills: [MOVE,MOVE,RANGED_ATTACK],
    /** @param {Creep} creep **/
    run: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target && target.hitsMax <= 1000) {
            if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleRangedDefender;