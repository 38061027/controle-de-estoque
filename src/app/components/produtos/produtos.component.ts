import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../shared-components/modal/modal.component';


@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'produto', 'qtd', 'valor'];
  productsEstoque!: any[]
  productsFalta!: any[]
  animal = '';
  name = '';
  lastId = 0
  constructor(private service: SharedService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getProductsEstoque()
    this.getProductsFalta()
  }



  openDialog(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getProductsEstoque()
      this.getProductsFalta()
      if (result !== undefined) {
        this.animal = result;
      }
    });
  }


  getProductsEstoque() {
    this.service.getProdutos().pipe(
      map((res: any[]) => res.filter(el => el.qtd !== 0)),
    ).subscribe(res => this.productsEstoque = res)
  }

  getProductsFalta() {
    this.service.getProdutos().pipe(
      map((res: any[]) => res.filter(el => el.qtd == 0)),
    ).subscribe(res => this.productsFalta = res)
  }
}
