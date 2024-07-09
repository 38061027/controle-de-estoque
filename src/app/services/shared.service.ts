import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private url:string = 'http://localhost:3000'
  lastId: number = 0

  constructor(private http: HttpClient) { 
    this.getProdutos().subscribe((produtos: any[] | undefined) => {
      if (produtos && produtos.length > 0) {
        const lastProductId = produtos[produtos.length - 1];
        this.lastId = parseInt(lastProductId.id, 10);
      }
    });
  }

  getProdutos():Observable<any[]>{
    return this.http.get<any[]>(`${this.url}/produtos`)
  }

  getVendas():Observable<any[]>{
    return this.http.get<any[]>(`${this.url}/vendas`)
  }

  getClients():Observable<any[]>{
    return this.http.get<any[]>(`${this.url}/clientes`)
  }



  sendProducts(produto:any):Observable<any>{
    this.lastId++;
    produto.id = this.lastId.toString();
    return this.http.post<any>(`${this.url}/produtos`,produto)
  }

}
