import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../shared-components/modal/modal.component';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss'],
})
export class ProdutosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'produto', 'quantity', 'price', 'acoes'];
  productsStock!: any[];
  productsNoStock!: any[];
  lastId = 0;

  constructor(private service: SharedService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getProductsEstoque();
    this.getProductsFalta();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {});
    this.service.reqMethod('');
    dialogRef.afterClosed().subscribe(() => {
      this.getProductsEstoque();
      this.getProductsFalta();
    });
  }

  editProduct(product: any, method: string) {
    this.openDialog();
    this.service.reqMethod(method);
    this.service.currentIdEdit(product.id);
  }

  deleteProduct(product: any, method: string) {
    this.openDialog();
    this.service.reqMethod(method);
    this.service.currentIdEdit(product.id);
  }

  getProductsEstoque() {
    this.service
      .getProducts()
      .pipe(map((res: any[]) => res.filter((el) => el.quantity !== 0)))
      .subscribe((res) => (this.productsStock = res));
  }

  getProductsFalta() {
    this.service
      .getProducts()
      .pipe(map((res: any[]) => res.filter((el) => el.quantity == 0)))
      .subscribe((res) => (this.productsNoStock = res));
  }
}
