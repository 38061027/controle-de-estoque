import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss']
})
export class VendasComponent implements OnInit {

  vendas!: FormGroup
  clientes!: any[]
  produtos!: any[]
  isDisabled = true;

  constructor(private fb: FormBuilder,
    private service: SharedService
  ) {
    this.vendas = this.fb.group({
      cliente: ['', Validators.required],
      produto: ['', Validators.required],
      qtd: ['', Validators.required],
      valor: [''],
      id: ['']
    })
  }

  ngOnInit(): void {
    this.onSubmit()
    this.getClientes()
    this.getProdutos()
    this.vendas.valueChanges.subscribe(res => {
      this.produtos.forEach(produto => {
        if (produto.produto === res.produto) {
          const valor = res.qtd * produto.valor;
          const id = produto.id
          this.vendas.patchValue({ valor, id }, { emitEvent: false });
        }
      });
    });
  }


  onSubmit() {
    if (this.vendas.valid) {
      console.log(this.vendas.value)
      this.service.sendVendas(this.vendas.value).subscribe()
    }
  }

  getClientes() {
    this.service.getClients().subscribe(res => this.clientes = res)
  }
  getProdutos() {
    this.service.getProdutos().subscribe(res => this.produtos = res)
  }

}
