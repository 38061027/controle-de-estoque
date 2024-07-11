import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-relatorio',
  templateUrl: './relatorio.component.html',
  styleUrls: ['./relatorio.component.scss']
})
export class RelatorioComponent implements OnInit {

  @ViewChild("meuCanvas", { static: true }) element!: ElementRef

  vendas: any[] = [];
  chart!: Chart


  constructor(private service: SharedService) { }

  ngOnInit(): void {
    Chart.register(...registerables);
    this.getVendas()
    this.initializeChart()
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
