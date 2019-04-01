var roleMeleeDefender = {

    roleName: 'meleeDefender',
    max: 1,
    skills: [MOVE,MOVE,ATTACK],
    /** @param {Creep} creep **/
    run: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target && target.hitsMax <= 1000) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleMeleeDefender;