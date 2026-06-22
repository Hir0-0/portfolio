# Portfolio / Diário Criativo

Site estático para GitHub Pages — HTML/CSS/JS puros + Three.js (CDN) + Eleventy (apenas para a seção Diário).

## Estrutura

```
/                       → páginas estáticas (index, galeria, beats, prototipos, consultoria)
shared/                 → CSS, JS e assets compartilhados
galeria/                → mídias da galeria (categorias/...)
prototipos/             → cada protótipo em sua própria pasta
src/                    → fonte 11ty do Diário
diario/                 → output gerado pelo 11ty (commitar para GitHub Pages)
```

## Comandos

```bash
npm install
npm run build      # gera /diario/
npm run serve      # dev server do 11ty na seção Diário
```

Para servir o site completo localmente (todas as páginas + diário):

```bash
npx serve .
# ou
python3 -m http.server 8080
```

## Deploy no GitHub Pages

1. `npm run build` — gera `/diario/`.
2. Commit de tudo (raiz + `diario/`).
3. Em **Settings → Pages**: source = branch `main`, pasta `/ (root)`.

## TODOs

- Substituir `shared/assets/logo.png` (atualmente ASCII art no loading).
- Substituir `shared/assets/diskette.mp3` (atualmente arquivo vazio/silencioso).
- Adicionar mídias reais em `galeria/categorias/`.
- Configurar endpoint do Formspree em `consultoria.html` (`<form action="TODO_FORMSPREE_URL">`).
- Adicionar IDs reais de tracks SoundCloud / YouTube em `beats.html`.
- Popular `prototipos/` com demos reais (p5.js / Three.js / HTML).
