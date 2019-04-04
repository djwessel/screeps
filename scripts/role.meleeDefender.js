var roleMeleeDefender = {

    roleName: 'meleeDefender',
    max: 2,
    skills: [ATTACK,MOVE,MOVE,ATTACK,TOUGH],
    /** @param {Creep} creep **/
    run: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) { //&& target.hitsMax <= 1000
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            const target = creep.pos.findClosestByRange(FIND_FLAGS);
            if (target) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleMeleeDefender;