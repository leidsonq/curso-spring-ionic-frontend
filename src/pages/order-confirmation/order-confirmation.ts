import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from '../../models/cart-item';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { CartService } from '../../services/domain/cart.service';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codpedido: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public clienteService: ClienteService,
    public cartService: CartService,
    public pedidoService: PedidoService) {
    //recupera o pedido passado como parâmetro na chamada desta página  
    this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items;
    //busca para certificar que o pedido é para o cliente logado
    this.clienteService.findById(this.pedido.cliente.id)
      .subscribe(response => {
        //recuperar apenas os dados necessários ao clienteDTO
        this.cliente = response as ClienteDTO;
        //recupera os endereços da resposta e passa como parâmetro para o método bucar o endereço pelo id
        this.endereco = this.findEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']);
      },
      error => {
        this.navCtrl.setRoot('HomePage');
      });
  }
  //busca o endereço pelo id
  private findEndereco(id: string, list: EnderecoDTO[]) : EnderecoDTO {
    let position = list.findIndex(x => x.id == id);
    return list[position];
  }

  total() : number {
    return this.cartService.total();
  } 
  //volta para a pag do carrinho
  back() {
    this.navCtrl.setRoot('CartPage');
  }

  //chama o serviço para salvar o pedido no banco de dados
  checkout() {
    this.pedidoService.insert(this.pedido)
      .subscribe(response => {
        this.cartService.creatOrClearCart();
        this.codpedido = this.extractId(response.headers.get('location'));
      },
      error => {
        if (error.status == 403) {
          this.navCtrl.setRoot('HomePage');
        }
      });
  }
  //retorna o numero do pedido obitido através do location
  private extractId(location : string) : string {
    let position = location.lastIndexOf('/');
    return location.substring(position + 1, location.length);
  }

  home() {
    this.navCtrl.setRoot('CategoriasPage');
  }

}