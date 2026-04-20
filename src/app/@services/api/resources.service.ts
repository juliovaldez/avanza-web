import { BaseResource, Resource } from "../api/resource";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  Permission,
  Unit,
  Group,
  Status,
  Material,
  UnitConversion,
  Kit,
  TransactionType,
  TxnDocument,
  Transaction,
  User,
  Location,
  MaterialByUser,
  InventoryProfile,
  FiberGoProfile,
  OrbitRegistry,
  FiberTask,
  Testimonio,
  CasoExito,
  ContactoConfig,
} from "@models/index";
import { map, Observable } from "rxjs";
import { LoadResultObject } from "devextreme/common/data";
import { OrbitSync } from "@models-dto/OrbitSync";
import { TxnSnapshotDaily } from "@models/txnSnapshotDaily";
import { TxnShapshot } from "@models-dto/TxnShapshot";

@Injectable({ providedIn: "root" })
export class UserService extends Resource<User> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/user", User);
  }
}

@Injectable({ providedIn: "root" })
export class UserFetcherService extends BaseResource {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/user");
  }

  private insertInventoryProfile(
    user_id: number,
    resource: any
  ): Observable<InventoryProfile> {
    return this.httpClient
      .post<any>(`${this.endPoint}/${user_id}/inventory-profile/`, resource, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          return new InventoryProfile(response.data);
        })
      );
  }
  private updateInventoryProfile(user_id: number, resource: any) {
    return this.httpClient
      .put<any>(`${this.endPoint}/${user_id}/inventory-profile/`, resource, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          return new InventoryProfile(response.data);
        })
      );
  }
  getInventoryProfile(user_id: number) {
    return this.httpClient
      .get<any>(`${this.endPoint}/${user_id}/inventory-profile/`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          return new InventoryProfile(response.data);
        })
      );
  }
  saveInventoryProfile(user_id: number = 0, resource: any) {
    return resource.id
      ? this.updateInventoryProfile(user_id, resource)
      : this.insertInventoryProfile(user_id, resource);
  }
  getMaterialsByLocation(
    user_id: number,
    location_id: number = 0
  ): Observable<LoadResultObject<MaterialByUser>> {
    let params: HttpParams = new HttpParams();
    if (location_id) {
      params = params.set("location_id", location_id);
    }
    return this.httpClient
      .get<any>(`${this.endPoint}/${user_id}/materials-by-location/`, {
        params: params,
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: any) => {
          response.data = this.mapToModelArray(response.data, MaterialByUser);
          response.totalCount = (response as any).count;
          return response as LoadResultObject<MaterialByUser>;
        })
      );
  }
}

@Injectable({ providedIn: "root" })
export class InventoryProfileService extends Resource<InventoryProfile> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/inventory-profile", InventoryProfile);
  }
}
@Injectable({ providedIn: "root" })
export class InventoryProfileFetcherService extends BaseResource {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/inventory-profile");
  }
  public executeDailySnapshot(resource: TxnShapshot): Observable<boolean> {
    return this.httpClient
      .post<any>(`${this.endPoint}/execute_daily_snapshot/`, resource, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
@Injectable({ providedIn: "root" })
export class FiberGoProfileService extends Resource<FiberGoProfile> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/fibergo-profile", FiberGoProfile);
  }
}

@Injectable({ providedIn: "root" })
export class FiberGoProfileFetcherService extends BaseResource {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/fibergo-profile");
  }
  public executeOrbit(resource: OrbitSync): Observable<boolean> {
    return this.httpClient
      .post<any>(`${this.endPoint}/execute_orbit/`, resource, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }
}
@Injectable({ providedIn: "root" })
export class GroupService extends Resource<Group> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/group", Group);
  }
}

@Injectable({ providedIn: "root" })
export class PermissionService extends Resource<Permission> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/permission", Permission);
  }
}

@Injectable({ providedIn: "root" })
export class UnitService extends Resource<Unit> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/units", Unit);
  }
}

@Injectable({ providedIn: "root" })
export class LocationService extends Resource<Location> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/location", Location);
  }
}

@Injectable({ providedIn: "root" })
export class UserHasLocationService extends Resource<Object> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/user-has-location", Object);
  }
}

@Injectable({ providedIn: "root" })
export class StatusService extends Resource<Status> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/status", Status);
  }
}

@Injectable({ providedIn: "root" })
export class MaterialService extends Resource<Material> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/material", Material);
  }
}

@Injectable({ providedIn: "root" })
export class UnitConversionService extends Resource<UnitConversion> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/unit-conversion", UnitConversion);
  }
}

@Injectable({ providedIn: "root" })
export class KitService extends Resource<Kit> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/kit", Kit);
  }
}
@Injectable({ providedIn: "root" })
export class TransactionTypeService extends Resource<TransactionType> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/transaction-type", TransactionType);
  }
}

@Injectable({ providedIn: "root" })
export class TxnDocumentService extends Resource<TxnDocument> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/txn-document", TxnDocument);
  }
}

@Injectable({ providedIn: "root" })
export class TransactionService extends Resource<Transaction> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/transaction", Transaction);
  }
}

@Injectable({ providedIn: "root" })
export class OrbitRegistryService extends Resource<OrbitRegistry> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/orbit-registry", OrbitRegistry);
  }
}

@Injectable({ providedIn: "root" })
export class FiberTaskService extends Resource<FiberTask> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/fiber-task", FiberTask);
  }
}

@Injectable({ providedIn: "root" })
export class TxnSnaphotDailyChartService extends Resource<TxnSnapshotDaily> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/txn-snapshot-daily", TxnSnapshotDaily);
  }
}

@Injectable({ providedIn: "root" })
export class ContactoService extends BaseResource {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/contacto");
  }

  public getAll(): Observable<ContactoConfig[]> {
    return this.httpClient
      .get<any>(`${this.endPoint}/`, { headers: this.getHeaders() })
      .pipe(map((r) => (r.data as any[]).map((item) => new ContactoConfig(item))));
  }

  public create(payload: ContactoConfig): Observable<ContactoConfig> {
    return this.httpClient
      .post<any>(`${this.endPoint}/`, payload, { headers: this.getHeaders() })
      .pipe(map((r) => new ContactoConfig(r.data)));
  }

  public update(id: number, payload: ContactoConfig): Observable<ContactoConfig> {
    return this.httpClient
      .patch<any>(`${this.endPoint}/${id}/`, payload, { headers: this.getHeaders() })
      .pipe(map((r) => new ContactoConfig(r.data)));
  }

  public getPublic(): Observable<ContactoConfig | null> {
    return this.httpClient
      .get<any>(`${this.endPoint}/public/`)
      .pipe(map((r) => (r.data ? new ContactoConfig(r.data) : null)));
  }
}

@Injectable({ providedIn: "root" })
export class CasoExitoService extends Resource<CasoExito> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/caso-exito", CasoExito);
  }
}

@Injectable({ providedIn: "root" })
export class CasoExitoFetcherService extends BaseResource {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/caso-exito");
  }

  public create(payload: FormData): Observable<CasoExito> {
    return this.httpClient
      .post<any>(`${this.endPoint}/`, payload, { headers: this.getHeaders() })
      .pipe(map((r) => new CasoExito(r.data)));
  }

  public update(id: number, payload: FormData): Observable<CasoExito> {
    return this.httpClient
      .patch<any>(`${this.endPoint}/${id}/`, payload, { headers: this.getHeaders() })
      .pipe(map((r) => new CasoExito(r.data)));
  }

  public getPublic(): Observable<CasoExito[]> {
    return this.httpClient
      .get<any>(`${this.endPoint}/public/`)
      .pipe(map((r) => (r.data as any[]).map((item) => new CasoExito(item))));
  }
}

@Injectable({ providedIn: "root" })
export class TestimonioService extends Resource<Testimonio> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/testimonial", Testimonio);
  }
}

@Injectable({ providedIn: "root" })
export class TestimonioFetcherService extends BaseResource {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/testimonial");
  }

  public create(payload: FormData): Observable<Testimonio> {
    return this.httpClient
      .post<any>(`${this.endPoint}/`, payload, { headers: this.getHeaders() })
      .pipe(map((r) => new Testimonio(r.data)));
  }

  public update(id: number, payload: FormData): Observable<Testimonio> {
    return this.httpClient
      .patch<any>(`${this.endPoint}/${id}/`, payload, { headers: this.getHeaders() })
      .pipe(map((r) => new Testimonio(r.data)));
  }

  public getPublic(): Observable<Testimonio[]> {
    return this.httpClient
      .get<any>(`${this.endPoint}/public/`)
      .pipe(map((r) => (r.data as any[]).map((item) => new Testimonio(item))));
  }
}
