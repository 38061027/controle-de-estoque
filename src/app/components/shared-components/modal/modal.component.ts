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
  registerProduct!: FormGroup;
  method: string = '';
  id!: string;

  constructor(
    private dialogRef: MatDialogRef<ModalComponent>,
    private fb: FormBuilder,
    private service: SharedService
  ) {
    this.registerProduct = this.fb.group({
      produto: ['', Validators.required],
      price: ['', Validators.required],
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
        this.service.getProducts().subscribe((res) => {
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
    this.registerProduct.setValue({
      produto: produto.produto,
      price: produto.price,
      qtd: produto.qtd,
    });
  }

  deleteProduct() {
    this.service.deleteProduct(this.id).subscribe();
  }

  onSubmit() {
    if (this.registerProduct.valid && this.method == '') {
      this.service.sendProducts(this.registerProduct.value).subscribe();
    }
    if (this.registerProduct.valid && this.method == 'editar') {
      this.service
        .editProducts(this.registerProduct.value, this.id)
        .subscribe();
    }
  }
}
