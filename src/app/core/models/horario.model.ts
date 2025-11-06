import { cachorro } from './cachorro.model';

export interface horario {
  id: string;
  cachorros: cachorro[];
  data: string;
  horario: string;
  valorTotal: number;
  servicosBaseSelecionado: string;
  adicionais: string[];
}
