import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';
import { SignapPage } from './signap';

@NgModule({
  declarations: [
    SignapPage,
  ],
  imports: [
    IonicPageModule.forChild(SignapPage),
  ],
  providers: [
    CidadeService,
    EstadoService
  ]
})
export class SignapPageModule {}
