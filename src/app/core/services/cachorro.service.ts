import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cachorro } from '../models/cachorro.model';

@Injectable({
  providedIn: 'root'
})
export class CachorroService {
  private CACHORROS_KEY = 'cachorros';
  
  //BehaviorSubject para estado reativo
  private cachorrosSubject = new BehaviorSubject<cachorro[]>(this.getCachorros());
  cachorros$ = this.cachorrosSubject.asObservable();

  //Retorna boolean indicando sucesso/falha
  salvarCachorro(c: cachorro): boolean {
    if (!this.validarCachorro(c)) {
      return false;
    }

    const lista = this.getCachorros();

    // ✅ VALIDAÇÃO: Verifica duplicação
    const jaExiste = lista.some(item =>
      item.nomeCachorro.toLowerCase() === c.nomeCachorro.toLowerCase() &&
      item.nomeTutor.toLowerCase() === c.nomeTutor.toLowerCase() &&
      item.contatoTutor.toLowerCase() === c.contatoTutor.toLowerCase()
    );

    if (jaExiste) {
      return false; //Retorna false em vez de alert
    }

    lista.push(c);
    localStorage.setItem(this.CACHORROS_KEY, JSON.stringify(lista));
    
    //Emite a nova lista para todos os subscribers
    this.cachorrosSubject.next(lista);
    
    return true;
  }

  getCachorros(): cachorro[] {
    const data = localStorage.getItem(this.CACHORROS_KEY);
    return data ? JSON.parse(data) : [];
  }

  //Método para buscar cachorro por ID (se seu model tiver id)
  getCachorroById(id: string): cachorro | undefined {
    return this.getCachorros().find(c => c.id === id);
  }

  //Método para atualizar cachorro existente
  atualizarCachorro(cachorroAtualizado: cachorro): boolean {
    const lista = this.getCachorros();
    const index = lista.findIndex(c => c.id === cachorroAtualizado.id);
    
    if (index > -1) {
      lista[index] = cachorroAtualizado;
      localStorage.setItem(this.CACHORROS_KEY, JSON.stringify(lista));
      this.cachorrosSubject.next(lista);
      return true;
    }
    
    return false;
  }

  //Método para remover cachorro
  removerCachorro(id: string): void {
    const lista = this.getCachorros().filter(c => c.id !== id);
    localStorage.setItem(this.CACHORROS_KEY, JSON.stringify(lista));
    this.cachorrosSubject.next(lista);
  }

  //Validação de dados obrigatórios
  private validarCachorro(c: cachorro): boolean {
    return !!(c.nomeCachorro && c.nomeTutor && c.contatoTutor);
  }

  //Forçar atualização do state
  atualizarLista(): void {
    this.cachorrosSubject.next(this.getCachorros());
  }
}