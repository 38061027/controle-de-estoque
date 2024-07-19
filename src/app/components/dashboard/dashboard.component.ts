import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
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
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['id', 'produto', 'qtd', 'valor'];
  products!: any[];
  amountSpent: number = 0;
  quantityCostumer: number = 0;
  quantityProducts: number = 0;
  saleProduct: string = '';

  @ViewChild('chartLine', { static: true }) elementLine!: ElementRef;
  @ViewChild('chartPie', { static: true }) elementPie!: ElementRef;

  sales: any[] = [];
  chartLine!: Chart;
  chartPie!: Chart | any;

  constructor(private service: SharedService) {}

  ngOnInit(): void {
    this.getProdutos();
    this.service
      .getClients()
      .subscribe((res) => (this.quantityCostumer = res.length));
    Chart.register(...registerables);
    this.getVendas();
    this.initializeChartLine();
    this.initializeChartPie();
  }

  getProdutos() {
    this.service.getProducts().subscribe((res: any[]) => {
      this.quantityProducts = res.length;
    });
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
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Produtos',
              color: 'rgba(0, 0, 0, 1)',
            },
            ticks: {
              color: 'rgba(0, 0, 0, 1)',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Quantidade',
              color: 'rgba(0, 0, 0, 1)',
            },
            ticks: {
              color: 'rgba(0, 0, 0, 1)',
            },
          },
        },
      },
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
              'rgba(75, 192, 192, 1)',
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  getVendas(): void {
    this.service.getSales().subscribe((res) => {
      this.sales = res.slice(0, 5);
      let bestSalerCounter = 0;
      res.forEach((sale) => {
        this.amountSpent += sale.quantity * sale.price;
        if (sale.quantity > bestSalerCounter) {
          bestSalerCounter = sale.quantity;
        }
        if (bestSalerCounter == sale.quantity) {
          this.saleProduct = sale.product;
        }
      });
      this.updateChart();
      this.updateChartPie();
    });
  }

  updateChart() {
    this.chartLine.data.labels = this.sales.map((el) => el.product);
    this.chartLine.data.datasets[0].data = this.sales.map((el) => el.quantity);
    this.chartLine.update();
  }

  updateChartPie() {
    this.chartPie.data.labels = this.sales.map((el) => el.costumer);
    this.chartPie.data.datasets[0].data = this.sales.map((el) => el.quantity);
    this.chartPie.update();
  }
}
