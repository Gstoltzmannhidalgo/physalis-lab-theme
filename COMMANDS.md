# Comandos Físicos · Physalis Lab Theme

Guía rápida de comandos que vas a usar recurrentemente. Todos se ejecutan desde la raíz del proyecto:

```
~/Documents/Proyectos/physalis-lab-theme
```

---

## 1. Shopify CLI · desarrollo del theme

### Levantar entorno local con preview en vivo
```bash
shopify theme dev --store=physalis-lab.myshopify.com
```
Abre un preview en `http://127.0.0.1:9292` con hot reload. Cualquier cambio en archivos `.liquid`, `.css` o `.js` se refleja al instante. Shopify sube tus cambios a un **development theme** invisible para clientes.

### Listar todos los themes de la tienda
```bash
shopify theme list --store=physalis-lab.myshopify.com
```
Útil para ver cuál está publicado (`[live]`), cuáles son development, backups, etc.

### Subir el theme actual como nuevo theme unpublished (preview)
```bash
shopify theme push --store=physalis-lab.myshopify.com --unpublished --theme="Physalis Lab v1"
```
Sube el código local como un theme nuevo NO publicado. Para preview antes de activarlo.

### Publicar en producción (¡cuidado!)
```bash
shopify theme push --store=physalis-lab.myshopify.com --live
```
Pisa el theme activo. **Solo ejecutar cuando todo esté validado.**

### Bajar el theme activo de la tienda (sincronizar cambios del panel)
```bash
shopify theme pull --store=physalis-lab.myshopify.com --live
```
Útil si editaste algo desde el admin de Shopify y querés traerlo al código.

### Validar calidad del theme
```bash
shopify theme check
```
Corre el linter oficial. Revisa errores de Liquid, performance, accesibilidad.

---

## 2. Git · versionado

### Ver estado actual
```bash
git status
```

### Agregar y commitear cambios
```bash
git add .
git commit -m "feat: descripción corta en español"
```

Convención de prefijos:
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `chore:` tareas de mantenimiento (config, deps, gitignore)
- `docs:` solo documentación
- `style:` ajustes visuales/CSS sin cambio lógico
- `perf:` mejoras de performance
- `refactor:` reestructuración sin cambio funcional

### Subir al repo remoto
```bash
git push
```
(La primera vez: `git push -u origin main`)

### Bajar cambios del remoto
```bash
git pull
```

### Crear rama para una feature
```bash
git checkout -b feature/nombre-descriptivo
# ...trabajas, commits...
git push -u origin feature/nombre-descriptivo
```
Después volvés a main con `git checkout main` y mergeas cuando corresponda.

---

## 3. Flujo recomendado para editar el theme

1. `git pull` — traer lo último
2. `shopify theme dev --store=physalis-lab.myshopify.com` — levantar preview
3. Editar archivos localmente
4. Validar en el navegador (`http://127.0.0.1:9292`)
5. `shopify theme check` — linter
6. `git add . && git commit -m "feat: ..."`
7. `git push`
8. Cuando esté validado y quieras publicar: `shopify theme push --live`

---

## 4. Comandos útiles complementarios

### Ver logs del CLI si algo falla
```bash
shopify theme dev --verbose
```

### Cerrar sesión de Shopify CLI (útil si cambiás de tienda)
```bash
shopify auth logout
```

### Actualizar el CLI cuando haya versión nueva
```bash
npm install -g @shopify/cli@latest
```

---

## 5. Troubleshooting frecuente

| Problema | Solución |
|---|---|
| `shopify theme dev` pide autenticación | Abre el navegador, logueate con tu cuenta Shopify del store, vuelve a terminal |
| Cambios no se reflejan en preview | `Ctrl+C` y relanzá `theme dev` |
| `theme push` falla con conflicto | `shopify theme pull --live` primero, resolvé conflictos, después push |
| Olvidaste qué theme es el live | `shopify theme list` |
