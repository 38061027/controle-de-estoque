import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart,registerables } from 'chart.js';
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

  @ViewChild("meuCanvas", { static: true }) element!: ElementRef

  vendas: any[] = [];
  chart!: Chart


  constructor(private service: SharedService) { }

  ngOnInit(): void {
    this.getProdutos()
    this.service.getClients().subscribe(res => this.numeroClientes = res.length)
    Chart.register(...registerables);
    this.getVendas()
    this.initializeChart()

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


  initializeChart(): void {
    this.chart = new Chart(this.element.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Vendas',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Produtos',
              color: 'rgba(0, 0, 0, 1)'
            },
            ticks: {
              color: 'rgba(0, 0, 0, 1)'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Quantidade',
              color: 'rgba(0, 0, 0, 1)'
            },
            ticks: {
              color: 'rgba(0, 0, 0, 1)'
            }
          }
        },
        
      }
    });
  }


  getVendas(): void {
    this.service.getVendas().subscribe(res => {
      this.vendas = res.slice(0, 5);
      this.updateChart();
    });
  }


  updateChart() {
    this.chart.data.labels = this.vendas.map(el => el.produto)
    this.chart.data.datasets[0].data = this.vendas.map(el => el.qtd)
    this.chart.update();
  }


}
