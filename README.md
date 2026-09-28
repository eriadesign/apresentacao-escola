# apresentacao-escola

Apresentação interativa de **onboarding de novos membros da AUVP**, feita com HTML, CSS e JavaScript puros, sem etapa de build.

## Como rodar

```bash
npx serve .
```

Abra o endereço que aparecer (ex.: `http://localhost:3000`). Também dá para abrir o `index.html` direto no navegador.

## Navegação

| Ação | Como |
| --- | --- |
| Avançar (revela itens um a um quando houver) | `→`, `Espaço`, `PageDown` ou deslizar para a esquerda |
| Voltar | `←`, `PageUp` ou deslizar para a direita |
| Primeiro / último slide | `Home` / `End` |
| Tela cheia | `F` |
| Esconder os sublinhados laranja de "a preencher" | `T` |

O slide atual fica na URL (`#12`), então dá para abrir direto num slide.

## Estrutura dos slides

1. Capa e boas-vindas
2. Informações básicas
3. **Bloco 1 · Acesso e cadastro:** Minha AUVP
4. **Bloco 2 · Aulas, comunidade e ferramentas:** plataforma de aulas, comunidade, Minhas Finanças, Diagrama do Cerrado e Analítica; encontros ao vivo; AUVP Sempre; tarefa de casa
5. **Bloco 3 · Ecossistema e serviços:** AUVP Capital, parceria BTG, vantagens, fee-based, planos, abertura de conta, ecossistema
6. **Bloco 4 · Avisos e próximos passos:** lembretes, dúvidas + QR code de avaliação, agradecimento

## Como editar

| O quê | Onde |
| --- | --- |
| Textos | `index.html` (cada slide é um `<section class="slide">`) |
| Links e QR codes | `js/config.js` |
| Prints das ferramentas e foto do Raul | `assets/img/` (nomes abaixo) |
| Cores e fontes | variáveis no topo de `css/styles.css` |

Trechos com **sublinhado tracejado laranja** (`class="todo"`) ainda precisam ser preenchidos ou confirmados.

### Imagens esperadas em `assets/img/`

Enquanto a imagem não existe, aparece um placeholder com o nome do arquivo.

| Arquivo | Onde aparece |
| --- | --- |
| `minha-auvp.png` | Bloco 1 |
| `aulas.png` | Bloco 2 · Plataforma de aulas |
| `comunidade.png` | Bloco 2 · Comunidade |
| `minhas-financas.png` | Bloco 2 · Minhas Finanças |
| `diagrama-cerrado.png` | Bloco 2 · Diagrama do Cerrado |
| `analitica.png` | Bloco 2 · Analítica |
| `raul.jpg` | Tarefa de casa (avatar) |

Prints em 16:10 (ex.: 1440×900) ficam melhores.

## Fluxo de trabalho

1. Crie uma branch a partir da `main`.
2. Faça as alterações e o commit.
3. Abra um PR em `eriadesign/apresentacao-escola`.
