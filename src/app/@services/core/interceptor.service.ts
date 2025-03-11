import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import { catchError, finalize, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SpinnerService } from './spinner.service';
import { NotifyService } from './notify.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LocalstorageService } from './localstorage.service';

export const interceptorHandler: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const localstorageService = inject(LocalstorageService);
  const notifyService: NotifyService = inject(NotifyService);
  const spinnerService: SpinnerService = inject(SpinnerService);

  const Token = localstorageService.getToken();
  const authReq = request.clone({
    url: (request.url.includes('http')) ? request.url : `${environment.ApiUrl}${request.url}`,
    setHeaders: {
      Authorization: Token != null ? `Bearer ${Token}` : '',
    },
  });
  const setShowLoading = request.headers.get('x-Show-Loading');
  if (setShowLoading) {
    spinnerService.Activate();
  }
  return next(authReq).pipe(
    map((response) => {
      if (response instanceof HttpResponse) {
        let message =
          (response?.body as { message?: string })?.message ?? false;
        let acceptHttp = [200].includes(response.status);
        if (acceptHttp && message && setShowLoading) {
          notifyService.sucess(response.body);
        }
      }
      return response;
    }),
    catchError((error: HttpErrorResponse) => {
      notifyService.error(error.error);
      return throwError(error);
    }),
    finalize(() => {
      if (setShowLoading) {
        spinnerService.Desactivate();
      }
    })
  );
};
