var roleHealer = {

    roleName: 'healer',
    skills: [TOUGH,TOUGH,MOVE,MOVE,HEAL],
    calcRequired: function(room) {
        return 1;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        if(target) {
            if(creep.heal(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
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

module.exports = roleHealer;