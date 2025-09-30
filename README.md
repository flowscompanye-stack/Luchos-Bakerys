
# Luchos Bakerys

Aplicación web para la gestión de pedidos de medialunas en Luchos Bakerys. Permite a los clientes realizar pedidos personalizados y seleccionar fecha/hora de entrega, integrando funciones serverless y automatización vía webhook.

## Estructura del proyecto

- `src/`: Código fuente React.
- `public/`: Archivos estáticos y manifestos.
- `netlify/functions/`: Funciones serverless (ej: `create-order.js`).
- `.env`: Variables de entorno (URLs sensibles).
- `netlify.toml`: Configuración de despliegue Netlify.

## Instalación y ejecución

1. Clona el repositorio y accede a la carpeta del proyecto.
2. Instala dependencias:
	```bash
	npm install
	```
3. Configura el archivo `.env` con la URL de tu webhook n8n:
	```env
	REACT_APP_WEBHOOK_URL=https://tu-webhook-url
	```
4. Ejecuta en modo desarrollo:
	```bash
	npm start
	```

## Despliegue en Netlify

1. Genera el build de producción:
	```bash
	npm run build
	```
2. Sube el proyecto a Netlify (puedes conectar el repo o subir manualmente la carpeta `build`).
3. Configura las funciones serverless en Netlify (`netlify/functions`).
4. Ajusta variables de entorno y CORS en producción para mayor seguridad.
5. Configura el dominio personalizado si lo deseas.

## Seguridad

- No expongas credenciales ni URLs sensibles en el frontend.
- Usa variables de entorno para webhooks y backend URLs.
- Restringe CORS en producción solo a tu dominio.
- Valida los datos recibidos en las funciones serverless.

## Pruebas y monitoreo

- Realiza pruebas en entorno de staging antes de publicar.
- Verifica el funcionamiento del webhook y la función serverless.
- Implementa monitoreo y backups si es necesario.

## Contacto y soporte

Para soporte técnico o consultas, contacta a flowscompanye-stack.
