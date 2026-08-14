# assets/video

Fundo em vídeo do hero. Os dois arquivos têm o **mesmo conteúdo** — o
navegador baixa só um, o primeiro que souber tocar:

| Arquivo | Codec | Peso | Quem usa |
|---------|-------|------|----------|
| `hero.webm` | VP9 | 240 KB | Chrome, Firefox, Edge, Android |
| `hero.mp4` | H.264 | 308 KB | Safari, iOS, navegadores antigos |

540 × 960 · 24 fps · 8,5 s · **sem faixa de áudio** · `+faststart`.

## Como foi gerado

Origem: `_fonte/reel-original.mp4` (o reel do Instagram, 16,6 MB, 720×1280,
23,9 s). Três coisas foram feitas nele:

1. **Corte em 2,5s → 11,8s.** O reel termina num cartão preto com o logo do
   Instagram; em loop, o fundo apagaria. O trecho escolhido vai da escova até
   o close da máquina dourada.
2. **Loop contínuo.** Os últimos 0,8 s fazem crossfade com os primeiros
   0,8 s, então a volta do loop não dá salto.
3. **Desfoque gravado (`gblur=sigma=5.3`).** Resolve três coisas de uma vez:
   apaga a marca d'água `@CORTEZZ.BARBEARIA` que estava gravada na imagem e
   se movia pela tela, faz o vídeo recuar para trás da tipografia, e derruba
   o peso do arquivo (menos detalhe fino = menos bits).

Comando, se precisar refazer (requer ffmpeg):

```bash
ffmpeg -i _fonte/reel-original.mp4 -filter_complex "\
[0:v]trim=start=2.5:end=11.8,setpts=PTS-STARTPTS,fps=24,scale=540:-2,gblur=sigma=5.3,split=2[a][b];\
[a]trim=start=0.8,setpts=PTS-STARTPTS[main];\
[b]trim=start=0:end=0.8,setpts=PTS-STARTPTS[head];\
[main][head]xfade=transition=fade:duration=0.8:offset=7.7[v]" \
  -map "[v]" -an -c:v libx264 -crf 30 -preset slow -profile:v main \
  -pix_fmt yuv420p -movflags +faststart assets/video/hero.mp4

ffmpeg -i assets/video/hero.mp4 -c:v libvpx-vp9 -crf 38 -b:v 0 -row-mt 1 -an \
  assets/video/hero.webm

# poster = primeiro quadro, para os dois baterem
ffmpeg -i assets/video/hero.mp4 -frames:v 1 -q:v 6 assets/img/hero-poster.jpg
```

## Para trocar por outro vídeo

Rode os mesmos comandos com a origem nova, ajustando os tempos do `trim`.
Regras que valem para qualquer material:

- **Vertical (9:16)** funciona melhor: o hero corta pelas laterais no
  desktop e usa o quadro quase inteiro no celular.
- **Sem áudio** (`-an`). O vídeo toca mudo de qualquer forma, e faixa de
  áudio é peso morto.
- **Mire abaixo de 500 KB.** É um link na bio: a maior parte do público
  abre pelo celular, no 4G.
- Se o novo material não tiver marca d'água, dá para baixar o `sigma` para
  uns 2 e ganhar mais nitidez.

## Onde isso é usado

`index.html` (bloco `.hero__media`), estilos em `assets/css/style.css`
(seção "HERO · CAMADA DE VÍDEO") e a lógica de carregamento em
`assets/js/main.js` (`startHeroVideo`).
