/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ApiResponse } from '../../authentication/models/ApiResponse';

export interface OccupancyData {
  occupied: number;
  total: number;
  percentage: number;
  free: number;
}

export interface ParkingData {
  location: string;
  parkingCategoryId: number;
  parkingCategory: any;
  name: string;
  id: number;
  asset: boolean;
  isDeleted: boolean;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiURL;

  constructor() {}

  // ======================================================
  // 🔵 Obtener ocupación global del parqueadero
  // ======================================================
  getGlobalOccupancy(parkingId: number): Observable<ApiResponse<OccupancyData>> {
    const url = `${this.baseUrl}/Dashboard/occupancy/global?parkingId=${parkingId}`;
    return this.http.get<ApiResponse<OccupancyData>>(url).pipe(
      map(res => this.validate<OccupancyData>(res)),
      catchError(err => throwError(() => new Error(this.pickErrorMessage(err))))
    );
  }

  // ======================================================
  // 🔵 Obtener información del parqueadero
  // ======================================================
  getParkingInfo(parkingId: number): Observable<ApiResponse<ParkingData>> {
    const url = `${this.baseUrl}/Parking/${parkingId}`;
    return this.http.get<ApiResponse<ParkingData>>(url).pipe(
      map(res => this.validate<ParkingData>(res)),
      catchError(err => throwError(() => new Error(this.pickErrorMessage(err))))
    );
  }

  // ======================================================
  // ⚙️ Helpers
  // ======================================================
  private validate<T>(res: any): ApiResponse<T> {
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
      if (payload.message) return payload.message;
      if (payload.title) return payload.title;
      if (payload.errors) {
        const firstKey = Object.keys(payload.errors)[0];
        const firstMsg = payload.errors[firstKey]?.[0];
        if (firstMsg) return firstMsg;
      }
    }

    return httpErr?.message || 'Error inesperado en el servidor.';
  }
}
