// Entities.ts
import { IBaseEntity } from "./IBaseEntity";
import { IEntity } from "./IEntity";

// entidades que no necesitan atributos extra
export type Form = IEntity;
export type Module = IEntity;
export type Role = IEntity;
export type Permission = IEntity;

// entidades que sí necesitan atributos extra
export interface Person extends IBaseEntity {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface IUser extends IBaseEntity {
  username: string;
  email: string;
  password: string;
  personid: number;
  personname?: string;
}



export interface FormModule extends IBaseEntity {
  formId: number;
  moduleId: number;
  formName: string;
  moduleName: string;
}

export interface User extends IBaseEntity {
  userName: string;
  email: string;
  password: string;
  personId: number;
  personName: string;
}

export interface Vehicle extends IBaseEntity {
  plate: string;
  color: string;
  typeVehicleId: number;
  clientId: number;
  client: string;
  typeVehicle: string;
}

export interface Client extends IBaseEntity {
  personaId: number;
  person: string;
  name: string;
}

export interface RegisteredVehicle extends IBaseEntity {
entryDate: string; // ISO 8601 format date string
exitDate: string | null; // ISO 8601 format date string or null
vehicleId: number;
vehicle: string;
slotsId: number;
slots: string;
}

// login-response.types.ts (opcional pero recomendado)
export interface LoginClient {
  id: number;
  personId: number;
}

export interface LoginData {
  userId: number;
  username: string;
  roles: string[];
  token: string;
  personId: number;
  firstName: string;
  lastName: string;
  client: LoginClient;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: LoginData;
  errors?: string[];
}
export interface VehicleDto {
  id: number;
  plate: string;
  color: string;
  typeVehicleId: number;
  typeVehicle?: string | null;
  clientId: number;
  client?: string | null;
  asset: boolean;
  isDeleted: boolean;

  // ✅ nuevo
  isInside: boolean;              // mapea a IsInside
  activeRegisteredId?: number | null;
  activeSlotId?: number | null;
  activeSlotName?: string | null;
  activeEntryDate?: string | null; // ISO
}
