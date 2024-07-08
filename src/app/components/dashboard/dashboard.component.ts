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
  dataSource: any[] = []
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
    this.products = res.slice(5)
      this.dataSource = res
     this.numeroProdutos = res.length
      this.service.getVendas().subscribe((v: any[]) => {
        res.forEach(p => {
          v.forEach(s => {
            if (p.produto === s.produto) {
              this.totalVendas += s.qtd * p.valor
            }
          })
        })

      })
    })
  }


}
