import { Injectable } from '@angular/core';
import { horario } from '../models/horario.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private HORARIOS_KEY = 'horarios';
  private HORARIOS_CONCLUIDOS_KEY = 'horariosConcluidos';
  private horariosSubject = new BehaviorSubject<horario[]>(this.getHorarios());
  horarios$ = this.horariosSubject.asObservable();

  getHorarios(): horario[] {
    const dados = localStorage.getItem(this.HORARIOS_KEY);
    return dados ? JSON.parse(dados) : [];
  }

  salvarHorario(h: horario): void {
    const lista = this.getHorarios();
    lista.push(h);
    localStorage.setItem(this.HORARIOS_KEY, JSON.stringify(lista));
    this.horariosSubject.next(lista);
  }

  removerHorario(id: string): void {
    const lista = this.getHorarios().filter(h => h.id !== id);
    localStorage.setItem(this.HORARIOS_KEY, JSON.stringify(lista));
    this.horariosSubject.next(lista);
  }

  salvarHorarioConcluido(h: horario): void {
    const agora = new Date();
    const expiraEm = new Date(agora.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias

    const concluido = {
      horario: h,
      expiraEm: expiraEm.toISOString()
    };

    const lista = this.getHorariosConcluidos();
    lista.push(concluido);
    localStorage.setItem(this.HORARIOS_CONCLUIDOS_KEY, JSON.stringify(lista));
  }

  getHorariosConcluidos(): { horario: horario; expiraEm: string }[] {
    const dados = localStorage.getItem(this.HORARIOS_CONCLUIDOS_KEY);
    const lista = dados ? JSON.parse(dados) : [];

    const agora = new Date();
    const filtrados = lista.filter((item: any) => new Date(item.expiraEm) > agora);

    // Atualiza o localStorage removendo os expirados
    localStorage.setItem(this.HORARIOS_CONCLUIDOS_KEY, JSON.stringify(filtrados));

    return filtrados;
  }

  private horariosConcluidosSubject = new BehaviorSubject<horario[]>([]);
  horariosConcluidos$ = this.horariosConcluidosSubject.asObservable();

  emitirHorariosConcluidos() {
    const lista = this.getHorariosConcluidos().map(item => item.horario);
    this.horariosConcluidosSubject.next(lista);
  }

  atualizarHorario(horarioAtualizado: horario): void {
  const horarios = this.getHorarios();
  const index = horarios.findIndex(h => h.id === horarioAtualizado.id);
  
  if (index > -1) {
    horarios[index] = horarioAtualizado;
    localStorage.setItem(this.HORARIOS_KEY, JSON.stringify(horarios));
    this.horariosSubject.next(horarios); // Emite a atualização para todos os subscribers
  }
}
}
