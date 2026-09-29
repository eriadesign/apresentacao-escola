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

O visual segue o [design system AUVP](https://central-produtos.vercel.app/design-system), tema **Escola** (modo escuro): Anek Latin nos títulos, Roboto no corpo, Sora nos botões, dourado `#F6C655`, cards com raio de 12px e ícones [Phosphor](https://phosphoricons.com).

Trechos com **sublinhado tracejado laranja** (`class="todo"`) ainda precisam ser preenchidos ou confirmados.

### Imagens

Os prints das ferramentas, a foto de "Antes de começar" e o vídeo da Minha AUVP vêm do CDN da AUVP (`cdn.asupernova.com.br`), direto no `index.html`.

A foto da sede (`assets/img/sede.jpg`) é uma cópia otimizada de 2400 px da original do CDN, que tem 39 MB.

Ainda falta a foto da comunidade no slide "Abra sua conta": salve como `assets/img/abra-sua-conta.jpg` (enquanto não existe, aparece um espaço reservado).

O ecossistema (`js/ecossistema.js`) mostra os serviços da AUVP em órbita em volta do olho, baseado na visualização do [site-vendas](https://eriadesign.github.io/site-vendas/) e usando as imagens publicadas nele.

## Fluxo de trabalho

1. Crie uma branch a partir da `main`.
2. Faça as alterações e o commit.
3. Abra um PR em `eriadesign/apresentacao-escola`.
