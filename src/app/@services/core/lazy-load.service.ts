import {
  Compiler,
  ComponentFactoryResolver,
  Inject,
  Injectable,
  Injector,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { LAZY_WIDGETS_ROOT, lazyWidgets } from '@services/core';

@Injectable({
  providedIn: 'root',
})
export class LazyLoadService {
  constructor(
    @Inject(LAZY_WIDGETS_ROOT)
    private lazyWidgets: { [key: string]: () => Promise<Type<any>> }
  ) {}

  async load(name: lazyWidgets, container: ViewContainerRef) {
    container.clear();
    const componentType = await this.lazyWidgets[name]();
    const containerRef = container.createComponent(componentType);
    return containerRef.instance;
  }
}
