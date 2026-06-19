# VoleApp Frontend

Aplicación web (SPA) para la gestión y reserva de pistas de pádel. Es el cliente de la [API de VoleApp](../voleapp-backend) y consume la librería de componentes propia [`ui`](../ui-library).

Permite a los usuarios buscar disponibilidad (por ciudad, fecha/hora y duración) para encontrar pistas libres —agrupadas por club— y reservarlas con pago integrado (Stripe); a los administradores gestionar su club (pistas, horarios, eventos, precios, miembros) y ver analíticas; y al superadmin administrar toda la plataforma.

## Tecnologías

- **[Vue 3](https://vuejs.org/)** (Composition API, `<script setup>`) — framework principal
- **[Vite 7](https://vite.dev/)** — bundler y servidor de desarrollo
- **[TypeScript](https://www.typescriptlang.org/)** — tipado estático
- **[Pinia](https://pinia.vuejs.org/)** + **[pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)** — estado global persistente
- **[Vue Router](https://router.vuejs.org/)** — enrutado y guardias de navegación
- **[PrimeVue 4](https://primevue.org/)** (tema Aura personalizado) — componentes base de UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** — estilos utilitarios
- **[Axios](https://axios-http.com/)** — cliente HTTP con interceptores
- **[Zod](https://zod.dev/)** — validación de formularios
- **[Chart.js](https://www.chartjs.org/)** — gráficas de analíticas
- **[anime.js](https://animejs.com/)** — animaciones de la interfaz (landing y vistas de gestión)
- **[jwt-decode](https://github.com/auth0/jwt-decode)** — lectura del JWT
- **[`ui`](../ui-library)** — librería de componentes propia (ver [Integración](#integración-con-la-librería-ui))
- **[Vitest](https://vitest.dev/)** + **[Playwright](https://playwright.dev/)** — tests unitarios y E2E

## Arquitectura

La aplicación se organiza **por módulos de dominio**. Cada módulo en `src/modules/` es autocontenido y sigue siempre las mismas capas:

```
src/modules/<dominio>/
├── api/           # configuraciones de petición Axios (método + url)
├── actions/       # llaman a la API, mapean la respuesta y lanzan errores tipados
├── interfaces/    # tipos del dominio
├── schemas/       # esquemas de validación Zod (en los módulos con formularios)
├── routes/        # rutas del módulo
└── views/         # vistas (páginas)
```

Módulos: `auth`, `user`, `club`, `reservation`, `admin`, `landing` (el módulo `auth` tiene además sus propios `layouts/`).

La **lógica reutilizable y el estado no viven dentro de los módulos**, sino en dos capas transversales globales: los **composables** (`src/composables/`) y los **stores** de Pinia (`src/stores/`). Los módulos consumen ambos.

El **flujo de datos** es unidireccional y por capas:

```
Vista  →  Composable  →  Action  →  api (config)  →  clientApi (Axios)  →  API REST
              ↓
            Store (Pinia)
```

- **`api/`**: define solo la configuración de la petición (`{ method, url }`), sin lógica.
- **`actions/`**: ejecutan la petición con `clientApi`, transforman la respuesta y traducen los errores del backend a errores de negocio del cliente (no se muestra nunca el mensaje crudo del backend, ver [Manejo de errores](#manejo-de-errores)).
- **`composables/`** (`src/composables/`): capa de orquestación reutilizable (`useAuth`, `useReservation`, `useClub`, `useCourt`, `useEvent`, `useSchedule`, `useMember`, `usePricingConfig`, `useAnalytics`, `useUser`, `useContact`…). Combinan actions con los stores y exponen estado reactivo a las vistas.
- **`stores/`** (Pinia): `authStore` (sesión/JWT/roles), `userStore` (perfil y reservas del usuario), `clubStore` (club activo, horarios, etc.). Persistidos en almacenamiento local.

### Capa HTTP

`src/api/clientApi.ts` centraliza Axios con interceptores que:

- Inyectan el **token JWT** (`Authorization: Bearer …`) en cada petición.
- Gestionan un **loading global** (salvo cabecera `x-no-loading`).
- Implementan el **refresh token** automático ante un `401` (con cola de peticiones en espera mientras se renueva; si falla, cierra sesión y redirige a login).
- Emiten errores globales para `500` y `403` mediante un bus de eventos (`useApiBus`).

### Manejo de errores

`src/api/errorsApi.ts` define clases de error del cliente (`ConnectionError`, `NotAuthorizedError`, `Forbidden`, `NotFoundError`, `ValidationError`, `BusinessError`). Las *actions* leen el **código** (`title`) del error que devuelve la API (formato Problem Details) y lanzan el error de cliente con un **mensaje propio**: el frontend nunca muestra directamente el `detail` del backend.

### Auto-imports

Mediante `unplugin-auto-import` y `unplugin-vue-components` **no hace falta importar manualmente**:

- APIs de Vue, Vue Router y Pinia, ni los `composables`, `stores`, `components`, `helpers` y `utils` del proyecto.
- Los componentes de PrimeVue (resolver oficial) y los de la librería `ui` cuyo nombre empieza por ciertos prefijos (`Base`, `User`, `Schedule`, `Event`, `Login`, `Register`, `Nav`, `Header`, `Footer`, `Grouped`).

Los ficheros `auto-imports.d.ts` y `components.d.ts` se generan automáticamente.

> Los **tipos e interfaces** (tanto los compartidos de `src/types` como los de dominio en `modules/**/interfaces`) se importan **explícitamente** con `import type`.

## Requisitos

- [Node.js](https://nodejs.org/) `^20.19 || >=22.12`
- npm
- La [API de VoleApp](../voleapp-backend) en ejecución (local o desplegada)

## Configuración

Variables de entorno por modo (`.env.development`, `.env.staging`, `.env.production`):

```env
VITE_STAGE=dev
VITE_API_URL=http://localhost:5115/
```

| Variable | Descripción |
|----------|-------------|
| `VITE_STAGE` | Entorno actual (`dev` / `staging` / `production`) |
| `VITE_API_URL` | URL base de la API REST |

> En producción los valores pueden ponerse en `.env.production`, pero es preferible definirlos en las **variables de entorno de la plataforma de despliegue (Vercel)** y no versionarlos. Al ser variables `VITE_`, se incrustan en el bundle en tiempo de *build*.

## Puesta en marcha

```bash
npm install        # instala dependencias (incluida la librería ui desde GitHub)
npm run dev        # desarrollo (modo development)
npm run staging    # desarrollo apuntando a staging
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run staging` | Desarrollo en modo staging |
| `npm run build` | Type-check + build de producción |
| `npm run build:staging` | Build en modo staging |
| `npm run preview` | Sirve el build localmente |
| `npm run lint` | ESLint con autofix |
| `npm run format` | Prettier sobre `src/` |
| `npm run type-check` | Comprobación de tipos (`vue-tsc`) |

> El proyecto deja preparada la infraestructura de testing (`test:unit` con Vitest y `test:e2e` con Playwright), pero **actualmente no hay suite de tests** (solo el ejemplo por defecto de Playwright en `e2e/`), por lo que esos scripts no se usan todavía.

## Integración con la librería `ui`

El frontend consume la librería de componentes propia [`ui`](../ui-library), declarada como dependencia desde GitHub:

```jsonc
// package.json
"ui": "github:ceemeese/ui-library"
```

En `src/main.ts` se registra como plugin (registro global de todos los componentes) y se importan sus estilos:

```ts
import UILibrary from 'ui';
import 'ui/style.css';

app.use(UILibrary);
```

Además, los componentes de `ui` con prefijos conocidos se **auto-importan** sin escribir el `import` (configurado en `vite.config.ts`).

Vue y PrimeVue dependen de que exista **una sola instancia compartida** en la aplicación: el registro de plugins, el sistema de `provide`/`inject` (que PrimeVue usa para su configuración y temas) y la reactividad de Vue se basan en un estado interno único. Si npm resolviera **dos copias** —una en la app y otra arrastrada por la librería `ui`— habría dos "contextos" distintos y aparecerían errores en tiempo de ejecución (p. ej. componentes de `ui` que no encuentran la configuración de PrimeVue, o reactividad que no se propaga).

Para evitarlo, `vite.config.ts` aplica `dedupe` y fuerza los alias de `vue`, `primevue` y `@primevue/core` hacia el `node_modules` de la app, garantizando una única copia física de cada uno.

> Detalle importante de desarrollo: la librería se instala **ya compilada** (`dist/`). Si modificas algo en `ui-library`, debes reconstruirla y actualizar la dependencia en el front para ver los cambios (ver el README de `ui-library`).

## Despliegue

- **Producción**: desplegada en **Vercel**. `vercel.json` incluye el *rewrite* SPA (todas las rutas → `index.html`) necesario para el enrutado de Vue Router en modo history.
- Las variables de entorno de producción (p. ej. `VITE_API_URL`) se configuran en el proyecto de **Vercel**.
- La API que consume corre en **Google Cloud Run**.

## Estructura del proyecto

```
src/
├── api/           # clientApi (Axios + interceptores) y errorsApi
├── assets/        # estilos globales y recursos
├── components/    # componentes propios de la app (no de la librería ui)
├── composables/   # lógica reutilizable (orquestación actions + stores)
├── helpers/       # utilidades de fechas, etc.
├── layouts/       # layouts (Main, Admin…)
├── models/        # modelos
├── modules/       # módulos de dominio (auth, user, club, reservation, admin, landing)
├── plugins/       # registro de plugins (Pinia)
├── router/        # rutas y guardias de navegación (por rol)
├── stores/        # estado global Pinia (auth, user, club)
├── types/         # tipos compartidos
├── utils/         # utilidades varias
├── views/         # vistas no asociadas a un módulo (NotFound…)
├── App.vue
└── main.ts        # arranque: PrimeVue (tema Aura), librería ui, router, servicios
```
