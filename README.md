# Win10-Otimizador

Aplicativo desktop Electron + React para otimização de Windows.

## 🚀 Instruções rápidas

### Rodar localmente
1. Instale dependências:
   ```bash
   npm ci
   ```
2. Rode em modo dev:
   ```bash
   npm run dev
   ```
3. Rode como app desktop (Electron):
   ```bash
   npm start
   ```

### Gerar instalador localmente
1. Execute:
   ```bash
   npm run build
   npm run make
   ```
2. Instalações criadas em:
   - `out/make/zip/linux/x64/...` (Linux zip)
   - `out/make/squirrel.windows/x64/...` (Windows Squirrel)

## 📦 GitHub Actions (instalador automático)

- Workflow de build: `.github/workflows/make-installer.yml` (gera artefatos em cada push/PR)
- Workflow de release: `.github/workflows/build-and-release.yml` (tag `v*` gera release com instalador)

### Criar release com instalador no GitHub
1. Criar tag e enviar:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. Ação gera instalador e publica no Release.
3. Vá em **Releases** no GitHub e baixe o `.exe`.

## 🔧 Ajustes importantes

- Nome do app do instalador: `package.json` → `config.forge.makers[0].config.name`.
- Se você quiser apenas Linux/Windows zip, mantenha `maker-zip` e `maker-squirrel`.

---

Se quiser, posso agora criar um `release` automático com tag e confirmar no seu GitHub em um único comando para você já ver o instalador na aba Releases.
