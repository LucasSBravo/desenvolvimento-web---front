import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  addUser(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuario`, usuario);
  }
}
