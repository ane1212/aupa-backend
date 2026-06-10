
# Aupa — Más allá del Guggen

> Plataforma de descubrimiento de lugares auténticos del País Vasco basada en inteligencia artificial y preferencias del usuario.

---

## Índice

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Tech stack](#tech-stack)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [API Reference](#api-reference)
- [Machine Learning](#machine-learning)
- [Base de datos](#base-de-datos)
- [Funcionalidades principales](#funcionalidades-principales)

---

## Descripción

**Aupa** es una aplicación web que ayuda a los turistas y residentes del País Vasco a descubrir lugares auténticos más allá de los circuitos turísticos convencionales. En lugar de seguir las guías populares, el sistema aprende las preferencias del usuario (gastronomía, naturaleza, cultura, ocio nocturno…) y, combinándolas con geolocalización y un modelo de puntuación de autenticidad local, ofrece recomendaciones personalizadas de bares, txokos, rutas de naturaleza, espacios culturales y más.

El nombre proviene del saludo informal vasco *"Aupa"* (¡Arriba!, ¡Venga!), que también es el espíritu de la plataforma: empujar al viajero a explorar más allá de lo obvio.

---

## Arquitectura

El proyecto es un **monorepo multi-servicio** con cuatro componentes principales que se comunican a través de redes Docker internas:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (navegador)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / WebSocket
             ┌─────────────▼─────────────┐
             │   aupa-client (React/Vite) │  :5173
             └─────────────┬─────────────┘
                           │ client-server-nw
        ┌──────────────────▼──────────────────┐
        │     aupa-server (Express + Socket.IO) │  :3000
        └──────────┬──────────────────┬────────┘
                   │  db-server-nw    │  db-server-nw
      ┌────────────▼──────┐  ┌────────▼───────────────┐
      │  aupa-db           │  │  aupa-fastapi (FastAPI) │
      │  (PostgreSQL +     │  │  ML + Recomendaciones   │
      │   PostGIS)    :5432│  │                    :8000│
      └───────────────────┘  └─────────────────────────┘
```

| Servicio         | Rol                                    | Puerto |
| ---------------- | -------------------------------------- | ------ |
| `aupa-client`  | SPA React, interfaz de usuario         | 5173   |
| `aupa-server`  | API REST + WebSocket (Express)         | 3000   |
| `aupa-fastapi` | Motor de recomendaciones ML (FastAPI)  | 8000   |
| `aupa-db`      | Base de datos relacional + geoespacial | 5432   |
| `aupa-pgadmin` | Gestor visual de BD (solo dev)         | 8080   |

---

## Tech stack

### Frontend (`client/`)

| Tecnología      | Versión | Uso                  |
| ---------------- | -------- | -------------------- |
| React            | 19       | Framework UI         |
| TypeScript       | 5        | Tipado estático     |
| Vite             | 8        | Bundler y dev server |
| React Router DOM | 7        | Enrutado cliente     |
| Lucide React     | 1.17     | Iconografía         |

### Backend (`server/`)

| Tecnología  | Versión | Uso                 |
| ------------ | -------- | ------------------- |
| Node.js      | 22       | Runtime             |
| Express      | 5        | Framework HTTP      |
| TypeScript   | 5        | Tipado estático    |
| Sequelize    | 6        | ORM PostgreSQL      |
| JWT + bcrypt | —       | Autenticación      |
| Socket.IO    | 4.8      | WebSocket real-time |

### Servicio ML (`fastapi/`)

| Tecnología              | Versión | Uso                                   |
| ------------------------ | -------- | ------------------------------------- |
| Python                   | 3.11     | Runtime                               |
| FastAPI                  | —       | Framework HTTP                        |
| scikit-learn             | —       | Modelos ML (GradientBoosting, KMeans) |
| SQLAlchemy + GeoAlchemy2 | —       | ORM con soporte geoespacial           |
| pandas / numpy           | —       | Procesamiento de datos                |
| uv                       | —       | Gestor de paquetes Python             |

### Infraestructura

| Tecnología             | Uso                          |
| ----------------------- | ---------------------------- |
| PostgreSQL 18           | Base de datos relacional     |
| PostGIS 3               | Extensión geoespacial       |
| Docker + Docker Compose | Contenedores y orquestación |

---

## Estructura del proyecto

```
aupa/
├── client/                     # Aplicación React
│   ├── src/
│   │   ├── pages/              # Vistas (Home, Login, Register, Profile…)
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── common/         # NavBar, layouts compartidos
│   │   │   ├── onboarding/     # Flujo de configuración inicial
│   │   │   ├── experiences/    # Tarjetas de experiencias
│   │   │   ├── nearby/         # Lugares cercanos
│   │   │   ├── localpartner/   # Área de socios locales
│   │   │   └── ui/             # Elementos UI base
│   │   ├── services/
│   │   │   ├── API/            # Factorías de servicios por recurso
│   │   │   └── http/           # Cliente HTTP configurado
│   │   ├── context/            # AuthContext (React Context)
│   │   ├── hooks/              # Custom hooks
│   │   ├── i18n/               # Traducciones ES / EU / EN
│   │   ├── routes/             # Definición de rutas
│   │   └── assets/styles/      # CSS global y variables
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # API Express
│   ├── src/
│   │   ├── index.ts            # Entry point (Express + Socket.IO)
│   │   ├── routes/             # Enrutadores por recurso
│   │   ├── controllers/        # Lógica de cada endpoint
│   │   ├── models/             # Modelos Sequelize
│   │   ├── middlewares/        # Auth, validación…
│   │   ├── dtos/               # Data Transfer Objects
│   │   ├── enums/              # Roles, estados, tipos
│   │   └── config/
│   │       ├── db.ts           # Conexión y sync con PostgreSQL
│   │       └── seed.ts         # Datos iniciales de prueba
│   └── package.json
│
├── fastapi/                    # Servicio ML y recomendaciones
│   ├── src/
│   │   ├── api/
│   │   │   ├── main.py         # App FastAPI y routers
│   │   │   ├── schemas/        # Modelos Pydantic
│   │   │   └── service/        # Lógica de recomendación
│   │   ├── db/
│   │   │   ├── db.py           # Sesión SQLAlchemy
│   │   │   └── models.py       # Modelo Lugar (PostGIS)
│   │   ├── inference/
│   │   │   └── inference.py    # Predicciones ML
│   │   └── etl/                # Pipeline ETL (Open Data Euskadi)
│   │       ├── pipeline.py
│   │       ├── extract.py
│   │       ├── transform.py
│   │       └── load.py
│   ├── model/                  # Modelos entrenados (.pkl)
│   ├── notebooks/              # Notebooks de entrenamiento
│   ├── Dockerfile
│   └── pyproject.toml
│
├── db/
│   ├── Dockerfile              # PostgreSQL 18 + PostGIS
│   └── init-postgis.sh         # Inicialización de la extensión
│
├── docker-compose.yml
├── docker-compose.override.yml # Añade pgAdmin para desarrollo
└── .env                        # Variables de entorno
```

---

## Requisitos previos

- **Docker** 24+ y **Docker Compose** v2
- **Node.js** 22+ *(solo para desarrollo local sin Docker)*
- **Python** 3.11+ y **uv** *(solo para desarrollo local sin Docker)*

---

## Instalación y puesta en marcha

### Con Docker (recomendado)

```bash
# 1. Clonar el repositorio
Repo Main (docker):
git clone https://github.com/r3dc0m/aupa.git
cd aupa

# 2. Dentro de aupa, clonar los repositorios
Repo Data:
https://github.com/ianu717/iceberg

Repo Backend:
https://github.com/ane1212/aupa-backend

Repo Frontend:
https://github.com/ane1212/aupa-frontend 

# 3. Crear el archivo de entorno
cp .env.example .env
# Editar .env con los valores apropiados

# 4. Levantar todos los servicios
docker compose up -d

# 5. Ver los logs en tiempo real (opcional)
docker compose logs -f
```

| Servicio      | URL                   |
| ------------- | --------------------- |
| Frontend      | http://localhost:5173 |
| API REST      | http://localhost:3000 |
| FastAPI / ML  | http://localhost:8000 |
| pgAdmin (dev) | http://localhost:8080 |

Para detener todos los servicios:

```bash
docker compose down
```

---

### Desarrollo local (sin Docker)

**Frontend:**

```bash
cd client
npm install
npm run dev        # http://localhost:5173
```

**Backend:**

```bash
cd server
npm install
npm run dev        # http://localhost:3000 (hot-reload con nodemon)
```

**FastAPI:**

```bash
cd fastapi
uv sync
uv run uvicorn src.api.main:api --reload --port 8000
```

**Base de datos:** requiere una instancia de PostgreSQL con la extensión PostGIS activa. Se puede levantar solo el contenedor de base de datos con:

```bash
docker compose up -d aupa-db
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto basándose en la siguiente plantilla:

```env
# ── Servidor Express ──────────────────────────────────────────
APP_HOST=aupa
APP_PORT=3000

# ── PostgreSQL ────────────────────────────────────────────────
POSTGRES_HOST=aupa-db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu_password_seguro
POSTGRES_DB=aupa-db

# ── JWT ───────────────────────────────────────────────────────
JWT_SECRET=tu_secreto_jwt_largo_y_aleatorio

# ── FastAPI ───────────────────────────────────────────────────
FASTAPI_PORT=8000
PYTHONPATH=/app

# ── Frontend (Vite) ───────────────────────────────────────────
FRONT_PORT=5173
VITE_API_URL=http://aupa-server:3000

# ── Seeding (datos de prueba) ─────────────────────────────────
ADMIN_USERNAME=admin.euskadi
ADMIN_EMAIL=admin@euskadi-events.test
ADMIN_PASSWORD=tu_password_admin

USER_1_NAME=Ane Mendia
USER_1_EMAIL=ane.mendia@example.com
USER_1_PASSWORD=Ane12345!
# USER_2, USER_3, USER_4 — misma estructura
```

---

## API Reference

Base URL: `http://localhost:3000`

### Autenticación

| Método  | Ruta                   | Descripción              |
| -------- | ---------------------- | ------------------------- |
| `POST` | `/api/auth/register` | Registro de nuevo usuario |
| `POST` | `/api/auth/login`    | Login, devuelve JWT       |

### Usuarios

| Método   | Ruta              | Descripción      |
| --------- | ----------------- | ----------------- |
| `GET`   | `/api/user`     | Listar usuarios   |
| `PATCH` | `/api/user/:id` | Actualizar perfil |

### Lugares locales

| Método   | Ruta               | Descripción       |
| --------- | ------------------ | ------------------ |
| `GET`   | `/api/local`     | Listar lugares     |
| `POST`  | `/api/local`     | Registrar un lugar |
| `PATCH` | `/api/local/:id` | Actualizar lugar   |

### Favoritos

| Método    | Ruta                   | Descripción                      |
| ---------- | ---------------------- | --------------------------------- |
| `GET`    | `/api/favorites`     | Favoritos del usuario autenticado |
| `POST`   | `/api/favorites`     | Añadir a favoritos               |
| `DELETE` | `/api/favorites/:id` | Eliminar de favoritos             |

### Preferencias

| Método    | Ruta                | Descripción             |
| ---------- | ------------------- | ------------------------ |
| `GET`    | `/api/preference` | Preferencias del usuario |
| `POST`   | `/api/preference` | Añadir preferencia      |
| `DELETE` | `/api/preference` | Eliminar preferencia     |

### Eventos

| Método    | Ruta               | Descripción      |
| ---------- | ------------------ | ----------------- |
| `GET`    | `/api/event`     | Listar eventos    |
| `POST`   | `/api/event`     | Crear evento      |
| `GET`    | `/api/event/:id` | Detalle de evento |
| `PATCH`  | `/api/event/:id` | Actualizar evento |
| `DELETE` | `/api/event/:id` | Eliminar evento   |

### Comentarios

| Método    | Ruta                 | Descripción        |
| ---------- | -------------------- | ------------------- |
| `GET`    | `/api/comment`     | Listar comentarios  |
| `POST`   | `/api/comment`     | Crear comentario    |
| `DELETE` | `/api/comment/:id` | Eliminar comentario |

### Itinerarios

| Método    | Ruta                   | Descripción            |
| ---------- | ---------------------- | ----------------------- |
| `GET`    | `/api/itinerary`     | Itinerarios del usuario |
| `POST`   | `/api/itinerary`     | Crear itinerario        |
| `PATCH`  | `/api/itinerary/:id` | Actualizar itinerario   |
| `DELETE` | `/api/itinerary/:id` | Eliminar itinerario     |

### Notificaciones

| Método   | Ruta                      | Descripción               |
| --------- | ------------------------- | -------------------------- |
| `GET`   | `/api/notification`     | Notificaciones del usuario |
| `PATCH` | `/api/notification/:id` | Marcar como leída         |

### Incidencias

| Método  | Ruta              | Descripción        |
| -------- | ----------------- | ------------------- |
| `POST` | `/api/incident` | Reportar incidencia |
| `GET`  | `/api/incident` | Listar incidencias  |

---

### FastAPI — Recomendaciones

Base URL: `http://localhost:8000/api/v1`

| Método | Ruta                          | Parámetros                                   | Descripción                                         |
| ------- | ----------------------------- | --------------------------------------------- | ---------------------------------------------------- |
| `GET` | `/recommendations`          | `categories[]`, `latitude`, `longitude` | Recomendaciones personalizadas por perfil de usuario |
| `GET` | `/recommendations/category` | `category`, `latitude`, `longitude`     | Filtrar por categoría                               |
| `GET` | `/recommendations/nearest`  | `latitude`, `longitude`, `top_n` (1-24) | Lugares más cercanos                                |
| `GET` | `/health`                   | —                                            | Estado del servicio                                  |

---

## Machine Learning

El servicio FastAPI implementa dos modelos complementarios:

### Modelo 1 — Local Score (GradientBoosting)

Puntúa la **autenticidad local** de un lugar en un rango 0–1. Está entrenado con datos de Open Data Euskadi y características propias de cada establecimiento.

| Feature                                      | Importancia |
| -------------------------------------------- | ----------- |
| Categoría                                   | 43.5%       |
| Indicador "oculto"                           | 26.4%       |
| Presencia en Google (valoraciones, reseñas) | 15%         |
| Municipio, territorio, idioma                | ~15%        |

### Modelo 2 — Clustering de usuarios (KMeans, K=3)

Agrupa a los usuarios en tres perfiles a partir de sus preferencias de categorías, duración del viaje y tipo de acompañante:

| Cluster | Nombre                    | Descripción                        |
| ------- | ------------------------- | ----------------------------------- |
| 0       | **Txoko Social**    | Gastronomía y vida nocturna        |
| 1       | **Mendi & Familia** | Naturaleza y actividades en familia |
| 2       | **Kultura**         | Interés cultural y patrimonial     |

Los modelos entrenados se encuentran en `fastapi/model/` (`.pkl`). Los notebooks de entrenamiento están en `fastapi/notebooks/`.

### Pipeline ETL

Al arrancar el servicio FastAPI se ejecuta automáticamente un pipeline que:

1. **Extrae** datos de [Open Data Euskadi](https://opendata.euskadi.eus)
2. **Transforma** y normaliza los registros
3. **Carga** los lugares en PostgreSQL con sus coordenadas geoespaciales (PostGIS)

---

## Base de datos

El esquema principal gestiona usuarios, lugares, preferencias e interacciones:

```
User ──< Preference >── Category
User ──< Favorite >── Local
User ──< Comment >── Local
User ──< Itinerary
User ──< Notification
User ──< Incident

Local ──< Event
```

**Roles de usuario:** `USER` | `ADMIN` | `LOCAL_PARTNER`

**Estados de un lugar local:** `PENDING` | `VERIFIED` | `REJECTED`

**Idiomas soportados:** `ES` (Español) | `EU` (Euskera) | `EN` (Inglés)

La tabla `Lugar` (gestionada por FastAPI/PostGIS) almacena los lugares procedentes del dataset público con geometría espacial (`GEOGRAPHY POINT, SRID 4326`) para consultas por proximidad.

---

## Funcionalidades principales

- **Onboarding en 4 pasos** — el usuario selecciona idioma, categorías de interés, duración del viaje y tipo de acompañante para construir su perfil
- **Recomendaciones personalizadas** — combinación de clustering de preferencias y puntuación de autenticidad local
- **Lugares cercanos** — búsqueda geoespacial basada en la ubicación actual del dispositivo
- **Experiencias** — sección curada con actividades y eventos locales
- **Guardados** — lista de favoritos persistente por usuario
- **Área de socios locales** — portal para que negocios locales gestionen su ficha y eventos
- **Notificaciones en tiempo real** — mediante WebSocket (Socket.IO)
- **Multiidioma** — interfaz en español, euskera e inglés
- **Panel de administración** — gestión de usuarios, lugares, categorías y eventos

---

*Proyecto desarrollado por el equipo Full Stack de Aupa!.*
