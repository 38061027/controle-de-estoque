import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  cadastrarProduto!: FormGroup;
  method: string = '';
  id!: string;

  constructor(
    private dialogRef: MatDialogRef<ModalComponent>,
    private fb: FormBuilder,
    private service: SharedService
  ) {
    this.cadastrarProduto = this.fb.group({
      produto: ['', Validators.required],
      valor: ['', Validators.required],
      qtd: ['', Validators.required],
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.onSubmit();
    this.service.currentMethod.subscribe((res) => (this.method = res));
    this.service.currentId.subscribe((res) => (this.id = res));

    if (this.method == 'editar') {
      if (this.id) {
        this.service.getProdutos().subscribe((res) => {
          const produto = res.find((el: any) => el.id == this.id);
          if (produto) {
            this.preencherFormulario(produto);
          }
        });
      }
    }
  }

  editProduct(product: any, id: string) {
    this.service.editProducts(product, id).subscribe(() => {
      this.dialogRef.close();
    });
  }

  preencherFormulario(produto: any): void {
    this.cadastrarProduto.setValue({
      produto: produto.produto,
      valor: produto.valor,
      qtd: produto.qtd,
    });
  }

  deleteProduct() {
    this.service.deleteProduct(this.id).subscribe();
  }

  onSubmit() {
    if (this.cadastrarProduto.valid && this.method == '') {
      this.service.sendProducts(this.cadastrarProduto.value).subscribe();
    }
    if (this.cadastrarProduto.valid && this.method == 'editar') {
      this.service
        .editProducts(this.cadastrarProduto.value, this.id)
        .subscribe();
    }
  }
}
