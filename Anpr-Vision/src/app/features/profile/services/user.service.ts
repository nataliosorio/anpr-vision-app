/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ApiResponse } from '../../authentication/models/ApiResponse';

export interface AuthUserDto {
  id: number;
  username: string;
  email: string;
  personId: number;
  personName: string;
  asset: boolean;
  isDeleted: boolean;
}

export interface PersonDto {
  id: number;
  firstName: string;
  lastName: string;
  document: string;
  phone: string;
  email: string;
  age: number;
  asset: boolean;
  isDeleted: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {

  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiURL;

  constructor() {}

  // ======================================================
  // 🔵 Obtener usuario autenticado por ID
  // ======================================================
  getUserById(id: number): Observable<ApiResponse<AuthUserDto>> {
    const url = `${this.baseUrl}/User/${id}`;
    return this.http.get<ApiResponse<AuthUserDto>>(url).pipe(
      map(res => this.validate<AuthUserDto>(res)),
      catchError(err => throwError(() => new Error(this.pickErrorMessage(err))))
    );
  }

  // ======================================================
  // 🔵 Obtener datos de la persona por ID
  // ======================================================
  getPersonById(personId: number): Observable<ApiResponse<PersonDto>> {
    const url = `${this.baseUrl}/Person/${personId}`;
    return this.http.get<ApiResponse<PersonDto>>(url).pipe(
      map(res => this.validate<PersonDto>(res)),
      catchError(err => throwError(() => new Error(this.pickErrorMessage(err))))
    );
  }

  // ======================================================
  // 🔵 Actualizar usuario por ID
  // ======================================================
  updateUserById(userData: AuthUserDto): Observable<ApiResponse<AuthUserDto>> {
    const url = `${this.baseUrl}/User`;
    return this.http.put<ApiResponse<AuthUserDto>>(url, userData).pipe(
      map(res => this.validate<AuthUserDto>(res)),
      catchError(err => throwError(() => new Error(this.pickErrorMessage(err))))
    );
  }

  // ======================================================
  // 🔵 Actualizar persona por ID
  // ======================================================
  updatePersonById(personData: PersonDto): Observable<ApiResponse<PersonDto>> {
    const url = `${this.baseUrl}/Person`;
    return this.http.put<ApiResponse<PersonDto>>(url, personData).pipe(
      map(res => this.validate<PersonDto>(res)),
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
