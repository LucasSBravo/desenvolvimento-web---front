import { Transacao } from 'src/app/shared/models/transacao';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TransacaoNova } from '../models/transacao-nova';

@Injectable({
  providedIn: 'root'
})
export class TransacaoService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getTransactions(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario/${userId}`)
  }

  deleteTransaction(id: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/transacoes/${id}`)
  }

  addTransaction(transacao: TransacaoNova): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/transacoes`, transacao)
  }

  getTransaction(transactionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/transacoes/${transactionId}`)
  }

  editTransaction(transacao: TransacaoNova, id:number): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/transacoes/${id}`, transacao)
  }
}
