import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss'],
})
export class VendasComponent implements OnInit {
  displayedColumns: string[] = ['id', 'costumer', 'product', 'amountSpent'];
  sales!: FormGroup;
  costumers!: any[];
  products!: any[];
  allSales!: any[];
  isDisabled = true;

  constructor(private fb: FormBuilder, private service: SharedService) {
    this.sales = this.fb.group({
      costumer: ['', Validators.required],
      produto: ['', Validators.required],
      quantity: ['', Validators.required],
      price: [''],
      id: [''],
    });
  }

  ngOnInit(): void {
    this.onSubmit();
    this.getClientes();
    this.getSales();
    this.getProdutos();
    this.sales.valueChanges.subscribe((res) => {
      this.products.forEach((product) => {
        if (product.produto === res.produto) {
          const price = res.quantity * product.price;
          const id = product.id;
          this.sales.patchValue({ price, id }, { emitEvent: false });
        }
      });
    });
  }

  onSubmit() {
    if (this.sales.valid) {
      this.service.getSales().subscribe((clients: any[]) => {
        const currentClient = this.sales.get('costumer')!.value;
        const existingClient = clients.find(
          (c: any) => c.costumer === currentClient
        );

        if (existingClient) {
          this.service
            .updateSales(this.sales.value, existingClient.id)
            .subscribe();
        } else {
          this.service.sendSales(this.sales.value).subscribe();
        }
      });
    }
  }

  getClientes() {
    this.service.getClients().subscribe((res) => (this.costumers = res));
  }
  getProdutos() {
    this.service
      .getProducts()
      .pipe(
        map((products: any[]) =>
          products.filter((product) => product.quantity !== 0)
        )
      )
      .subscribe((res) => (this.products = res));
  }

  getSales() {
    this.service.getSales().subscribe((res) => (this.allSales = res));
  }
}
