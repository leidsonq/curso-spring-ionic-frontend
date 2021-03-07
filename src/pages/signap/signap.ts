import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';
import { CidadeDTO } from '../../models/cidade.dto';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';

@IonicPage()
@Component({
  selector: 'page-signap',
  templateUrl: 'signap.html',
})
export class SignapPage {

  formGroup: FormGroup;
  cidades: CidadeDTO[];
  estados: EstadoDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public estadoService: EstadoService) {

      this.formGroup = formBuilder.group({
        nome: ['Leidson', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
        email: ['leidson@gmail.com', [Validators.required, Validators.email]], 
        tipo: ['2', [Validators.required]],
        cpfOrCnpf: ['76566580093',[Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        senha: ['abc', [Validators.required]],
        logradouro: ['Rua Pj', [Validators.required]],
        numero: ['55-b',[Validators.required]],
        complemtno: ['Apt-05', []],
        bairro: ['Centro', [Validators.required]],
        cep: ['74.666-000', [Validators.required]],
        telefone1: ['62-90000-8965',[Validators.required]],
        telefone2: ['61-95555-0011', []],
        telefone3: ['', []],
        estadoId: [null, [Validators.required]],
        cidadeId: [null, [Validators.required]], 
      })
  }

      //listando os estados ao carregar a pagina
      ionViewDidLoad() {
        this.estadoService.findAll().subscribe(response=> {
          this.estados = response;     
        },
        error => {});
      }
  
    //buscando as cidades correspondente ao Estado selecionado
    updateCidades() {
      //pegando o estado que estar selecionado na lista do formulario
      let estado_id = this.formGroup.value.estadoId;
  
      this.cidadeService.findAll(estado_id).subscribe(response=> {
        this.cidades = response;
  
        //limpando o campo de cidade para receber a nova seleção
        this.formGroup.controls.cidadeId.setValue(null);
      },
      error => {});
    }

  signupUser(){
    console.log("Enviou o form");
  }

}
