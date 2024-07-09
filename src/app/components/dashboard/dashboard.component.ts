import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['id', 'produto', 'qtd', 'valor'];
  products!: any[]
  totalVendas: number = 0
  numeroClientes: number = 0
  numeroProdutos: number = 0


  constructor(private service: SharedService) { }

  ngOnInit(): void {
    this.getProdutos()
    this.service.getClients().subscribe(res => this.numeroClientes = res.length)

  }

  getProdutos() {
    this.service.getProdutos().subscribe((res: any[]) => {
      this.numeroProdutos = res.length
      this.service.getVendas().subscribe((vendas: any[]) => {
        this.products = vendas.slice(0,5)
        res.forEach(porducts => {
          vendas.forEach(s => {
            if (porducts.produto === s.produto) {
              this.totalVendas += s.qtd * porducts.valor
            }
          })
        })

      })
    })
  }


}
