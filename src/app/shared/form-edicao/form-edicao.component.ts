import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { horario } from 'src/app/core/models/horario.model';
import { HorarioService } from 'src/app/core/services/horario.service';
import { TabelaPrecosService } from 'src/app/core/services/tabela-precos.service';

@Component({
  selector: 'app-form-edicao',
  templateUrl: './form-edicao.component.html',
  styleUrls: ['./form-edicao.component.scss']
})
export class FormEdicaoComponent implements OnInit {
  horarioEditado: horario;
  servicosBaseDisponiveis: string[] = [];
  servicosAdicionaisDisponiveis: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { horario: horario },
    private dialogRef: MatDialogRef<FormEdicaoComponent>,
    private horarioService: HorarioService,
    private tabelaPrecos: TabelaPrecosService
  ) {
    // Cria uma cópia profunda do horário para edição
    this.horarioEditado = JSON.parse(JSON.stringify(data.horario));
  }

  ngOnInit() {
    this.carregarServicosDisponiveis();
    this.servicosAdicionaisDisponiveis = this.tabelaPrecos.getServicosAdicionais();
    this.calcularValor(); // Calcula o valor inicial
  }

  carregarServicosDisponiveis() {
    if (this.horarioEditado.cachorros.length > 0) {
      const cachorro = this.horarioEditado.cachorros[0];
      this.servicosBaseDisponiveis = this.tabelaPrecos.getServicosPorRacaPorte(
        cachorro.raca, 
        cachorro.porte
      );
    }
  }

  toggleServicoAdicional(servico: string) {
    const index = this.horarioEditado.adicionais.indexOf(servico);
    if (index > -1) {
      this.horarioEditado.adicionais.splice(index, 1);
    } else {
      this.horarioEditado.adicionais.push(servico);
    }
    this.calcularValor();
  }

  calcularValor() {
    if (this.horarioEditado.cachorros.length > 0) {
      const cachorro = this.horarioEditado.cachorros[0];
      
      const base = this.horarioEditado.servicosBaseSelecionado
        ? this.tabelaPrecos.getPrecoBasePorCachorro(cachorro, [this.horarioEditado.servicosBaseSelecionado])
        : 0;

      const adicionais = this.tabelaPrecos.getPrecoAdicionalPorCachorro(
        cachorro, 
        this.horarioEditado.adicionais
      );

      this.horarioEditado.valorTotal = base + adicionais;
    }
  }

  excluirHorario() {
  if (this.horarioEditado?.id) {
    this.horarioService.removerHorario(this.horarioEditado.id);
    alert('Horário excluído com sucesso!');
    this.dialogRef.close(true); // Fecha o diálogo e sinaliza sucesso
  }
}

  salvarEdicao() {
    // Recalcula o valor total antes de salvar
    this.calcularValor();
    
    // Atualiza o horário no serviço (que já emite a atualização via BehaviorSubject)
    this.horarioService.atualizarHorario(this.horarioEditado);
    
    this.dialogRef.close(true); // Retorna true indicando sucesso
  }
}