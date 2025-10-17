export interface BaseTConfig {
  onPopup: boolean;
}

export interface BaseTData<TModel, TConfig extends BaseTConfig = BaseTConfig> {
  model: TModel;
  config: TConfig;
}

export interface LazyComponent<TInput extends BaseTData<any, BaseTConfig>> {
  inicializate(data: TInput): void;
  showOnPopup(): void;
}
