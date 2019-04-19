// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room: string;
  working?: boolean;
}

interface Memory {
  uuid: number;
  log: any;
}

interface CreepRole {
  roleName: string;
  numRequired(room: Room): number;
  getBody(room: Room) : BodyPartConstant[];
  newTask(creep: Creep): void;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
