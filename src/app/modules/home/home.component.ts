import { Component, OnDestroy, OnInit, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Transacao } from 'src/app/shared/models/transacao';
import { Usuario } from 'src/app/shared/models/usuario';
import { TransacaoService } from 'src/app/shared/services/transacao.service';
import { formatCurrency } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransacaoNova } from 'src/app/shared/models/transacao-nova';
registerLocaleData(localePt, 'pt-BR');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy{
  mostrarModal: boolean = false;
  usuarioLogado = localStorage.getItem('usuario')
  usuarioAutenticado = localStorage.getItem('autenticado')
  user: Usuario;
  transacoes: Transacao[] = [];
  userName: string;
  saldo: number;
  saldoFormatado: string;
  transacaoForm: FormGroup;
  transacaoNova: TransacaoNova;
  editar: boolean = false;
  alterarTransacao: number;

  constructor(
    private router: Router,
    private transacaoService: TransacaoService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    if (!this.usuarioAutenticado) {
      this.router.navigateByUrl('/login')
    }

    if (this.usuarioLogado) {
      this.user = JSON.parse(this.usuarioLogado)
      this.userName = this.user.usuario
      this.pegarTransacoes(this.user.id)
      this.transacaoForm = this.formBuilder.group({
        nome: [null, Validators.required],
        valor: [null, Validators.required],
        tipo_transacao: [true, Validators.required]
      })
    }    
  }

  pegarTransacoes(userId: number) {
    this.transacaoService.getTransactions(userId).subscribe({
      next: resp => {
        this.transacoes = resp.transacoes
        this.criarSaldo()
      },
      error: resp => {
        console.log(resp.error);        
      }
    })
  }

  criarSaldo() {
    this.saldo = this.transacoes.reduce((accum, transacao) => {
      if(transacao.tipo_transacao){
      
      return accum + transacao.valor
      }
      else{
        return accum - transacao.valor
      }

      
    }, 0)
    this.saldoFormatado = formatCurrency(this.saldo, 'pt-BR', 'R$', 'BRL')
  }

  sair() {
    localStorage.removeItem('usuario')
    localStorage.removeItem('autenticado')
    this.router.navigateByUrl('/login')
  }

  abrirModal(editar:boolean, id?:number) {
    this.mostrarModal = true;
    if(editar && id){
      this.alterarTransacao = id
      this.editar = true;
      this.transacaoService.getTransaction(id).subscribe({
        next: resp =>{
          console.log(resp)
         this.transacaoForm.controls["nome"].setValue(resp.nome)
         this.transacaoForm.controls["valor"].setValue(resp.valor)
         this.transacaoForm.controls["tipo_transacao"].setValue(resp.tipo_transacao)
        }
      })
    }
    else{
      this.editar = false;
    }
  }

  fecharModal() {
    this.mostrarModal = false;
    this.transacaoForm.reset();
  }

  verificarClique(event: any) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.fecharModal();
    }
  }

  ngOnDestroy(): void {
    localStorage.removeItem('usuario')
    localStorage.removeItem('autenticado')
  }

  deletarTransacao(id: number){    
    this.transacaoService.deleteTransaction(id).subscribe({
      next:() => {
        this.pegarTransacoes(this.user.id)
      }
    })
  }

  criarTransacao(){
    console.log(this.user.id)
    this.transacaoNova = new TransacaoNova()
    let form = this.transacaoForm.value
    this.transacaoNova.nome = form.nome
    this.transacaoNova.valor = form.valor
    this.transacaoNova.tipo_transacao = form.tipo_transacao
    this.transacaoNova.usuario = this.user
    
    this.transacaoService.addTransaction(this.transacaoNova).subscribe({
      next:() =>{
        this.pegarTransacoes(this.user.id)
        this.fecharModal()
        this.transacaoForm.reset()
      }
    })
  }

  editarTransacao(){
    console.log(this.user.id)
    this.transacaoNova = new TransacaoNova()
    let form = this.transacaoForm.value
    this.transacaoNova.nome = form.nome
    this.transacaoNova.valor = form.valor
    this.transacaoNova.tipo_transacao = form.tipo_transacao
    this.transacaoNova.usuario = this.user
    
    this.transacaoService.editTransaction(this.transacaoNova, this.alterarTransacao).subscribe({
      next:() =>{
        this.pegarTransacoes(this.user.id)
        this.fecharModal()
        this.transacaoForm.reset()
      }
    })
  }
  
}
