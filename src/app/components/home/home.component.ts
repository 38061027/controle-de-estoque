import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  actualRoute:number = 1

  routers = [
    {name:'Dashboard', num:1},
    {name:'Produtos', num:2},
    {name:'Clientes',  num:3},
    {name:'Vendas',  num:4},
  ]


  tabs(n:number){
    this.actualRoute = n
  }

}
