# 2026 Training: Laravel + Angular Starter Kit

Este repositorio sirve como proyecto base para prácticas de desarrollo backend y frontend, con **Laravel 12** en el backend y **Angular 20** en el frontend.  


---

## Índice

- [Prerrequisitos](#prerrequisitos)
- [Cómo empezar](#cómo-empezar)
- [Estado del proyecto (24-03-2026)](#estado-del-proyecto-24-03-2026)
- [Checklist de avance](#checklist-de-avance)
- [Plan para retomar mañana](#plan-para-retomar-mañana)
- [Estructura del proyecto](#estructura-del-proyecto)
  - [Backend (`backend/`)](#backend-backend)
  - [Frontend (`frontend/`)](#frontend-frontend)
  - [DbGate (cliente de base de datos)](#dbgate-cliente-de-base-de-datos)
- [Objetivos de aprendizaje](#objetivos-de-aprendizaje)
- [Buenas prácticas](#buenas-prácticas)
- [Estilo de código](#estilo-de-código)

---

## Prerrequisitos

Para seguir esta guía necesitas tener instalado en tu máquina:

- **Docker** (y Docker Compose), para levantar la API, el frontend, la base de datos y DbGate. Sin Docker no podrás ejecutar `make start` ni el resto de comandos que dependen de los contenedores.
- **Make** (GNU Make), para usar los objetivos del `Makefile` (`make start`, `make install`, `make db-migrate`, etc.).
- **Git**, para clonar el repositorio.

---

## Cómo empezar

1. **Clonar el repositorio:**

   ```bash
   git clone <repo-url>
   cd 2026-training-laravel-angular
   ```

2. **Configurar entorno backend (solo la primera vez):** copiar el archivo de ejemplo:

   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Levantar los contenedores Docker:**

   ```bash
   make start
   ```

4. **Instalar dependencias backend, migrar la base de datos y generar clave de aplicación:**

   ```bash
   make install   # composer install + migraciones (requiere que los contenedores estén levantados: make start)
   docker compose run --rm api php artisan key:generate
   ```

   Si el contenedor `api` no quedó en marcha, vuelve a levantar: `make start`.

5. **Frontend (Angular):** El repositorio ya incluye el proyecto en `frontend/`. Con `make start` el contenedor levanta la app automáticamente. Para desarrollo en primer plano con live reload: `make serve-frontend`.

Tras seguir estos pasos tendrás:

- **API (Laravel):** [http://localhost:8000](http://localhost:8000)
- **Frontend (Angular):** [http://localhost:4200](http://localhost:4200)
- **DbGate (MySQL):** [http://localhost:9051](http://localhost:9051) (conexión **Training MySQL** preconfigurada)

---

## Estado del proyecto (24-03-2026)

Este bloque sirve como resumen para retomar rápido el trabajo.

- **Hito 1 (Modelo de datos):** completado
   - Migraciones TPV creadas
   - Relaciones entre tablas creadas con claves foráneas
   - Seeders con datos de prueba

- **Hito 2 (API Backoffice):** completado
   - `families`: CRUD completo + activar/desactivar + tests
   - `taxes`: CRUD completo + tests
   - `zones`: CRUD completo + tests
   - `tables`: CRUD completo + tests
   - `products`: CRUD completo + activar/desactivar + tests

- **Estado de tests backend:** en verde
   - Última ejecución conocida: `14 tests`, `114 assertions`, todo OK

- **Repositorio remoto de trabajo:**
   - `origin`: `https://github.com/Barikeloo/YurestTPV.git`
   - `upstream`: `https://github.com/yurest/2026-training-laravel-angular.git`

---

## Checklist de avance

### Hito 1
- [x] Migraciones de entidades TPV
- [x] Relaciones de base de datos
- [x] Seeders con datos de trabajo
- [x] Validación con migración limpia + seed

### Hito 2
- [x] CRUD `families`
- [x] Activar/desactivar `families`
- [x] CRUD `taxes`
- [x] CRUD `zones`
- [x] CRUD `tables`
- [x] CRUD `products`
- [x] Activar/desactivar `products`

---

## Plan para retomar mañana

Hito 2 ya está cerrado. Orden recomendado para continuar:

1. Revisar `ROADMAP.md` para definir el siguiente hito funcional.
2. Priorizar casos de uso de negocio del siguiente bloque (ventas, líneas de venta, caja, etc.).
3. Mantener la misma estrategia: implementar por dominio + tests de feature.
4. Ejecutar `make test` en cada avance y dejar siempre en verde.

Comandos útiles:

```bash
make test
make db-migrate
docker compose exec api php artisan migrate:fresh --seed
```

---

## Estructura del proyecto

### Backend (`backend/`)

El backend sigue un enfoque **DDD + Hexagonal**, con cada dominio encapsulado bajo su propio namespace.  
El ejemplo que se muestra a continuación es para el dominio `User`.

```text
App/
└── User/
    ├── Domain/
    │   ├── Entity/
    │   ├── ValueObject/
    │   └── Interfaces/
    ├── Application/
    │   └── CreateUser.php
    └── Infrastructure/
        ├── Persistence/
        └── Entrypoint/Http/
```

| Carpeta | Descripción |
|---------|-------------|
| **Domain/** | Lógica de negocio pura, entidades y value objects. |
| **Interfaces/** | Contratos del dominio (por ejemplo `UserRepositoryInterface`). |
| **Application/** | Casos de uso y handlers. |
| **Infrastructure/** | Adaptadores que conectan el dominio con el mundo externo: persistencia, HTTP, colas. |
| **Entrypoint/Http/** | Controladores o endpoints HTTP. |

### Frontend (`frontend/`)

Proyecto **Angular 20**. Cliente mínimo que consume la API del backend (ver [Cómo empezar](#cómo-empezar) para las URLs de acceso).

### DbGate (cliente de base de datos)

Interfaz web para explorar y consultar la base MySQL. La conexión **Training MySQL** queda preconfigurada y apunta a la base `training` del servicio `db`.

---

## Objetivos de aprendizaje

- Comprender y aplicar **DDD**: separar Domain, Application e Infrastructure.
- Aprender a usar **repositorios e interfaces** para desacoplar dominio de la persistencia.
- Practicar la implementación de **casos de uso y handlers**.
- Exponer la lógica de negocio a través de **HTTP entrypoints** y mantener el dominio independiente del framework.
- Familiarizarse con **Docker**, **Composer** y **Node** en un flujo de desarrollo profesional.

---

## Buenas prácticas

- Programar contra **interfaces**, no implementaciones concretas.
- Evitar lógica de negocio en Controllers o Eloquent Models.
- Mantener los dominios **autocontenidos**, siguiendo la convención: `App/<Dominio>/{Domain, Application, Infrastructure}`.
- Escribir **tests** que dependan de la interfaz del dominio, no de la implementación concreta.

---

## Estilo de código

Para mantener un código consistente entre todos los colaboradores (humanos y IAs), se siguen estas pautas:

- **Backend (PHP):** PSR-12 y las recomendaciones de [Symfony Coding Standards](https://symfony.com/doc/current/contributing/code/standards.html).
- **Frontend (Angular):** [Angular Style Guide](https://angular.dev/style-guide).
- **Convenciones básicas**:
  - Una **clase por archivo**.
  - `camelCase` para variables y métodos, `PascalCase` para clases, `SCREAMING_SNAKE_CASE` para constantes.
  - Propiedades antes de los métodos; métodos públicos antes que protegidos y privados.
  - Imports (`use`) para todas las clases que no estén en el espacio de nombres actual.
- **Estructura y formato**:
  - Siempre usar paréntesis al instanciar clases (`new Foo()`).
  - En arrays multilínea, dejar **coma final** en cada elemento.
  - Añadir una línea en blanco antes de un `return` cuando mejore la legibilidad.
  - Evitar lógica compleja en una sola línea; preferir bloques claros con llaves siempre presentes.

Antes de subir cambios, se recomienda:

```bash
make test   # tests del backend (PHPUnit)
make lint   # formatear código PHP (Laravel Pint)
```
