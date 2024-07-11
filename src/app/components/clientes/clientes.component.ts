import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit{
  displayedColumns: string[] = ['id', 'name', 'telefone'];
  clientes!:any[]

  constructor(private service:SharedService){}

  ngOnInit(): void {
    this.getClientes()
  }

  getClientes(){
    this.service.getClients().subscribe(res => this.clientes = res)
  }

}
