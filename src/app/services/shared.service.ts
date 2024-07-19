import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private url: string = 'http://localhost:3000';
  lastId: number = 0;
  private method = new BehaviorSubject<string>('');
  currentMethod = this.method.asObservable();
  private id = new BehaviorSubject<string>('');
  currentId = this.id.asObservable();

  constructor(private http: HttpClient) {
    this.getProducts().subscribe((produtos: any[] | undefined) => {
      if (produtos && produtos.length > 0) {
        const lastProductId = produtos[produtos.length - 1];
        this.lastId = parseInt(lastProductId.id, 10);
      }
    });
  }

  reqMethod(req: string) {
    this.method.next(req);
  }
  currentIdEdit(id: string) {
    this.id.next(id);
  }

  // Req products
  
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/produtos`);
  }

  sendProducts(produto: any): Observable<any> {
    this.lastId++;
    produto.id = this.lastId.toString();
    return this.http.post<any>(`${this.url}/produtos`, produto);
  }

  editProducts(produto: any, id: string): Observable<any> {
    return this.http.put<any>(`${this.url}/produtos/${id}`, produto);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.url}/produtos/${id}`);
  }


  // Req costumer

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/clientes`);
  }

  updateClientes(customer: any, id: string): Observable<any> {
    return this.http.put<any>(`${this.url}/clientes/${id}`, customer);
  }


  // Req sales

  sendSales(produto: any): Observable<any> {
    return this.http.post<any>(`${this.url}/vendas`, produto);
  }

  getSales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/vendas`);
  }

  updateSales(sales: any, id: string):Observable<any>{
    return this.http.put<any>(`${this.url}/vendas/${id}`, sales);
  }
}
