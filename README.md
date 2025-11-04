<h1 align="center">modern-idoc-svg</h1>

<p align="center">
  <a href="https://unpkg.com/modern-idoc-svg">
    <img src="https://img.shields.io/bundlephobia/minzip/modern-idoc-svg" alt="Minzip">
  </a>
  <a href="https://www.npmjs.com/package/modern-idoc-svg">
    <img src="https://img.shields.io/npm/v/modern-idoc-svg.svg" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/modern-idoc-svg">
    <img src="https://img.shields.io/npm/dm/modern-idoc-svg" alt="Downloads">
  </a>
  <a href="https://github.com/qq15725/modern-idoc-svg/issues">
    <img src="https://img.shields.io/github/issues/qq15725/modern-idoc-svg" alt="Issues">
  </a>
  <a href="https://github.com/qq15725/modern-idoc-svg/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/modern-idoc-svg.svg" alt="License">
  </a>
</p>

## 📦 Install

```
npm i modern-idoc-svg
```

## 🦄 Usage

```ts
import { docToSvg } from 'modern-idoc-svg'

document.body.append(
  await docToSvg({
    children: [
      {
        name: 'ppt/slides/slide1.xml',
        style: { width: 960, height: 540 },
        children: [
          {
            style: { left: 50, top: 50, rotate: 60, width: 50, height: 50 },
            background: 'linear-gradient(#e66465, #9198e5)',
          },
          {
            style: { left: 150, top: 50, rotate: 60, width: 50, height: 50 },
            background: '/example.jpg',
          },
          {
            style: { rotate: 40, left: 100, top: 100, fontSize: 20, color: 'rgba(255, 0, 0, 0.2)' },
            text: 'test',
          },
          {
            style: { left: 200, top: 100, width: 100, height: 200, fontSize: 22 },
            text: [
              {
                letterSpacing: 3,
                fragments: [
                  { content: 'He', color: '#00FF00', fontSize: 12 },
                  { content: 'llo', color: '#000000' },
                ],
              },
              { content: ', ', color: '#FF0000' },
              { content: 'World!', color: '#0000FF' },
            ],
          },
        ],
      },
    ],
  }),
)
```

## Methods

- [docToSvg](src/methods/docToSvg.ts)
- [docToSvgString](src/methods/docToSvgString.ts)
- [docToSvgBlob](src/methods/docToSvgBlob.ts)

## Related

- [modern-idoc](https://github.com/qq15725/modern-idoc)
