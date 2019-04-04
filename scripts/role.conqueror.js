var roleConqueror = {

    roleName: 'conqueror',
    skills: [CLAIM,MOVE],
    calcRequired: function(room) {
        return Game.time % 6000 > 3000 ? 2 : 1;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        var target = null;
        for (var name in Game.flags) {
            var flag = Game.flags[name];
            if (flag.color == COLOR_YELLOW && flag.secondaryColor == COLOR_YELLOW) {
                target = flag
            }
        }
        if (target && (!target.room || target.room.name !== creep.room.name)) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        else {
            if(creep.room.controller) {
                var result = creep.claimController(creep.room.controller);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                else if (result == ERR_GCL_NOT_ENOUGH) {
                    if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
    }
};

module.exports = roleConqueror;