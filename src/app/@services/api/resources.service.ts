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
  SaleProfile,
} from "@models/index";
import { map, Observable } from "rxjs";
import { LoadResultObject } from "devextreme/common/data";

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

  private insertInventoryProfile(user_id: number, resource: any): Observable<SaleProfile> {
    return this.httpClient
      .post<any>(`${this.endPoint}/${user_id}/inventory-profile/`, resource, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          return new SaleProfile(response.data);
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
          return new SaleProfile(response.data);
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
          return new SaleProfile(response.data);
        })
      );
  }
  saveInventoryProfile(user_id: number = 0, resource: any) {
    return resource.id
      ? this.updateInventoryProfile(user_id, resource)
      : this.insertInventoryProfile(user_id, resource);
  }

  getMaterialsByLocation(user_id: number, location_id: number = 0): Observable<LoadResultObject<MaterialByUser>> {
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
export class SaleProfileService extends Resource<SaleProfile> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/sale-profile", Unit);
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
