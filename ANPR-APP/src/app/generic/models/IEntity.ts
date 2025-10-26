import { IBaseEntity } from "./IBaseEntity";

export interface IEntity extends IBaseEntity {
  name: string;
  description: string;
}

