import { Injectable } from '@angular/core';
import { cachorro } from '../models/cachorro.model';

@Injectable({
  providedIn: 'root'
})
export class CachorroService {
  private CACHORROS_KEY = 'cachorros';

  salvarCachorro(c: cachorro): void {
    const lista = this.getCachorros();

    const jaExiste = lista.some(item =>
      item.nomeCachorro.toLowerCase() === c.nomeCachorro.toLowerCase() &&
      item.nomeTutor.toLowerCase() === c.nomeTutor.toLowerCase() &&
      item.contatoTutor.toLowerCase() === c.contatoTutor.toLowerCase()
    );
    if(jaExiste){
      alert("Esse cachorro já existe");
      return;
    }

    lista.push(c);
    localStorage.setItem(this.CACHORROS_KEY, JSON.stringify(lista));
  }

  getCachorros(): cachorro[] {
    const data = localStorage.getItem(this.CACHORROS_KEY);
    return data ? JSON.parse(data) : [];
  }
}
