# 🐾 Pet's Fran Agendamento

**Pet's Fran Agendamento** é uma aplicação web desenvolvida em Angular com o objetivo de facilitar o agendamento de serviços para pets, como banho, tosa e consultas. O diferencial é que toda a persistência de dados é feita diretamente no navegador do usuário, usando `localStorage`, dispensando backend ou banco de dados externo (futuramente o criador deste repositório irá expandir para um outro repositório full-stack).

---

## 🚀 Funcionalidades

- **Cadastro de pets e horários**
  - Formulário dinâmico via `MatDialog`
  - Armazenamento local dos dados

- **Visualização em tabela**
  - Lista de agendamentos com alternância entre concluídos e pendentes
  - Atualização automática após novos cadastros

- **Painel de detalhes**
  - Exibição de informações específicas do agendamento selecionado
  - Consumo de apis como do Whatsapp e Google Maps

- **Interface moderna**
  - Utilização de Angular Material
  - Estilização com SCSS

---

## 🧠 Tecnologias utilizadas

- Angular 16+
- Angular Material
- TypeScript
- SCSS
- `localStorage` para persistência de dados

---

## 📌 Observações

- Todos os dados são armazenados localmente no navegador
- Ideal para protótipos, MVPs ou uso offline
- Futuramente pode ser integrado com backend em .NET e banco de dados real
