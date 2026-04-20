# Performance + Accesibilidad — Phase 8

Cambios automáticos aplicados al theme y checklist manual a correr antes de salir a producción.

## Aplicado en código

### Performance
- Preload de fuente body + header en `layout/theme.liquid` (Dawn baseline, validado).
- Preconnect a `fonts.shopifycdn.com` activo.
- Mono font con `font_display: swap` (no bloquea render).
- CSS custom Physalis cargado *después* de base.css → no bloquea critical path.
- Imágenes en `disenadores-grid` y `card-product` usan `loading="lazy"` + `srcset` responsivo.
- Hero usa `loading="eager"` (above the fold).

### Accesibilidad
- Skip-to-content link visible al focus (Physalis cacao + cream, mono uppercase).
- Focus rings globales en mostaza con outline-offset 3-4px.
- Hit targets ≥44px en header, menú y filtros (WCAG 2.5.5).
- `prefers-reduced-motion: reduce` desactiva animaciones y hover scale.
- `forced-colors: active` agrega borde a botones (Windows high contrast).
- aria-label en designer cards (link wrapper).
- Print stylesheet básico que oculta nav/footer/forms.

## Checklist manual antes de producción

### Lighthouse (target ≥ 90 mobile)
1. Abrir `physalis-lab.myshopify.com` en Chrome incógnito.
2. DevTools → Lighthouse → Mobile · Performance + Accessibility + Best Practices + SEO.
3. Verificar:
   - [ ] Performance ≥ 85 mobile / ≥ 95 desktop
   - [ ] Accessibility ≥ 95
   - [ ] Best Practices ≥ 95
   - [ ] SEO ≥ 95
4. Cualquier alerta de "Image elements do not have explicit width and height" → revisar.
5. Cualquier "Background and foreground colors do not have a sufficient contrast ratio" → revisar combinación de scheme.

### Alt texts
- [ ] Cada imagen de producto tiene alt en admin.
- [ ] Cada portrait de diseñador (metaobject) tiene alt.
- [ ] Hero del home tiene alt descriptivo.
- [ ] Logo footer tiene aria-label "Physalis Lab".

### Navegación por teclado
- [ ] Tab desde la URL → primer foco en skip-link visible.
- [ ] Tab recorre header → drawer mobile abre/cierra con Enter.
- [ ] Tab en producto: title → variant pills → quantity → buy buttons (orden lógico).
- [ ] Esc cierra cart drawer y predictive search.

### Color contrast (manual con DevTools)
- [ ] Mostaza (#E0A94A) sobre cacao (#3E2418): texto OK ≥ 4.5:1.
- [ ] Cream (#F3E5BC) sobre cacao: hover de footer.
- [ ] Terracota sobre cream: vendor en producto. Verificar que no quede borderline en mobile.

### Mobile real
- [ ] Probar en iPhone Safari + Android Chrome.
- [ ] Verificar que el header sticky no tape contenido al hacer scroll up.
- [ ] Verificar que los tabs colapsables abran sin layout shift.

### Core Web Vitals (Search Console)
Una vez pasada la migración de dominio (Phase 9), monitorear durante 28 días:
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms
