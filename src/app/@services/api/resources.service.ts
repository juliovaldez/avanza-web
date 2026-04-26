import { BaseResource, Resource } from "../api/resource";
import CustomStore from "devextreme/data/custom_store";
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
  User,
  Location,
  Testimonio,
  CasoExito,
  ContactoConfig,
  Estado,
  Municipio,
  CargaSepomex,
  Catalogo,
  Propiedad,
} from "@models/index";
import { map, Observable, lastValueFrom } from "rxjs";

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

@Injectable({ providedIn: "root" })
export class SepomexCargaService extends BaseResource {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/sepomex/carga");
  }

  public cargar(archivo: File): Observable<CargaSepomex> {
    const fd = new FormData();
    fd.append("archivo", archivo);
    return this.httpClient
      .post<any>(`${this.endPoint}/cargar/`, fd, { headers: this.getHeaders() })
      .pipe(map((r) => new CargaSepomex(r.data)));
  }

  public ultimoEstado(): Observable<CargaSepomex | null> {
    return this.httpClient
      .get<any>(`${this.endPoint}/ultimo-estado/`, { headers: this.getHeaders() })
      .pipe(map((r) => (r.data ? new CargaSepomex(r.data) : null)));
  }
}

@Injectable({ providedIn: "root" })
export class SepomexFetcherService extends BaseResource {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/sepomex");
  }

  public getEstados(): Observable<Estado[]> {
    return this.httpClient
      .get<any>(`${this.endPoint}/estado/?isLoadingAll=true`, { headers: this.getHeaders() })
      .pipe(map((r) => (r.data as any[]).map((d) => new Estado(d))));
  }

  public getMunicipios(estadoId?: number): Observable<Municipio[]> {
    let url = `${this.endPoint}/municipio/?isLoadingAll=true`;
    if (estadoId) url += `&estado_id=${estadoId}`;
    return this.httpClient
      .get<any>(url, { headers: this.getHeaders() })
      .pipe(map((r) => (r.data as any[]).map((d) => new Municipio(d))));
  }

  public getAsentamientosByCP(cp: string): Observable<any[]> {
    return this.httpClient
      .get<any>(`${this.endPoint}/asentamiento/?cp=${cp}&isLoadingAll=true`, {
        headers: this.getHeaders(),
      })
      .pipe(map((r) => r.data ?? []));
  }

  public getAsentamientosByMunicipio(municipioId: number): Observable<any[]> {
    return this.httpClient
      .get<any>(`${this.endPoint}/asentamiento/?municipio_id=${municipioId}&isLoadingAll=true`, {
        headers: this.getHeaders(),
      })
      .pipe(map((r) => r.data ?? []));
  }

  public getAsentamientosStore(
    estadoId?: number | null,
    municipioId?: number | null,
    cp?: string
  ) {
    const base = `${this.endPoint}/asentamiento/`;
    const http = this.httpClient;
    const getH = () => this.getHeaders();

    return {
      key: "id",
      load: (opts: any) => {
        let params = new HttpParams();
        const page = opts.skip ? Math.ceil(opts.skip / (opts.take ?? 20)) + 1 : 1;
        params = params.set("page", page).set("page_size", opts.take ?? 20);
        if (estadoId) params = params.set("estado_id", estadoId);
        if (municipioId) params = params.set("municipio_id", municipioId);
        if (cp) params = params.set("cp", cp);
        return lastValueFrom(
          http.get<any>(base, { params, headers: getH() }).pipe(
            map((r) => ({ data: r.data, totalCount: r.totalCount }))
          )
        );
      },
    };
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Catálogos de Propiedad — servicio genérico
// ────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: "root" })
export class CatalogoService extends BaseResource {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/catalogs");
  }

  /**
   * Devuelve un CustomStore para el tipo de catálogo indicado.
   * Soporta load, insert, update y remove en el mismo endpoint.
   */
  getStore(tipo: string): CustomStore {
    const url  = `${this.endPoint}/${tipo}/`;
    const http = this.httpClient;
    const svc  = this;

    return new CustomStore({
      key: "id",

      load: () =>
        lastValueFrom(
          http
            .get<any>(url, {
              params: new HttpParams().set("isLoadingAll", "true"),
              headers: svc.getHeaders(),
            })
            .pipe(map((r) => ({ data: r.data ?? [], totalCount: r.totalCount ?? 0 })))
        ),

      insert: (values: Partial<Catalogo>) =>
        lastValueFrom(
          http
            .post<any>(url, values, { headers: svc.getHeaders() })
            .pipe(map((r) => r.data))
        ),

      update: (key: number, values: Partial<Catalogo>) =>
        lastValueFrom(
          http
            .patch<any>(`${url}${key}/`, values, { headers: svc.getHeaders() })
            .pipe(map((r) => r.data))
        ),

      remove: (key: number) =>
        lastValueFrom(
          http
            .delete<void>(`${url}${key}/`, { headers: svc.getHeaders() })
            .pipe(map(() => undefined))
        ),
    });
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Propiedades
// ────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: "root" })
export class PropiedadService extends Resource<Propiedad> {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/propiedades/propiedad", Propiedad);
  }
}

@Injectable({ providedIn: "root" })
export class PropiedadFetcherService extends BaseResource {
  constructor(httpClient: HttpClient) {
    super(httpClient, "/propiedades/propiedad");
  }

  getById(id: number): Observable<Propiedad> {
    return this.httpClient
      .get<any>(`${this.endPoint}/${id}/`, { headers: this.getHeaders() })
      .pipe(map((r) => new Propiedad(r.data)));
  }

  create(data: Partial<Propiedad>): Observable<Propiedad> {
    return this.httpClient
      .post<any>(`${this.endPoint}/`, data, { headers: this.getHeaders() })
      .pipe(map((r) => new Propiedad(r.data)));
  }

  update(id: number, data: Partial<Propiedad>): Observable<Propiedad> {
    return this.httpClient
      .patch<any>(`${this.endPoint}/${id}/`, data, { headers: this.getHeaders() })
      .pipe(map((r) => new Propiedad(r.data)));
  }

  delete(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.endPoint}/${id}/`, { headers: this.getHeaders() })
      .pipe(map(() => undefined));
  }
}
