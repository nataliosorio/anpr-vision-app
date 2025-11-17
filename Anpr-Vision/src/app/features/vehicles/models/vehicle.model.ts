export interface VehicleWithStatusDto {
  id: number;
  plate: string;
  color: string;
  typeVehicleId: number;
  typeVehicle: string | null;
  clientId: number;
  client: string | null;
  isInside: boolean;
  entryDate: string | null;
  slotName: string | null;
  slotId: number | null;
  timeInside: string | null;
  parkingId: number | null;
  asset: any | null;
  isDeleted: boolean;
}
