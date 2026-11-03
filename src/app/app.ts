
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  // Lista de produtos do carrinho
  carrinho: { nome: string; preco: number; quantidade: number }[] = [];

  // Adiciona produtos ao carrinho
  adicionarAoCarrinho(nome: string, preco: number) {

    // Procura se o produto já existe no carrinho
    let produtoExistente = this.carrinho.find(
      produto => produto.nome === nome
    );

    // Se existir, aumenta a quantidade
    if (produtoExistente) {
      produtoExistente.quantidade++;
    } else {

      // Se não existir, adiciona um novo produto
      this.carrinho.push({
        nome: nome,
        preco: preco,
        quantidade: 1
      });
    }
  }

  // Remove somente o produto selecionado
  removerDoCarrinho(nome: string) {

    // Procura a posição exata do produto
    let indice = this.carrinho.findIndex(
      produto => produto.nome === nome
    );

    // Remove apenas um produto encontrado
    if (indice !== -1) {
      this.carrinho.splice(indice, 1);
    }
  }

  // Aumenta a quantidade de um produto
  aumentarQuantidade(nome: string) {

    // Procura o produto pelo nome
    let produto = this.carrinho.find(
      item => item.nome === nome
    );

    // Acrescenta uma unidade
    if (produto) {
      produto.quantidade++;
    }
  }

  // Diminui a quantidade sem deixar chegar a zero
  diminuirQuantidade(nome: string) {

    // Procura o produto pelo nome
    let produto = this.carrinho.find(
      item => item.nome === nome
    );

    // Diminui somente se a quantidade for maior que 1
    if (produto && produto.quantidade > 1) {
      produto.quantidade--;
    }
  }

  // Calcula o valor total da compra
  calcularTotal() {
    let total = 0;

    // Soma o subtotal de cada produto
    for (let produto of this.carrinho) {
      total = total + (produto.preco * produto.quantidade);
    }

    // Retorna o total da compra
    return total;
  }
}
