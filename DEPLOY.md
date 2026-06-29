# Despliegue en Wiros (hosting compartido)

Este proyecto fue reestructurado para **PHP + MySQL + React estático**.

## Estructura en `public_html`

```
public_html/
├── .htaccess          ← copiar desde deploy/.htaccess
├── index.html         ← build de frontend (carpeta dist/)
├── assets/            ← JS/CSS de Vite
├── favicon.png
├── img/productos/     ← imágenes subidas (permisos 755/775)
└── api/
    ├── index.php
    ├── config.php     ← credenciales MySQL (no subir a Git)
    ├── .htaccess
    └── lib/
```

## Pasos

### 1. Base de datos MySQL (phpMyAdmin en Wiros)

1. Crear base de datos y usuario MySQL
2. Importar `database/schema.sql`
3. Copiar `api/config.example.php` → `api/config.php` y completar credenciales
4. Ejecutar seed (localmente con acceso a la BD remota, o subir `database/seed.php` temporalmente):
   ```bash
   php database/seed.php
   ```

### 2. Build del frontend (en tu PC)

```bash
cd frontend
npm install
npm run build
```

Genera la carpeta `dist/` en la raíz del proyecto.

### 3. Subir por FTP a `public_html`

| Origen | Destino |
|--------|---------|
| `dist/*` | `public_html/` |
| `api/` | `public_html/api/` |
| `deploy/.htaccess` | `public_html/.htaccess` |

### 4. Permisos

- `public_html/img/productos/` → escribible (775)
- `public_html/api/config.php` → 640

### 5. Probar

- Sitio: `https://tu-dominio.com`
- Admin: `https://tu-dominio.com/admin/login`
- Usuarios seed: `admin` / `admin123` (cambiar en producción)

## Desarrollo local

Terminal 1 — API PHP:
```bash
cd api
cp config.example.php config.php
# editar config.php con MySQL local
php -S 127.0.0.1:8081 index.php
```

Terminal 2 — Frontend:
```bash
cd frontend
npm install
npm run dev
```

Abrí http://localhost:5173 (Vite proxyea `/api` a `127.0.0.1:8081`).

> **Nota:** Si tenés Jenkins u otro servicio en el puerto 8080, la API PHP debe usar **8081** (ver arriba).

## Notas

- El código Next.js anterior queda en `src/` como referencia legacy.
- La app activa está en `frontend/` + `api/`.
- Cambiá todas las contraseñas del seed antes de producción.
