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

  @ViewChild("chartLine", { static: true }) elementLine!: ElementRef
  @ViewChild("chartPie", { static: true }) elementPie!: ElementRef

  vendas: any[] = [];
  chartLine!: Chart
  chartPie!: Chart | any


  constructor(private service: SharedService) { }

  ngOnInit(): void {
    this.getProdutos()
    this.service.getClients().subscribe(res => this.numeroClientes = res.length)
    Chart.register(...registerables);
    this.getVendas()
    this.initializeChartLine()
    this.initializeChartPie()
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


  initializeChartLine(): void {
    this.chartLine = new Chart(this.elementLine.nativeElement, {
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


  initializeChartPie() {
    this.chartPie = new Chart(this.elementPie.nativeElement, {
      type: 'pie',
      data: { 
        labels: [],
        datasets: [
          {
            label: 'Vendas',
            data: [],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)'
            ],
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Pie Chart'
          }
        }
      },
    });
  }


  getVendas(): void {
    this.service.getVendas().subscribe(res => {
      this.vendas = res.slice(0, 5);
      this.updateChart();
      this.updateChartPie();
    });
  }


  updateChart() {
    this.chartLine.data.labels = this.vendas.map(el => el.produto)
    this.chartLine.data.datasets[0].data = this.vendas.map(el => el.qtd)
    this.chartLine.update();
  }

  updateChartPie() {
    this.chartPie.data.labels = this.vendas.map(el => el.cliente)
    this.chartPie.data.datasets[0].data = this.vendas.map(el => el.qtd)
    this.chartPie.update();
  }


}
