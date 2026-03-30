import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';

export interface QuantityRequestDto {
  value: number;
  unit: string;
}

export interface TwoQuantityRequestDto {
  q1: QuantityRequestDto;
  q2: QuantityRequestDto;
}

export interface QuantityValue {
  source: string;
  parsedValue: number;
}

export interface QuantityResponseDto {
  id: number;
  thisValue: number | QuantityValue;
  thisUnit: string;
  thisMeasurementType: string;
  thatValue: number | QuantityValue | null;
  thatUnit: string | null;
  thatMeasurementType: string | null;
  operation: string;
  resultValue?: number | QuantityValue | null;
  resultUnit?: string | null;
  resultMeasurementType?: string | null;
  resultString?: string;
  isError?: boolean;
  errorMessage?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Quantity {
  private baseUrl = '/api/quantities';

  /**
   * Centralized API caller using the native fetch API.
   * Wraps the Promise in an Observable to maintain compatibility with existing components.
   */
  private callApi<T>(path: string, method = 'POST', body?: unknown, params?: Record<string, string>): Observable<T> {
    let url = `${this.baseUrl}${path}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value);
        }
      });
      const query = searchParams.toString();
      if (query) {
        url += `?${query}`;
      }
    }

    return from(
      fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        },
        body: body ? JSON.stringify(body) : undefined
      }).then(async response => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `HTTP Error ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }
        return response.text();
      })
    ) as Observable<T>;
  }

  welcome(): Observable<string> {
    return this.callApi<string>('', 'GET');
  }

  checkEquality(request: TwoQuantityRequestDto): Observable<ApiResponse<QuantityResponseDto>> {
    return this.callApi<ApiResponse<QuantityResponseDto>>('/equality', 'POST', request);
  }

  convert(request: QuantityRequestDto, targetUnit: string): Observable<ApiResponse<QuantityResponseDto>> {
    return this.callApi<ApiResponse<QuantityResponseDto>>('/convert', 'POST', request, { targetUnit });
  }

  add(request: TwoQuantityRequestDto, targetUnit?: string): Observable<ApiResponse<QuantityResponseDto>> {
    return this.callApi<ApiResponse<QuantityResponseDto>>('/add', 'POST', request, targetUnit ? { targetUnit } : undefined);
  }

  subtract(request: TwoQuantityRequestDto, targetUnit?: string): Observable<ApiResponse<QuantityResponseDto>> {
    return this.callApi<ApiResponse<QuantityResponseDto>>('/subtract', 'POST', request, targetUnit ? { targetUnit } : undefined);
  }

  divide(request: TwoQuantityRequestDto): Observable<ApiResponse<QuantityResponseDto>> {
    return this.callApi<ApiResponse<QuantityResponseDto>>('/divide', 'POST', request);
  }

  getHistory(): Observable<ApiResponse<QuantityResponseDto[]>> {
    return this.callApi<ApiResponse<QuantityResponseDto[]>>('/history', 'GET');
  }

  clearHistory(): Observable<ApiResponse<void>> {
    return this.callApi<ApiResponse<void>>('/history', 'DELETE');
  }
}
