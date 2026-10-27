export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
}

export interface IPaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IDriverLocationEvent {
  driverId: string;
  tripId?: string;
  latitude: number;
  longitude: number;
  speed?: number;
  bearing?: number;
  timestamp: string;
}

export interface IAuditLog {
  id: string;
  staffId: string;
  action: string;
  entity: string;
  entityId: string;
  diff?: Record<string, unknown> | null;
  createdAt: Date | string;
}
