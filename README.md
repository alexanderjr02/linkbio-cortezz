# Cortez Barbearia · Link na bio

Página única (link na bio) da Cortez Barbearia: serviços, equipe, app,
galeria, localização e todos os links de contato.

Site estático puro — sem build, sem dependências, sem npm.

## Estrutura

```
linkbio-cortezz/
├── index.html              ← markup da página (é o arquivo que abre)
├── README.md
├── .gitignore
├── _fonte/                 ← masters brutos, NÃO publicar (fora do git)
│   └── reel-original.mp4
└── assets/
    ├── css/
    │   └── style.css       ← todos os estilos
    ├── js/
    │   └── main.js         ← loader, vídeo do hero, revelações, carrosséis
    ├── img/
    │   ├── favicon.svg     ← ícone da aba
    │   ├── hero-poster.jpg ← primeiro quadro do vídeo do hero
    │   └── README.md       ← como trocar os placeholders por fotos reais
    └── video/
        ├── hero.webm       ← fundo do hero (VP9, 240 KB)
        ├── hero.mp4        ← mesmo vídeo em H.264 (308 KB, Safari/iOS)
        └── README.md       ← como o vídeo foi tratado e como trocar
```

## O fundo em vídeo do hero

O vídeo é **enfeite, não estrutura**: a página tem que ficar bonita sem ele,
e fica. Quem sustenta o hero é o poster de 19 KB; o vídeo entra por cima
quando dá.

Ele **não é baixado** em nenhum destes casos — em todos sobra o poster:

- `prefers-reduced-motion: reduce` ligado no sistema
- modo de economia de dados (`navigator.connection.saveData`)
- conexão 2G ou 3G
- autoplay barrado pelo navegador

Quando é baixado, os `src` ficam em `data-src` até o loader terminar, então
ele nunca disputa banda com as fontes e o primeiro desenho da tela. Medido
no navegador: CSS, JS e poster saem aos 45 ms; o vídeo só começa aos 2,2 s.
Ele também pausa sozinho quando sai da tela ou a aba fica escondida.

Detalhes do tratamento em [assets/video/README.md](assets/video/README.md).

## Como rodar

Basta abrir o `index.html` no navegador (duplo clique). Todos os caminhos são
relativos e o JS não usa módulos ES, então funciona no `file://`.

Para simular o ambiente real (recomendado antes de publicar):

```bash
npx serve .
# ou
python -m http.server 8000
```

## Como publicar

Suba a pasta inteira em qualquer host de estático (Netlify, Vercel, GitHub
Pages, Render Static Site). O diretório de publicação é a raiz do projeto e
não há comando de build.

## O que ainda precisa ser preenchido

Procure por `TROCAR` no `index.html`:

- [x] ~~Fotos de serviços e galeria~~ — 9 fotos tiradas do próprio reel, ver
      [assets/img/README.md](assets/img/README.md)
- [x] ~~Instagram~~ — apontando para `@cortezz.barbearia`
- [x] ~~Equipe~~ — Rodrigo Cerqueira (Fundador), Thalisson Barbosa (Barbeiro)
      e Sandra Cerqueira (Cabeleireira). 3 cards, não 4.
- [ ] **Especialidade de cada um** (opcional). O card tem espaço para uma
      linha tipo "degradê e barba desenhada", que ajuda o cliente a escolher.
      As descrições antigas ("12 anos de navalha", "cabelo afro,
      texturização") eram inventadas pelo modelo e foram removidas em vez de
      herdadas — não dá para atribuir credencial fictícia a pessoa real.
- [ ] **Fotos da equipe** — seguem com monograma (R, T, S). Proporção 3:4,
      mínimo 600 × 800, em `assets/img/equipe/`.
- [ ] Links dos botões **Agendar horário** e **Baixar o app**
- [ ] WhatsApp e link do mapa na seção de bio links
- [ ] Endereço e telefone em **Onde estamos** (hoje: "Rua Exemplo, 123").
      O perfil do Instagram diz **Gama · DF** — falta a rua e o número.
- [ ] Conferir os horários (hoje: seg–sex 9h–20h, sáb 9h–18h, dom fechado)
- [ ] Conferir os preços dos 5 serviços (hoje: R$ 45 / 35 / 60 / 50 / 120)
- [ ] O depoimento assinado por "Lucas M." é fictício — troque por um
      review real ou remova a seção
- [x] ~~Prévia ao compartilhar~~ — card 1200 × 630 em
      `assets/img/og.jpg` + tags Open Graph

## Publicação

O site está em **https://cortezz.vercel.app** (Vercel, deploy automático a
cada push na `main`).

⚠️ **As tags Open Graph têm o endereço escrito por extenso** no `<head>` do
`index.html` — `og:url`, `og:image`, `twitter:image` e o `<link rel=canonical>`.
Prévia de link não aceita caminho relativo. **Se o site mudar de endereço
(domínio próprio, por exemplo), troque esses quatro** ou o WhatsApp passa a
mostrar um retângulo sem imagem.

Para regerar o card de prévia, o método foi: montar um HTML de 1200 × 630 com
a marca sobre uma foto tratada, abrir no navegador e capturar a tela. Assim a
fonte Cinzel sai igual à do site, o que nenhum gerador de imagem entrega.

## Notas de manutenção

- **A ordem das regras no `style.css` importa.** O bloco
  `@media(prefers-reduced-motion:reduce)` precisa continuar no fim do arquivo:
  ele sobrescreve `.reveal` e `.loader`, e perde a disputa se subir.
- **A página depende de JavaScript para abrir.** O `<body>` começa com a
  classe `locked` e é o `main.js` que a remove no fim do loader. Sem JS a
  página fica travada — vinha assim desde a versão original, não foi
  introduzido pela separação em pastas. Se um dia isso importar, a correção é
  aplicar `locked` via JS em vez de deixá-la no HTML.
- **`_fonte/` não vai para o ar.** Está no `.gitignore`, mas se você publicar
  arrastando a pasta para o host, apague ou deixe `_fonte/` de fora na mão —
  são 16 MB que ninguém baixa à toa.
- O `main.js` fica no fim do `<body>`, sem `defer` e sem `type="module"`, de
  propósito — assim a página continua funcionando aberta direto do disco.
- O logo (navalha) é SVG inline e aparece três vezes no `index.html`: loader,
  hero e rodapé. O do rodapé usa dourado (`#C6A15B`), os outros usam creme
  (`#F4EEE2`). Ao mudar o desenho, ajuste os três — e também o
  `assets/img/favicon.svg`.
- As fontes vêm do Google Fonts; a página precisa de internet para exibir a
  tipografia correta.
