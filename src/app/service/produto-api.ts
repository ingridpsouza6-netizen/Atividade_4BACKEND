// Importa os recursos necessários do Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoApi {

  // Endereço da API de produtos
  private enderecoAPI = 'https://localhost:7250/api/ProdutoItem';

  // Endereço da API de estoque
  private enderecoEstoque = 'https://localhost:7250/api/Estoque';

  // Endereço da API de pessoas
  private enderecoPessoa = 'https://localhost:7250/api/Pessoa';

  constructor(private http: HttpClient) {}

  // Consulta todos os produtos
  listarProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.enderecoAPI);
  }

  // Consulta todos os registros de estoque
  listarEstoque(): Observable<any[]> {
    return this.http.get<any[]>(this.enderecoEstoque);
  }

  // Cadastra uma nova pessoa no banco de dados
  cadastrarPessoa(pessoa: any): Observable<any> {
    return this.http.post<any>(this.enderecoPessoa, pessoa);
  }
}