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

  //Inicializar com dados reais e criar método público
  private horariosConcluidosSubject = new BehaviorSubject<horario[]>(
    this.getHorariosConcluidos().map(item => item.horario)
  );
  horariosConcluidos$ = this.horariosConcluidosSubject.asObservable();

  getHorarios(): horario[] {
    const dados = localStorage.getItem(this.HORARIOS_KEY);
    return dados ? JSON.parse(dados) : [];
  }

  salvarHorario(h: horario): void {
    const lista = this.getHorarios();
    
    //Verificar se ID já existe
    const existe = lista.some(horario => horario.id === h.id);
    if (existe) {
      throw new Error(`Horário com ID ${h.id} já existe`);
    }
    
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
    const expiraEm = new Date(agora.getTime() + 30 * 24 * 60 * 60 * 1000);

    const concluido = {
      horario: h,
      expiraEm: expiraEm.toISOString()
    };

    const lista = this.getHorariosConcluidos();
    lista.push(concluido);
    localStorage.setItem(this.HORARIOS_CONCLUIDOS_KEY, JSON.stringify(lista));
    
    //Emitir atualização
    this.emitirHorariosConcluidos();
  }

  getHorariosConcluidos(): { horario: horario; expiraEm: string }[] {
    const dados = localStorage.getItem(this.HORARIOS_CONCLUIDOS_KEY);
    const lista = dados ? JSON.parse(dados) : [];

    const agora = new Date();
    const filtrados = lista.filter((item: any) => new Date(item.expiraEm) > agora);

    localStorage.setItem(this.HORARIOS_CONCLUIDOS_KEY, JSON.stringify(filtrados));
    return filtrados;
  }

  //Método público para forçar atualização
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
      this.horariosSubject.next(horarios);
    }
  }
}