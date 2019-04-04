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


function isValidWithdrawTarget(creep, structure) {
    var energyNeed = creep.carryCapacity - _.sum(creep.carry);
    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
        (structure.energy > energyNeed) ||
        structure.structureType == STRUCTURE_CONTAINER &&
        (structure.store[RESOURCE_ENERGY] > Math.max(energyNeed, structure.storeCapacity * 0.1)); //  || creep.pos.getRangeTo(structure) > 10
}

module.exports = {
    withdrawAction: function(creep) {
        // Withdraw
        var target = null;
        if (creep.memory.withdrawTarget) {
            target = Game.getObjectById(creep.memory.withdrawTarget);
            if (!target || !isValidWithdrawTarget(creep, target)) {
                target = null;
                creep.memory.withdrawTarget = null;
            }
        }
        
        if (!target) {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return isValidWithdrawTarget(creep, structure);
                }
            });
        }
        
        if (target) {
            creep.memory.withdrawTarget = target.id;
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
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
    },
    lootTombstone: function(creep) {
        var tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
            filter: (tombstone) => {
                return _.sum(tombstone.store) > 0;
            }
        });
        if (tombstone) {
            if (creep.withdraw(tombstone, _.findKey(tombstone.store)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(tombstone);
            }
            return true;
        }
        return false;
    },
    pickupDropped: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if(target) {
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        }
        return false;
    }
};