
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  cadastrarProduto!: FormGroup


  constructor(private dialogRef: MatDialogRef<ModalComponent>,
    private fb: FormBuilder,
    private service: SharedService
  ) {

    this.cadastrarProduto = this.fb.group({
      produto: ['', Validators.required],
      valor: ['', Validators.required],
      qtd: ['', Validators.required],
    })


  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.onSubmit()

  }

  onSubmit() {
    if (this.cadastrarProduto.valid) {
      this.service.getProdutos().subscribe()
    }
  }

}
