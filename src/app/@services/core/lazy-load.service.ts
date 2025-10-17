import { Inject, Injectable, Type, ViewContainerRef } from "@angular/core";
import { LAZY_WIDGETS_ROOT, lazyWidgets } from "@services/core";
import type { WidgetDataMap } from "@services/core/lazy-components";

export interface LazyloadComponent<
  K extends keyof WidgetDataMap & lazyWidgets
> {
  component_name: K;
  container: ViewContainerRef;
  data: WidgetDataMap[K];
}

@Injectable({
  providedIn: "root",
})
export class LazyLoadService {
  constructor(
    @Inject(LAZY_WIDGETS_ROOT)
    private lazyWidgets: Record<lazyWidgets, () => Promise<Type<any>>>
  ) {}

  async load<K extends keyof WidgetDataMap & lazyWidgets>(
    componentData: LazyloadComponent<K>
  ): Promise<any> {
    componentData.container.clear();
    const componentType = await this.lazyWidgets[
      componentData.component_name
    ]();
    const containerRef = componentData.container.createComponent(
      componentType as Type<any>
    );
    const instance = containerRef.instance as any;

    if (
      componentData?.data?.config?.onPopup &&
      typeof instance.showOnPopup === "function"
    ) {
      instance.showOnPopup();
    }

    if (componentData.data && typeof instance.inicializate === "function") {
      instance.inicializate(componentData.data);
    }

    return instance;
  }
}
