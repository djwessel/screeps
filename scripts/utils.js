/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils');
 * mod.thing == 'a thing'; // true
 */

const isObstacle = _.transform(
    OBSTACLE_OBJECT_TYPES,
    (o, type) => { o[type] = true; },
    {}
);

const neighborMatrix = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];

module.exports = {
    withdrawAction: function(creep) {
        // Withdraw
        /*var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }*/
        
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.energy > 0;
            }
        });
        if (targets.length > 0) {
            if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    },
    testSpawn: function(skills) {
        return Game.spawns['Spawn1'].spawnCreep(skills, Game.time, { dryRun: true }) == OK;
    },
    isEnterable: function(pos) {
        return _.every(pos.look(), item =>
            item.type === 'terrain' ?
            item.terrain !== 'wall' :
            !isObstacle[item.structureType]
        );
    },
    getNeighbors: function(pos) {
        var neighbors = [];
        neighborMatrix.forEach(function(dir) {
            var newX = pos.x + dir[0];
            var newY = pos.y + dir[1];
            if (newX >= 0 && newX < 50 && newY >= 0 && newY < 50) {
                neighbors.push(new RoomPosition(newX, newY, pos.roomName));
            }
        });
        return neighbors;
    }
};