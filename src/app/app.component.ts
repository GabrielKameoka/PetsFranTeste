import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormCadastroComponent } from './shared/form-cadastro/form-cadastro.component';
import { horario } from './core/models/horario.model';
import { TableComponent } from './shared/table/table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  horarioAtual: horario | null = null;

  @Input() mostrarConcluidos: boolean = false;
  @ViewChild(TableComponent) tabela!: TableComponent;

  constructor(private dialog: MatDialog) { }

  abrirFormCachorro() {
    this.dialog.open(FormCadastroComponent, {
      panelClass: 'custom-dialog',
      data: { tipo: 'cachorro' }
    });
  }

  abrirFormHorario() {
    this.dialog.open(FormCadastroComponent, {
      panelClass: 'custom-dialog',
      data: { tipo: 'horario' }
    });
  }

  alternarHorariosConcluidos() {
    this.mostrarConcluidos = !this.mostrarConcluidos;
  }

  mostrarDetalhes(h: horario) {
    this.horarioAtual = h;
  }

  limparDetalhes() {
    this.horarioAtual = null; // ⬅️ LIMPA OS DETALHES
  }

  atualizarTabela() {
    this.horarioAtual = null; // limpa o painel de detalhes
    this.tabela.recarregarDados(); // força a tabela a recarregar os dados
  }


}