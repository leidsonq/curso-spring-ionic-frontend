import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';
import { CartService } from '../../services/domain/cart.service';
import { ProdutoDTO } from '../../models/produto.dto';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  items: CartItem[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public cartService: CartService,
    public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {
    //pegando o carrinho que está no localStorage pelo método getCart do CartService
    let cart = this.cartService.getCart();

    this.items = cart.items;
    this.loadImageUrls();

   }

  /**
  * verificando se cada produto do carrinho tem a imagem no Backet S3 e
  * setando a imagem ao produto caso a mesma exista 
  * */
  loadImageUrls() {
    //percorrendo a lista de itens para atribuir a imagens respectiva ao mesmo
    for (var i=0; i<this.items.length; i++){
       let item = this.items[i];
       this.produtoService.getSmallImageFromBucket(item.produto.id).subscribe(response => {
        item.produto.imageUrl = `${API_CONFIG.backetBaseUrl}/prod${item.produto.id}-small.jpg`;
      },
      error => {});
    }  
  }
  //chama o serviço para excluir o item do carrinho
  removeItem(produto: ProdutoDTO) {
    this.items = this.cartService.removeProduto(produto).items;
  }
  //chama o serviço que incrementa a qtd do item
  increaseQuantity(produto: ProdutoDTO) {
    this.items = this.cartService.increaseQuantity(produto).items;
  }
  //chama o serviço que decrementa a qtd do item
  decreaseQuantity(produto: ProdutoDTO) {
    this.items = this.cartService.decreaseQuantity(produto).items;
  }
  //chama o serviço que mostra preço total do carrinho
  total() : number {
    return this.cartService.total();
  }  
  //chama o serviço que direciona para a pagina de categorias
  goOn() {
    this.navCtrl.setRoot('CategoriasPage');
  }


}
