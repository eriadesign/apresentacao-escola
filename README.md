# apresentacao-escola

Apresentação interativa em formato de slides, feita com HTML, CSS e JavaScript puros, sem dependências e sem etapa de build.

## Como rodar

Abra o `index.html` no navegador. Se preferir um servidor local:

```bash
npx serve .
```

## Navegação

| Ação | Como |
| --- | --- |
| Próximo slide | `→`, `Espaço`, `PageDown` ou deslizar para a esquerda |
| Slide anterior | `←`, `PageUp` ou deslizar para a direita |
| Primeiro / último | `Home` / `End` |
| Tela cheia | `F` |

O slide atual fica na URL (`#3`), então dá para compartilhar um link direto para ele.

## Estrutura

```
index.html        # conteúdo dos slides (um <section class="slide"> por slide)
css/styles.css    # tema (variáveis em :root) e layout
js/main.js        # navegação e interações
```

## Fluxo de trabalho

1. Crie uma branch a partir da `main`.
2. Faça as alterações e o commit.
3. Abra um PR em `eriadesign/apresentacao-escola`.
