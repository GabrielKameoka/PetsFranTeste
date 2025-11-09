import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { horario } from 'src/app/core/models/horario.model';
import { HorarioService } from 'src/app/core/services/horario.service';
import { FormEdicaoComponent } from '../form-edicao/form-edicao.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  @Input() horario: horario | null = null;
  @Input() mostrarConcluidos: boolean = false;
  @Output() horarioEditado = new EventEmitter<void>();
  @Output() horarioConcluido = new EventEmitter<void>();

  constructor(
    private horarioService: HorarioService,
    private dialog: MatDialog
  ) { }

  editarHorario() {
    if (!this.horario) return;

    const dialogRef = this.dialog.open(FormEdicaoComponent, {
      width: '240px',
      data: { horario: { ...this.horario } }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        try {
          this.horarioService.atualizarHorario(resultado);
          alert('Horário atualizado com sucesso!');
          this.horarioEditado.emit();
        } catch (error) {
          alert('Erro ao atualizar horário: ' + error);
        }
      }
    });
  }

  concluirHorario() {
    if (this.horario) {
      this.horarioService.removerHorario(this.horario.id);
      this.horarioService.salvarHorarioConcluido(this.horario);
      this.horarioService.emitirHorariosConcluidos();
      
      this.horarioConcluido.emit(); // ⬅️ EMITE O EVENTO
      
      alert('Horário concluído e movido para histórico por 30 dias.');
    }
  }

  get whatsappLink(): string {
    if (!this.horario?.cachorros[0]?.contatoTutor) return '#';
    const numero = this.horario.cachorros[0].contatoTutor.replace(/\D/g, '');
    return `https://wa.me/55${numero}`;
  }

  get enderecoGoogleMaps(): string {
    if (!this.horario?.cachorros[0]?.endereco) return '#';
    return `https://maps.google.com/?q=${encodeURIComponent(this.horario.cachorros[0].endereco)}`;
  }
}