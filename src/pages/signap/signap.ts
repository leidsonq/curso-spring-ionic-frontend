import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';

@IonicPage()
@Component({
  selector: 'page-signap',
  templateUrl: 'signap.html',
})
export class SignapPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  signupUser(){
    console.log("Enviou o form");
  }

}
