/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ApiResponse } from '../../authentication/models/ApiResponse';
import { VehicleWithStatusDto } from '../models/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiURL;
  private readonly baseEndpoint = 'Vehicle';

  constructor() {}

  // =============================
  // 🔹 Obtener vehículos con status por clientId
  // =============================
  getVehiclesWithStatusByClientId(clientId: number): Observable<ApiResponse<VehicleWithStatusDto[]>> {
    const url = `${this.baseUrl}/${this.baseEndpoint}/by-client/status/${clientId}`;
    return this.http.get<ApiResponse<VehicleWithStatusDto[]>>(url).pipe(
      map((res): ApiResponse<VehicleWithStatusDto[]> =>
        this.validateApiResponse<VehicleWithStatusDto[]>(res)
      ),
      catchError((err) => throwError(() => new Error(this.pickErrorMessage(err))))
    );
  }

  // =============================
  // 🔹 Obtener ticket PDF de entrada del vehículo
  // =============================
  getVehicleEntryTicket(vehicleId: number): Observable<Blob> {
    const url = `${this.baseUrl}/tickets/${vehicleId}/pdf`;
    return this.http.get(url, { responseType: 'blob' });
  }

  // =============================
  // ⚙️ Helpers internos
  // =============================
  private validateApiResponse<T>(res: any): ApiResponse<T> {
    if (!res || typeof res !== 'object' || !('success' in res)) {
      throw new Error('Respuesta del servidor inválida.');
    }
    return res as ApiResponse<T>;
  }

  private pickErrorMessage(err: any): string {
    const httpErr = err as HttpErrorResponse;
    const payload = httpErr?.error;

    if (typeof payload === 'string' && payload.trim().length) return payload;

    if (payload && typeof payload === 'object') {
      if ('message' in payload && payload.message) return payload.message;
      if ('title' in payload && payload.title) return payload.title as string;
      if ('errors' in payload && payload.errors) {
        const firstKey = Object.keys(payload.errors)[0];
        const firstMsg = payload.errors[firstKey]?.[0];
        if (firstMsg) return firstMsg;
      }
    }

    if (httpErr?.message) return httpErr.message;
    if (err?.message) return err.message;

    return 'Ocurrió un error inesperado en la comunicación con el servidor.';
  }
}
