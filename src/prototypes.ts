interface RoomPosition {
  findClosestByPathThenRange<K extends FindConstant>(type: K, opts?: FilterOptions<K>): FindTypes[K] | null;
}

RoomPosition.prototype.findClosestByPathThenRange = function<K extends FindConstant>(
  type: K,
  opts?: FilterOptions<K>
): FindTypes[K] | null {
  let target = this.findClosestByPath(type, opts);
  if (!target) {
    target = this.findClosestByRange(type, opts);
  }
  return target;
};
