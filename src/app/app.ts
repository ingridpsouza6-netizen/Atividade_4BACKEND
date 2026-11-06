
// Importa os recursos necessários do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importa o serviço responsável pela comunicação com a API
import { ProdutoApi } from './service/produto-api';

// Interface que define os dados de cada produto
interface Produto {
  iditem: number;
  nome: string;
  descricao: string;
  preco: number;
  idcategoria: number;
}

// Interface que define os produtos adicionados ao carrinho
interface ProdutoCarrinho extends Produto {
  quantidade: number;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {

  // Lista de produtos recebidos da API
  produtos: Produto[] = [];

  // Lista que armazena os dados de estoque
  estoques: any[] = [];

  // Lista de produtos adicionados ao carrinho
  carrinho: ProdutoCarrinho[] = [];

  // Guarda o texto digitado na pesquisa
  pesquisa: string = '';

  // Guarda a categoria selecionada (0 significa todas)
  categoriaSelecionada: number = 0;

  // Dados do cadastro de clientes
  nomeCliente: string = '';
  cpfCliente: string = '';
  dataNascimentoCliente: string = '';
  sexoCliente: string = '';
  emailCliente: string = '';
  telefoneCliente: string = '';

  // Mensagem de retorno do cadastro
  mensagemCadastro: string = '';

  constructor(
    private produtoApi: ProdutoApi,
    private changeDetector: ChangeDetectorRef
  ) {}

  // Carrega os produtos e os estoques quando a página é aberta
  ngOnInit() {

    // Consulta os produtos cadastrados na API
    this.produtoApi.listarProdutos().subscribe({

      // Executa quando a API retorna os dados
      next: (dados: any[]) => {

        // Organiza os dados recebidos do banco
        this.produtos = dados.map((produto: any) => ({
          iditem: Number(produto.iditemNavigation?.iditem ?? 0),
          nome: produto.iditemNavigation?.item1 ?? 'Produto',
          descricao: produto.iditemNavigation?.descricaoItem ?? '',
          preco: Number(produto.precoVenda ?? 0),
          idcategoria: Number(produto.iditemNavigation?.idcategoria ?? 0)
        }));

        // Mostra os produtos carregados no console
        console.log('PRODUTOS CARREGADOS:', this.produtos);

        // Atualiza a exibição da página
        this.changeDetector.detectChanges();
      },

      // Exibe o erro caso a API não responda
      error: (erro: any) => {
        console.error('Erro ao carregar produtos:', erro);
      }
    });

    // Consulta os dados de estoque na API
    this.produtoApi.listarEstoque().subscribe({

      // Executa quando a API retorna os estoques
      next: (dados: any[]) => {
        this.estoques = dados;

        // Mostra os estoques carregados no console
        console.log('ESTOQUES CARREGADOS:', this.estoques);

        // Atualiza a página
        this.changeDetector.detectChanges();
      },

      // Exibe erro caso a consulta falhe
      error: (erro: any) => {
        console.error('Erro ao carregar estoque:', erro);
      }
    });
  }

  // Consulta a quantidade disponível em estoque de um produto
  consultarQuantidadeEstoque(iditem: number): number {
    const estoque = this.estoques.find(
      item => Number(item.iditem) === iditem
    );

    return estoque ? Number(estoque.quantidadeEstoque) : 0;
  }

  // Filtra os produtos pelo nome digitado
  filtrarProdutos(): Produto[] {
    return this.produtos.filter((produto: Produto) =>
      produto.nome.toLowerCase().includes(this.pesquisa.toLowerCase())
    );
  }

  // Filtra os produtos pela categoria selecionada
  filtrarPorCategoria(idcategoria: number): Produto[] {
    return this.filtrarProdutos().filter((produto: Produto) =>
      idcategoria === 0 || produto.idcategoria === idcategoria
    );
  }

  // Adiciona um produto ao carrinho
  adicionarAoCarrinho(nome: string, preco: number) {

    // Verifica se o produto já está no carrinho
    const produtoExistente = this.carrinho.find(
      produto => produto.nome === nome
    );

    // Se já existir, aumenta a quantidade
    if (produtoExistente) {
      produtoExistente.quantidade++;
    } else {

      // Adiciona o produto ao carrinho
      this.carrinho.push({
        iditem: 0,
        nome: nome,
        descricao: '',
        preco: preco,
        idcategoria: 0,
        quantidade: 1
      });
    }

    // Atualiza a página
    this.changeDetector.detectChanges();
  }

  // Remove um produto do carrinho
  removerDoCarrinho(nome: string) {

    // Localiza o produto pelo nome
    const indice = this.carrinho.findIndex(
      produto => produto.nome === nome
    );

    // Remove o produto encontrado
    if (indice !== -1) {
      this.carrinho.splice(indice, 1);
    }

    // Atualiza a página
    this.changeDetector.detectChanges();
  }

  // Aumenta a quantidade de um produto
  aumentarQuantidade(nome: string) {

    // Localiza o produto no carrinho
    const produto = this.carrinho.find(
      item => item.nome === nome
    );

    // Aumenta a quantidade
    if (produto) {
      produto.quantidade++;
    }

    // Atualiza a página
    this.changeDetector.detectChanges();
  }

  // Diminui a quantidade de um produto
  diminuirQuantidade(nome: string) {

    // Localiza o produto no carrinho
    const produto = this.carrinho.find(
      item => item.nome === nome
    );

    // Diminui somente se a quantidade for maior que um
    if (produto && produto.quantidade > 1) {
      produto.quantidade--;
    }

    // Atualiza a página
    this.changeDetector.detectChanges();
  }

  // Calcula o valor total do carrinho
  calcularTotal(): number {
    return this.carrinho.reduce(
      (total, produto) => total + produto.preco * produto.quantidade,
      0
    );
  }

  // Cadastra um novo cliente
  cadastrarCliente() {

    // Organiza os dados do cliente para enviar à API
    const pessoa = {
      idpessoa: 0,
      nome: this.nomeCliente,
      cpf: Number(this.cpfCliente),
      dataNascimento: this.dataNascimentoCliente,
      sexo: this.sexoCliente,
      email: this.emailCliente,
      telefone: Number(this.telefoneCliente),
      ativoPessoa: 'S',
      atendimentos: [],
      enderecos: [],
      funcionario: null
    };

    // Envia os dados para a API
    this.produtoApi.cadastrarPessoa(pessoa).subscribe({

      // Executa quando o cadastro dá certo
      next: (resposta: any) => {
        this.mensagemCadastro = 'Cliente cadastrado com sucesso!';

        // Limpa os campos do formulário
        this.nomeCliente = '';
        this.cpfCliente = '';
        this.dataNascimentoCliente = '';
        this.sexoCliente = '';
        this.emailCliente = '';
        this.telefoneCliente = '';

        // Atualiza a página
        this.changeDetector.detectChanges();
      },

      // Executa caso ocorra algum erro
      error: (erro: any) => {
        console.error('Erro ao cadastrar cliente:', erro);
        this.mensagemCadastro = 'Erro ao cadastrar cliente. Verifique os dados.';
      }
    });
  }
}
