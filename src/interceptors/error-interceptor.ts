import { HttpEvent, HttpInterceptor, HttpRequest, HttpHandler, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular/components/alert/alert-controller";
import { Observable } from 'rxjs/Rx';
import { FieldMessage } from "../models/fieldmessage";
import { StorageService } from "../services/storage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  
  constructor(
    public storage: StorageService,
    public alertC: AlertController){
  }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            console.log("Passou");
            return next.handle(req)
            .catch((error, caught) => {

              let errorObj= error;
              if (errorObj.error){
                errorObj = errorObj.error;
              }

              if (!errorObj.status){
                errorObj = JSON.parse(errorObj);
              }

              console.log("Erro detectado pelo interceptor");
              console.log(errorObj);

              switch(errorObj.status){
                case 403:
                  this.handle403();
                  break;

                case 401:
                  this.handle401();
                  break;

                case 422:
                  this.handle422(errorObj);
                  break;
                  
                
                default:
                  this.handleDefaultError(errorObj);
                  
              }

              return Observable.throw(errorObj);
            }) as any;
        }
        handle403(){
          this.storage.setLocalUser(null);
        }

        handle401(){
          let alert = this.alertC.create({
            title: 'Erro 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'OK'
              }
            ]
          });
          alert.present();
        }

        handle422(errorObj){
          let alert = this.alertC.create({
            title: 'Erro de validação!',
            message: this.listErrors(errorObj.errors),
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'OK'
              }
            ]
          });
          alert.present();
      
        }
      
        handleDefaultError(errorObj){
          let alert = this.alertC.create({
            title: 'Erro '+ errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
              {
                text: 'OK'
              }
            ]
          });
          alert.present();
        }

        private listErrors(messages : FieldMessage[]) : string {
          let s : string = '';
          for (var i=0; i<messages.length; i++) {
              s = s + '<p><strong>' + messages[i].fieldName + "</strong>: " + messages[i].message + '</p>';
          }
          return s;
      }
}

export const ErrorIterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};