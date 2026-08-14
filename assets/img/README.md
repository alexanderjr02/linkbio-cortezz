# assets/img

```
assets/img/
├── favicon.svg          ícone da aba (navalha do logo em dourado)
├── hero-poster.jpg      primeiro quadro do vídeo do hero
├── servicos/            5 fotos, 720 × 540 (4:3)
└── galeria/             4 fotos, 720 × 720 (1:1)
```

## De onde vieram as fotos

Todas foram tiradas do reel da própria barbearia (`_fonte/reel-original.mp4`)
— não há foto de banco de imagens aqui, é a Cortez de verdade.

O reel tem uma marca d'água `@CORTEZZ.BARBEARIA` gravada na imagem que **salta
de posição entre os planos** (canto superior direito num trecho, inferior
esquerdo em outro). Cada recorte foi escolhido para deixá-la de fora, e todos
foram conferidos um a um. Se você trocar alguma foto por outro quadro do reel,
confira esse detalhe antes.

| Arquivo | Momento do reel |
|---------|-----------------|
| `servicos/corte-masculino.jpg` | 7,7s — máquina no perfil do cliente |
| `servicos/barba.jpg` | 1,7s — barbeiro trabalhando a barba |
| `servicos/corte-feminino.jpg` | 4,3s — escova redonda e secador |
| `servicos/tratamento-capilar.jpg` | 5,2s — cabelo longo com brilho |
| `servicos/realinhamento.jpg` | 6,5s — cabelo alinhado |
| `galeria/01.jpg` | 0,9s — salão com a placa CORTEZ na parede |
| `galeria/02.jpg` | 11,4s — a máquina dourada |
| `galeria/03.jpg` | 3,1s — atendimento na cadeira |
| `galeria/04.jpg` | 13,2s — vista do salão |

**Ponto fraco conhecido:** `tratamento-capilar` e `realinhamento` são planos
parecidos (os dois mostram cabelo longo e brilhante), porque é o que o reel
tem. Se tiver foto melhor de tratamento, é a primeira que vale trocar.

## Equipe — ainda sem foto, de propósito

Os cards da equipe continuam com monograma (a letra no círculo). Os nomes que
estão lá — Rafael Cortez, Bruno Alves, Diego Martins, Camila Rocha — são
**fictícios**, vieram do modelo. Colocar o rosto real de um barbeiro embaixo
de um nome inventado seria pior que o monograma.

Para resolver, mande os **nomes reais + foto de cada um**. Aí é só trocar a
`<div class="pro__monogram">` por uma `<img>` dentro da mesma
`<div class="frame">`, em `index.html`.

## Proporções, se for trocar alguma foto

| Onde     | Proporção | Tamanho mínimo |
|----------|-----------|----------------|
| Serviços | 4:3       | 720 × 540      |
| Equipe   | 3:4       | 600 × 800      |
| Galeria  | 1:1       | 720 × 720      |

Mande as fotos **coloridas e normais**. O preto e branco com véu dourado é
aplicado por CSS em `.frame img` — se você já mandar tratada, o efeito é
aplicado duas vezes e o resultado fica sujo.
