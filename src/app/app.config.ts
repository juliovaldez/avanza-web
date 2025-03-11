import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { interceptorHandler } from '@services/core/interceptor.service';
import { LAZY_WIDGETS_ROOT, lazyLoadToObjRoot } from '@services/core';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([interceptorHandler])),
    { provide: LAZY_WIDGETS_ROOT, useValue: lazyLoadToObjRoot() },
  ],
};  
 
