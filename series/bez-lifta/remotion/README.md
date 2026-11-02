# Исходники анимации «Без лифта» (Remotion, atelier)

Риги персонажей (`parts/Tolik.tsx`, `parts/Gena.tsx`, кот в `parts/Props.tsx`), синхрон губ по таймингам
ElevenLabs (`parts/anim.ts`), субтитры (`parts/Captions.tsx`) и сцена пилота (`Composition.tsx`).

Рабочая копия живёт в `projects/bez-lifta-pilot/` (папка в .gitignore), здесь — сохранённая версия для новых сессий.

Восстановить в новой сессии:
1. `python scripts/scaffold_atelier_project.py bez-lifta-pilot --composition-id BezLiftaPilot`
2. Скопировать сюда-туда `*.tsx`, `parts/`, `art-direction.md`; `props.ep01.json` → `artifacts/props.json`.
3. Перегенерировать аудио (голоса — `elevenlabs_tts` c `with_timestamps`, SFX — промпты в `sfx_manifest.json`),
   нормализовать в `public/voice/*.wav` (−16 LUFS) и `public/sfx/*.wav` (−20 LUFS); шрифт Rubik 900 — в `public/fonts/`.
4. В облачном окружении без доступа к remotion.media: подложить Chromium из `/opt/pw-browsers` в
   `remotion-composer/node_modules/.remotion/chrome-headless-shell/linux64/chrome-headless-shell-linux64/` + файл `VERSION`.
5. Рендер — `video_compose`, `composition_mode: "atelier"`; затем мастеринг `loudnorm=I=-14:TP=-1.5`.

## Обложка серии
`parts/Cover.tsx` — шаблон обложки (Remotion `Still`, id `Cover`). Для новой серии меняются только `episode`, `title`
и «слот сцены» внутри компонента. Всё важное — в зоне 3:4 (y 240–1680), чтобы не обрезалось в сетке профиля.
```
npx remotion still projects/<slug>/index.tsx Cover cover.png --public-dir=<abs public> --props='{"episode":2,"title":"..."}'
```
