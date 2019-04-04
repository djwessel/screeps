var roleRangedDefender = {

    roleName: 'rangedDefender',
    skills: [TOUGH,TOUGH,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK],
    calcRequired: function(room) {
        return 2;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) { //  && target.hitsMax <= 1000
            if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            for (var name in Game.flags) {
                var flag = Game.flags[name];
                if (flag.color == COLOR_RED && flag.secondaryColor == COLOR_RED) {
                    target = flag
                }
            }
            
            /*const target = creep.pos.findClosestByRange(FIND_FLAGS, {
                filter: (flag) => flag.color == COLOR_RED && flag.secondaryColor == COLOR_RED
            });*/
            if (target) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleRangedDefender;