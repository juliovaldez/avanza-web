import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import CustomStore from "devextreme/data/custom_store";
import DataSource from "devextreme/data/data_source";
import { LoadOptions, SearchOperation } from "devextreme/data/index";
import { map, catchError, Observable, filter } from "rxjs";
import { CustomStoreOptions } from "devextreme/data/custom_store";
import {
  GroupDescriptor,
  GroupItem,
  LoadFunctionResult,
  LoadResult,
  LoadResultObject,
} from "devextreme/common/data";
import { lastValueFrom } from "rxjs";
import { DxExtendedPromise } from "devextreme/core/utils/deferred";
import { DeepPartial } from "devextreme/core";
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { of } from "rxjs";

type cLoadOptions<T = any> = LoadOptions<T> & {
  isLoadingAll?: boolean;
};

type customStoreOptions<T, Number> = {
  load?: (options: LoadOptions<T>) => LoadFunctionResult<LoadResult<T>>;
} & CustomStoreOptions<T, Number>;

type GroupOption<T> = { group: GroupDescriptor<T> | Array<GroupDescriptor<T>> };

type dataStoreParams = {
  options?: cLoadOptions;
  key?: string;
  require_filter?: boolean;
};

type LoadResultGrouped<TItem = any> = LoadResultObject<TItem> & {
  data: Array<GroupItem<TItem>>;
  totalCount?: number;
  summary?: Array<any>;
  groupCount?: number;
};
type LoadResultFlat<TItem = any> = LoadResultObject<TItem> & {
  data: Array<TItem>;
  totalCount?: number;
  summary?: Array<any>;
  groupCount?: number;
};

export abstract class BaseResource {
  protected pathSuffix = "/";
  protected headers: { [key: string]: string } = {};
  constructor(protected httpClient: HttpClient, protected endPoint: string) {}

  protected getHeaders(): HttpHeaders {
    const headers = new HttpHeaders(this.headers ?? {});
    this.headers = {};
    return headers;
  }
  public showLoading() {
    this.headers = { "x-Show-Loading": "true" };
    return this;
  }
  protected mapToModelArray<T>(data: any[], mClass: new (data: any) => T): T[] {
    return data.map((item) => new mClass(item));
  }
}

class Store<T> extends CustomStore<T, Number> {
  protected pathSuffix = "/";
  protected headers: { [key: string]: string } = {};

  constructor(
    public options: customStoreOptions<T, Number>,
    private httpClient: HttpClient,
    private endPoint: string,
    private mClass: new (data: any) => T,
    public loadOptions: cLoadOptions<T>,
    public require_filter: boolean = false
  ) {
    super(options);
  }
  public _save(id: Number = 0, resource: T): Observable<T> {
    return id ? this._update(id, resource) : this._insert(resource);
  }
  override load(
    options: LoadOptions<T> = {}
  ): DxExtendedPromise<LoadResultObject<T>> {
    const promise = lastValueFrom(this._load(options));
    (promise as any).done = function (
      callback: (value: LoadResultObject<T>) => void
    ) {
      promise.then(callback);
      return this;
    };
    (promise as any).fail = function (callback: (error: any) => void) {
      promise.catch(callback);
      return this;
    };
    return promise as DxExtendedPromise<LoadResultObject<T>>;
  }
  override update(id: Number, resource: DeepPartial<T>): DxExtendedPromise<T> {
    return lastValueFrom(this._update(id, resource as T));
  }
  override insert(values: T): DxExtendedPromise<T> {
    return lastValueFrom(this._insert(values as T));
  }
  override remove(key: Number): DxExtendedPromise<void> {
    const promise = lastValueFrom(this._remove(key));
    (promise as any).done = function (callback: () => void) {
      promise.then(callback);
      return this;
    };
    (promise as any).fail = function (callback: (error: any) => void) {
      promise.catch(callback);
      return this;
    };
    return promise as DxExtendedPromise<void>;
  }
  override byKey(key: Number): DxExtendedPromise<T> {
    return lastValueFrom(this._byKey(key));
  }
  // 👉 Sobrecargas aquí:
  public _load(
    options: GroupOption<T> & cLoadOptions<T>
  ): Observable<LoadResultGrouped<T>>;
  public _load(options?: cLoadOptions<T>): Observable<LoadResultFlat<T>>;

  public _load(options: cLoadOptions<T> = {}): Observable<any> {
    Object.assign(options, this.loadOptions);
    const params = this.BuildParams(options);
    if (this.require_filter && !options.filter?.length) {
      return of({ data: [], totalCount: 0 });
    }
    return this.httpClient
      .get<LoadResultObject<T>>(`${this.endPoint}${this.pathSuffix}`, {
        params: params,
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: LoadResultObject<T>) => {
          if (options.group) {
            this.setSummaryArray(response.data, options);
            response.data = this.toModelGroupArray<T>(
              response.data as GroupItem<T>[],
              this.mClass
            );
          } else {
            response.data = this.mapToModelArray<T>(response.data, this.mClass);
          }
          return response as LoadResultObject<T>;
        })
      );
  }
  public _update(id: Number, resource: T): Observable<T> {
    return this.httpClient
      .put<any>(`${this.endPoint}/${id}${this.pathSuffix}`, resource, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: any) => {
          return new this.mClass(response.data);
        })
      );
  }
  public _insert(resource: T): Observable<T> {
    return this.httpClient
      .post<any>(`${this.endPoint}${this.pathSuffix}`, resource, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: any) => {
          return new this.mClass(response.data);
        })
      );
  }
  public _remove(id: Number): Observable<void> {
    return this.httpClient.delete<any>(
      `${this.endPoint}/${id}${this.pathSuffix}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
  public _byKey(id: Number): Observable<T> {
    return this.httpClient
      .get<any>(`${this.endPoint}/${id}${this.pathSuffix}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response: any) => {
          return new this.mClass(response.data) as T;
        })
      );
  }

  protected setSummaryArray(data: any[], options: cLoadOptions<T>) {
    if ("groupSummary" in options) {
      data.map((item) => {
        item.summary = [];
        (options.groupSummary as Array<any>).map((summary: any) => {
          const selector = summary.selector;
          const summaryType = summary.summaryType;
          item.summary.push(item[`${selector}_${summaryType}`]);
        });
      });
    }
  }

  protected mapToModelArray<T>(data: any[], mClass: new (data: any) => T): T[] {
    return data.map((item) => new mClass(item));
  }

  protected toModelGroupArray<T>(
    data: GroupItem<T>[],
    mClass: new (data: any) => T
  ): GroupItem<T>[] {
    return data.map((groupItem: GroupItem<T>) => {
      const group = {
        ...groupItem,
        items: groupItem.items, //? groupItem.items.map((item) => new mClass(item)) : []
      };
      return group;
    });
  }

  protected BuildParams(loadOptions: any): HttpParams {
    //console.log(loadOptions);
    let params: HttpParams = new HttpParams();
    [
      "isLoadingAll",
      "filter",
      "group",
      "groupSummary",
      "parentIds",
      "requireGroupCount",
      "requireTotalCount",
      "searchExpr",
      "searchOperation",
      "searchValue",
      "select",
      "sort",
      "skip",
      "take",
      "totalSummary",
      "userData",
    ].forEach((i) => {
      if (
        i in loadOptions &&
        this.isNotEmpty(loadOptions[i as keyof cLoadOptions<T>])
      ) {
        if (i == "sort") {
          const { desc, selector } = loadOptions[i as keyof cLoadOptions<T>][0];
          params = params.set("ordering", `${desc ? "-" : ""}${selector}`);
          return;
        }
        params = params.set(
          i,
          JSON.stringify(loadOptions[i as keyof cLoadOptions<T>])
        );
      }
    });

    if (!!!loadOptions.isLoadingAll) {
      const page = !!loadOptions.skip
        ? Math.ceil(loadOptions.skip / loadOptions.take!) + 1
        : 1;
      const page_size = !!loadOptions.take ? loadOptions.take : 10;

      params = params.set("page", page);
      params = params.set("page_size", page_size);
    }

    return params;
  }
  protected isNotEmpty(value: any): boolean {
    return value !== undefined && value !== null && value !== "";
  }
  protected getHeaders(): HttpHeaders {
    const headers = new HttpHeaders(this.headers ?? {});
    this.headers = {};
    return headers;
  }
  public showLoading() {
    this.headers = { "x-Show-Loading": "true" };
    return this;
  }
}

@Injectable({
  providedIn: "root",
})
export abstract class Resource<T> {
  constructor(
    protected httpClient: HttpClient,
    protected endPoint: string,
    protected mClass: new (data: any) => T
  ) {}

  public getStore(
    params: dataStoreParams = { options: {}, key: "id", require_filter: false }
  ): Store<T> {
    return new Store<T>(
      {
        key: params.key || "id",
      } as customStoreOptions<T, Number>,
      this.httpClient,
      this.endPoint,
      this.mClass,
      params.options || {},
      params.require_filter || false
    );
  }
  public getStoreASP(): AspNetData.CustomStore {
    return AspNetData.createStore({
      key: "id",
      loadUrl: `${this.endPoint}`,
      insertUrl: `${this.endPoint}`,
      updateUrl: `${this.endPoint}`,
      deleteUrl: `${this.endPoint}`,
      onBeforeSend: (operation, ajaxSettings) => {},
    });
  }
}
