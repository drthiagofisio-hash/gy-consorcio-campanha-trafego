# Sistema de Acompanhamento de Campanha
## GT Consórcios · BM Rodobens · Agora Marketing

Sistema web completo para acompanhamento de campanhas de tráfego pago da Meta Ads.

---

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse: **http://localhost:5173**

---

## 📊 Como importar o CSV da Meta

### 1. Exporte o relatório no Gerenciador de Anúncios

Configure as colunas: Nome da campanha, Nome do conjunto de anúncios, Nome do anúncio, Valor usado (BRL), Resultados, Leads, Conversas iniciadas (mensagens), Custo por resultado, Custo por lead, Frequência, Cliques (todos), CTR (todos), Alcance.

### 2. Exporte como CSV
- Selecione o período da semana desejada
- Clique em "Exportar" → "Exportar dados da tabela" → CSV

### 3. Importe no sistema
- Clique em **"Importar CSV"** na sidebar
- Selecione a semana (1, 2, 3 ou 4)
- Arraste ou selecione o arquivo CSV
- Confirme o preview e importe

> O sistema detecta automaticamente o separador (vírgula ou ponto-e-vírgula) e converte números no formato brasileiro (1.234,56).

---

## ⚙️ Configurações importantes

### CPL Meta por fluxo
Acesse **Configurações** para definir o CPL alvo de cada fluxo. O sistema usa esses valores para calcular os status (Escalar / Manter / Observar / Pausar).

### Mapeamento Anúncio × Vídeo
Para que o sistema reconheça qual vídeo (V1–V9) está em cada anúncio, cadastre o nome exato do anúncio (como aparece no CSV) vinculado ao vídeo correspondente.

---

## 🔴 Status automático das campanhas

| Status | Critério |
|--------|---------|
| 🟢 Escalar | CPL < 70% da média + leads acima da média |
| 🔵 Manter | CPL dentro de ±30% da média |
| 🟡 Observar | CPL entre 30% e 100% acima da média |
| 🔴 Pausar | CPL > 2× a média ou freq. > 3,5 sem resultado |
| 🟠 Trocar criativo | CTR < 1% com frequência > 2 |

---

## 📋 Campanhas cadastradas

### Fluxo 1 — WhatsApp Bittrex (70% · R$ 1.907,50/semana)
RAB_WA_01 · RAB_WA_02 · RAB_WA_03 · RAB_WA_04 · RAB_WA_05 · RAB_WA_06

### Fluxo 2 — Formulário Grupo GT (20% · R$ 545/semana)
RAB_FORM_01 · RAB_FORM_02 · RAB_FORM_03

### Fluxo 3 — Formulário Davi (10% · R$ 272,50/semana)
RAB_DAVI_01 · RAB_DAVI_02

---

## 🎬 Criativos: V1 a V9
V1 — 3 Formas de Comprá-lo | V2 — Aluguel Disfarçado | V3 — Erro Financeiro | V4 — Plano Sem Lance | V5 — Tela Dividida BYD | V6 — Tela Dividida Corolla | V7 — Tela Dividida Picape | V8 — Traduzindo Consórcio | V9 — Vídeo H9/Haval

---

## 💾 Armazenamento
Os dados são salvos no **localStorage** do navegador. Para restaurar os dados de exemplo, acesse Configurações → "Restaurar mock".

---

## 🛠️ Stack
React 19 · Vite · Tailwind CSS 3 · Recharts · PapaParse · jsPDF · lucide-react

*Desenvolvido para Agora Marketing — uso interno*
