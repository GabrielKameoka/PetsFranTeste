import { Input, Component, EventEmitter, OnInit, OnChanges, SimpleChanges, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { horario } from 'src/app/core/models/horario.model';
import { HorarioService } from 'src/app/core/services/horario.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

type FiltroHorario = {
  texto: string;
  data: string;
};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['cachorro', 'tutor', 'endereco', 'horario'];
  dataSource = new MatTableDataSource<horario>([]);
  filtroTexto: string = '';
  filtroData: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() horarioSelecionado = new EventEmitter<horario>();
  @Input() mostrarConcluidos = false;

  constructor(private horarioService: HorarioService) { }

  private carregarDados(): void {
    if (this.mostrarConcluidos) {
      const concluidos = this.horarioService.getHorariosConcluidos().map(h => h.horario);
      this.dataSource.data = concluidos;
    } else {
      this.horarioService.horarios$.subscribe(h => {
        this.dataSource.data = h;
      });
    }

    this.aplicarFiltros();
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mostrarConcluidos']) {
      this.carregarDados();
    }
  }

  selecionarHorario(horario: horario) {
    this.horarioSelecionado.emit(horario);
  }

  filtrarTabela(event: Event) {
    this.filtroTexto = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.aplicarFiltros();
  }

  filtrarPorData(event: MatDatepickerInputEvent<Date>) {
    const data = event.value;
    this.filtroData = data ? this.formatarData(data) : '';
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    const filtro: FiltroHorario = {
      texto: this.filtroTexto,
      data: this.filtroData
    };

    this.dataSource.filterPredicate = (item: horario, filtroJson: string) => {
      let filtro: FiltroHorario;
      try {
        filtro = JSON.parse(filtroJson);
      } catch {
        return true;
      }

      const nomePet = item.cachorros[0]?.nomeCachorro?.toLowerCase() || '';
      const nomeTutor = item.cachorros[0]?.nomeTutor?.toLowerCase() || '';
      const textoMatch = filtro.texto
        ? nomePet.includes(filtro.texto) || nomeTutor.includes(filtro.texto)
        : true;

      const dataItem = this.formatarData(new Date(item.data + 'T03:00:00'));
      const dataMatch = filtro.data ? dataItem === filtro.data : true;

      return textoMatch && dataMatch;
    };

    this.dataSource.filter = JSON.stringify(filtro);
  }

  limparFiltros() {
    this.filtroTexto = '';
    this.filtroData = '';
    this.aplicarFiltros();
  }

  private formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    const resizer = document.querySelector('.resizer') as HTMLElement;
    const leftPane = document.querySelector('.left-pane') as HTMLElement;
    const rightPane = document.querySelector('.right-pane') as HTMLElement;

    let isResizing = false;

    resizer.addEventListener('mousedown', () => {
      isResizing = true;
      document.body.style.cursor = 'col-resize';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const containerOffsetLeft = leftPane.parentElement!.offsetLeft;
      const newLeftWidth = e.clientX - containerOffsetLeft;
      leftPane.style.width = `${newLeftWidth}px`;
      rightPane.style.width = `calc(100% - ${newLeftWidth}px - 5px)`;
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
      document.body.style.cursor = 'default';
    });
  }

  public recarregarDados(): void {
    this.carregarDados();
  }

}
