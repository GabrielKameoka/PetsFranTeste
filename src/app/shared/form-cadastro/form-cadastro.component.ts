import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cachorro } from 'src/app/core/models/cachorro.model';
import { horario } from 'src/app/core/models/horario.model';
import { CachorroService } from 'src/app/core/services/cachorro.service';
import { HorarioService } from 'src/app/core/services/horario.service';
import { TabelaPrecosService } from 'src/app/core/services/tabela-precos.service';

@Component({
  selector: 'app-form-cadastro',
  templateUrl: './form-cadastro.component.html',
  styleUrls: ['./form-cadastro.component.scss']
})
export class FormCadastroComponent {
  tipo: 'cachorro' | 'horario';

  novoCachorro: cachorro = {
    id: '',
    nomeCachorro: '',
    nomeTutor: '',
    contatoTutor: '',
    endereco: '',
    raca: '',
    porte: ''
  };
  racasDisponiveis: string[] = [];
  cachorroSelecionadoObj?: cachorro;

  novoHorario: horario = {
    id: '',
    cachorros: [],
    data: '',
    horario: '',
    valorTotal: 0,
    servicosBaseSelecionado: '',
    adicionais: []
  };
  listaCachorros: cachorro[] = [];
  servicosBaseDisponiveis: string[] = [];
  servicosAdicionaisDisponiveis: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormCadastroComponent>,
    private cachorroService: CachorroService,
    private horarioService: HorarioService,
    private tabelaPrecos: TabelaPrecosService
  ) {
    this.tipo = data.tipo;
    this.listaCachorros = this.cachorroService.getCachorros();
    this.servicosAdicionaisDisponiveis = this.tabelaPrecos.getServicosAdicionais();
  }

  //Dar opções para a listagem de cachorros na hora de escolher o cachorro em horario
  cachorroSelecionado: string = '';
  cachorrosFiltrados: cachorro[] = [];
  ngOnInit() {
    this.cachorrosFiltrados = this.listaCachorros;
  }
  filtrarCachorros() {
    const termo = this.cachorroSelecionado.toLowerCase();
    this.cachorrosFiltrados = this.listaCachorros.filter(c =>
      c.nomeCachorro.toLowerCase().includes(termo) ||
      c.nomeTutor.toLowerCase().includes(termo)
    );
  }
  selecionarCachorro(nome: string) {
    const selecionado = this.listaCachorros.find(c =>
      c.nomeCachorro === nome || c.nomeTutor === nome
    );
    if (selecionado) {
      this.novoHorario.cachorros = [selecionado];
      this.cachorroSelecionado = `${selecionado.nomeTutor} - ${selecionado.nomeCachorro}`;
      this.cachorroSelecionadoObj = selecionado;
      this.atualizarServicosBase();
    }
  }

  //logica para mostrar as raças disponíveis de acordo com o porte selecionado
  atualizarRacas() {
    this.racasDisponiveis = this.tabelaPrecos.getRacasPorPorte(this.novoCachorro.porte);
  }

  atualizarServicosBase() {
    const racas = new Set(this.novoHorario.cachorros.map(c => c.raca));
    const portes = new Set(this.novoHorario.cachorros.map(c => c.porte));
    const servicos = new Set<string>();

    this.listaCachorros.forEach(c => {
      if (racas.has(c.raca) && portes.has(c.porte)) {
        this.tabelaPrecos.getServicosPorRacaPorte(c.raca, c.porte).forEach(s => servicos.add(s));
      }
    });

    this.servicosBaseDisponiveis = Array.from(servicos);
    this.calcularValor();
  }

  calcularValor() {
    const base = this.novoHorario.servicosBaseSelecionado
      ? this.novoHorario.cachorros.reduce((total, pet) => {
        return total + this.tabelaPrecos.getPrecoBasePorCachorro(pet, [this.novoHorario.servicosBaseSelecionado]);
      }, 0)
      : 0;

    const adicionais = this.novoHorario.cachorros.reduce((total, pet) => {
      return total + this.tabelaPrecos.getPrecoAdicionalPorCachorro(pet, this.novoHorario.adicionais);
    }, 0);

    this.novoHorario.valorTotal = base + adicionais;
  }


  salvar() {
    if (this.tipo === 'cachorro') {
      this.novoCachorro.id = crypto.randomUUID();
      this.cachorroService.salvarCachorro(this.novoCachorro);
    } else if (this.tipo === 'horario') {
      if (
        !this.novoHorario.cachorros ||
        !this.novoHorario.data ||
        !this.novoHorario.horario ||
        !this.novoHorario.servicosBaseSelecionado
      ) {
        alert('Preencha todos os campos obrigatórios.');
      }

      this.novoHorario.id = crypto.randomUUID();
      this.novoHorario.valorTotal = this.tabelaPrecos.getPrecoTotalHorario(this.novoHorario);
      this.horarioService.salvarHorario(this.novoHorario);
    }

    this.dialogRef.close();
  }
}
