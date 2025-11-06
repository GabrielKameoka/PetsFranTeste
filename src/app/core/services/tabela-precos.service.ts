import { Injectable } from '@angular/core';
import { cachorro } from '../models/cachorro.model';
import { horario } from '../models/horario.model';

interface ServicoBase {
  porte: string;
  raca: string;
  servicos: { [nome: string]: number };
}

interface ServicoAdicionalPorPorte {
  [nome: string]: { P: number; M: number; G: number };
}

@Injectable({providedIn: 'root'})
export class TabelaPrecosService {
  private servicosBase: ServicoBase[] = [
    // PORTE PEQUENO
    {
      porte: 'Pequeno',
      raca: 'Vira-lata',
      servicos: {
        'Banho': 60.00,
        'Banho e Tosa Higiênica': 70.00,
        'Banho e Tosa Verão': 100.00,
        'Banho e Tosa na Máquina': 110.00,
        'Banho e Tosa na Tesoura': 120.00,
        'Banho e Triming': 170.00,
        'Banho Carding': 170.00
      }
    },
    {
      porte: 'Pequeno',
      raca: 'York',
      servicos: {
        'Banho': 50.00,
        'Banho e Tosa Higiênica': 60.00,
        'Banho e Tosa Verão': 90.00,
        'Banho e Tosa na Máquina': 100.00,
        'Banho e Tosa na Tesoura': 120.00,
        'Banho e Triming': 170.00
      }
    },
    {
      porte: 'Pequeno',
      raca: 'Shitzu',
      servicos: {
        'Banho': 50.00,
        'Banho e Tosa Higiênica': 60.00,
        'Banho e Tosa Verão': 90.00,
        'Banho e Tosa na Máquina': 100.00,
        'Banho e Tosa na Tesoura': 120.00,
        'Banho e Triming': 170.00
      }
    },
    {
      porte: 'Pequeno',
      raca: 'Maltês',
      servicos: {
        'Banho': 50.00,
        'Banho e Tosa Higiênica': 60.00,
        'Banho e Tosa Verão': 90.00,
        'Banho e Tosa na Máquina': 100.00,
        'Banho e Tosa na Tesoura': 120.00,
        'Banho e Triming': 170.00
      }
    },
    {
      porte: 'Pequeno',
      raca: 'Dachshund',
      servicos: {
        'Banho': 60.00,
        'Banho Carding': 90.00
      }
    },
    {
      porte: 'Pequeno',
      raca: 'Pinscher',
      servicos: {
        'Banho': 40.00,
        'Banho Carding': 70.00
      }
    },
    {
      porte: 'Pequeno',
      raca: 'Pug',
      servicos: {
        'Banho': 50.00,
        'Banho e Tosa Verão': 90.00,
        'Banho Carding': 90.00
      }
    },
    {
      porte: 'Pequeno',
      raca: 'Spitz',
      servicos: {
        'Banho': 60.00,
        'Banho e Tosa Higiênica': 70.00,
        'Banho e Tosa Verão': 90.00,
        'Banho e Tosa na Máquina': 100.00,
        'Banho e Tosa na Tesoura': 120.00
      }
    },
    {
      porte: 'Pequeno',
      raca: 'Lhasa',
      servicos: {
        'Banho': 50.00,
        'Banho e Tosa Higiênica': 60.00,
        'Banho e Tosa Verão': 90.00,
        'Banho e Tosa na Máquina': 100.00,
        'Banho e Tosa na Tesoura': 120.00,
        'Banho e Triming': 160.00
      }
    },
    {
      porte: 'Pequeno',
      raca: 'Poodle',
      servicos: {
        'Banho': 50.00,
        'Banho e Tosa Higiênica': 60.00,
        'Banho e Tosa Verão': 90.00,
        'Banho e Tosa na Máquina': 100.00,
        'Banho e Tosa na Tesoura': 120.00,
        'Banho e Triming': 160.00
      }
    },

    // PORTE MÉDIO
    {
      porte: 'Médio',
      raca: 'Vira-lata',
      servicos: {
        'Banho': 60.00,
        'Banho e Tosa Higiênica': 70.00,
        'Banho e Tosa Verão': 100.00,
        'Banho e Tosa na Máquina': 110.00,
        'Banho e Tosa na Tesoura': 120.00,
        'Banho e Triming': 150.00,
        'Banho Carding': 150.00
      }
    },
    {
      porte: 'Médio',
      raca: 'Poodle',
      servicos: {
        'Banho': 60.00,
        'Banho e Tosa Higiênica': 70.00,
        'Banho e Tosa Verão': 100.00,
        'Banho e Tosa na Máquina': 110.00,
        'Banho e Tosa na Tesoura': 120.00,
      }
    },
    {
      porte: 'Médio',
      raca: 'Buldog',
      servicos: {
        'Banho': 60.00,
        'Banho Carding': 90.00
      }
    },
    {
      porte: 'Médio',
      raca: 'Beagle',
      servicos: {
        'Banho': 60.00,
        'Banho e Tosa Verão': 100.00,
        'Banho Carding': 90.00
      }
    },
    {
      porte: 'Médio',
      raca: 'Chow Chow',
      servicos: {
        'Banho': 90.00,
        'Banho e Tosa Higiênica': 100.00,
        'Banho e Tosa Verão': 120.00,
        'Banho e Tosa na Máquina': 120.00,
        'Banho e Tosa na Tesoura': 150.00
      }
    },

    // PORTE GRANDE
    {
      porte: 'Grande',
      raca: 'Vira-lata',
      servicos: {
        'Banho': 90.00,
        'Banho e Tosa Higiênica': 120.00,
        'Banho e Tosa Verão': 140.00,
        'Banho e Tosa na Máquina': 150.00,
        'Banho e Tosa na Tesoura': 170.00,
        'Banho e Triming': 160.00,
        'Banho Carding': 120.00
      }
    },
    {
      porte: 'Grande',
      raca: 'Border Collie',
      servicos: {
        'Banho': 80.00,
        'Banho e Tosa Higiênica': 95.00,
        'Banho e Triming': 140.00
      }
    },
    {
      porte: 'Grande',
      raca: 'Pastor Alemão',
      servicos: {
        'Banho': 90.00,
        'Banho e Tosa Higiênica': 105.00,
        'Banho e Triming': 150.00
      }
    },
    {
      porte: 'Grande',
      raca: 'Husky',
      servicos: {
        'Banho': 100.00,
        'Banho e Tosa Higiênica': 120.00,
        'Banho e Triming': 160.00
      }
    },
    {
      porte: 'Grande',
      raca: 'Dálmata',
      servicos: {
        'Banho': 80.00,
        'Banho e Tosa Verão': 120.00,
        'Banho Carding': 140.00
      }
    },
    {
      porte: 'Grande',
      raca: 'Golden',
      servicos: {
        'Banho': 100.00,
        'Banho e Tosa Higiênica': 120.00,
        'Banho e Triming': 160.00
      }
    },
    {
      porte: 'Grande',
      raca: 'São Bernardo',
      servicos: {
        'Banho': 160.00,
        'Banho e Tosa Higiênica': 180.00,
        'Banho e Triming': 200.00
      }
    },
    {
      porte: 'Grande',
      raca: 'Rottweiler',
      servicos: {
        'Banho': 90.00,
        'Banho Carding': 120.00
      }
    }
  ];

  private adicionais: ServicoAdicionalPorPorte = {
    'Escovação de Dente': { P: 15, M: 15, G: 15 },
    'Desembolo': { P: 15, M: 25, G: 60 },
    'Hidratação': { P: 20, M: 25, G: 30 },
    'TaxiDog': { P: 15, M: 15, G: 15 },
    'Cortar Unha': { P: 5, M: 10, G: 10 }
  };

  //Métodos de cálculos de serviços📏

  getPrecoBasePorCachorro(pet: cachorro, servicosBase: string[]): number {
    const item = this.servicosBase.find(s => s.porte === pet.porte && s.raca === pet.raca);
    return servicosBase.reduce((total, nome) => {
      return total + (item?.servicos[nome] ?? 0);
    }, 0);
  }

  getPrecoAdicionalPorCachorro(pet: cachorro, adicionais: string[]): number {
    const porteKey = pet.porte === 'Pequeno' ? 'P' : pet.porte === 'Médio' ? 'M' : 'G';
    return adicionais.reduce((total, nome) => {
      return total + (this.adicionais[nome]?.[porteKey] ?? 0);
    }, 0);
  }

  getPrecoTotalHorario(horario: horario): number {
  return horario.cachorros.reduce((total: number, pet: cachorro) => {
    const base = this.getPrecoBasePorCachorro(pet, [horario.servicosBaseSelecionado]);
    const adicionais = this.getPrecoAdicionalPorCachorro(pet, horario.adicionais);
    return total + base + adicionais;
  }, 0);
}

  getRacasPorPorte(porte: string): string[] {
    return [...new Set(this.servicosBase
      .filter(item => item.porte === porte)
      .map(item => item.raca)
    )];
  }

  getServicosPorRacaPorte(raca: string, porte: string): string[] {
    const item = this.servicosBase.find(s => s.porte === porte && s.raca === raca);
    return item ? Object.keys(item.servicos) : [];
  }

  getServicosAdicionais(): string[] {
    return Object.keys(this.adicionais);
  }
}