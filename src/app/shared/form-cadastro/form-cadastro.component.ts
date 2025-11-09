import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
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
export class FormCadastroComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
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

  //Propriedades para autocomplete
  cachorroSelecionado: string = '';
  cachorrosFiltrados: cachorro[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FormCadastroComponent>,
    private cachorroService: CachorroService,
    private horarioService: HorarioService,
    private tabelaPrecos: TabelaPrecosService
  ) {
    this.tipo = data.tipo;
    this.servicosAdicionaisDisponiveis = this.tabelaPrecos.getServicosAdicionais();
  }

  ngOnInit() {
    //Lista reativa de cachorros
    this.cachorroService.cachorros$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cachorros => {
        this.listaCachorros = cachorros;
        this.cachorrosFiltrados = cachorros; // Atualiza a lista filtrada também
      });

    this.cachorrosFiltrados = this.listaCachorros;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
      c.nomeCachorro === nome
    );
    
    if (selecionado) {
      this.novoHorario.cachorros = [selecionado];
      this.cachorroSelecionado = selecionado.nomeCachorro;
      this.cachorroSelecionadoObj = selecionado;
      this.atualizarServicosBase();
    }
  }

  atualizarRacas() {
    this.racasDisponiveis = this.tabelaPrecos.getRacasPorPorte(this.novoCachorro.porte);
    this.novoCachorro.raca = ''; 
  }

  atualizarServicosBase() {
    if (!this.cachorroSelecionadoObj) return;

    const porte = this.cachorroSelecionadoObj.porte;
    const raca = this.cachorroSelecionadoObj.raca;
    
    this.servicosBaseDisponiveis = this.tabelaPrecos.getServicosPorRacaPorte(raca, porte);
    this.novoHorario.servicosBaseSelecionado = '';
    this.calcularValor();
  }

  calcularValor() {
    if (!this.cachorroSelecionadoObj) {
      this.novoHorario.valorTotal = 0;
      return;
    }

    const base = this.novoHorario.servicosBaseSelecionado
      ? this.tabelaPrecos.getPrecoBasePorCachorro(
          this.cachorroSelecionadoObj, 
          [this.novoHorario.servicosBaseSelecionado]
        )
      : 0;

    const adicionais = this.tabelaPrecos.getPrecoAdicionalPorCachorro(
      this.cachorroSelecionadoObj, 
      this.novoHorario.adicionais
    );

    this.novoHorario.valorTotal = base + adicionais;
  }

  //Método salvar com tratamento adequado
  salvar() {
    if (this.tipo === 'cachorro') {
      this.salvarCachorro();
    } else if (this.tipo === 'horario') {
      this.salvarHorario();
    }
  }

  private salvarCachorro() {
    //Campos obrigatórios
    if (!this.validarCachorro()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    this.novoCachorro.id = crypto.randomUUID();
    
    //Trata retorno do serviço
    const sucesso = this.cachorroService.salvarCachorro(this.novoCachorro);
    
    if (sucesso) {
      this.dialogRef.close(true); //Fecha com indicador de sucesso
    } else {
      alert('Erro: Este cachorro já está cadastrado!');
    }
  }

  private salvarHorario() {
    //Validação completa com return
    if (!this.validarHorario()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    this.novoHorario.id = crypto.randomUUID();
    
    //Recalcula valor final antes de salvar
    this.calcularValor();
    
    try {
      this.horarioService.salvarHorario(this.novoHorario);
      this.dialogRef.close(true); //Fecha com indicador de sucesso
    } catch (error: any) {
      alert('Erro ao salvar horário: ' + error.message);
    }
  }

  private validarCachorro(): boolean {
    return !!(
      this.novoCachorro.nomeCachorro &&
      this.novoCachorro.nomeTutor &&
      this.novoCachorro.contatoTutor &&
      this.novoCachorro.endereco &&
      this.novoCachorro.porte &&
      this.novoCachorro.raca
    );
  }

  private validarHorario(): boolean {
    return !!(
      this.novoHorario.cachorros.length > 0 &&
      this.novoHorario.data &&
      this.novoHorario.horario &&
      this.novoHorario.servicosBaseSelecionado
    );
  }
}