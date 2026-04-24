# AWS Group Manizales - Landing Page

Landing page moderna y responsiva para la comunidad de AWS en Manizales.

## 📋 Descripción

Sitio web estático desarrollado para promover la comunidad de AWS Group Manizales. Incluye información sobre eventos, beneficios de unirse, y formulario de contacto.

## 🎯 Características

- **Diseño Responsivo:** Se adapta a móviles, tablets y escritorio
- **Secciones Completas:**
  - Hero Section con llamado a la acción
  - Sobre Nosotros
  - Próximos Eventos
  - Beneficios de Unirse
  - Contacto
- **Animaciones Suaves:** Transiciones y efectos de hover
- **Menú Móvil:** Navegación adaptativa
- **Formulario de Contacto:** Con validación en tiempo real
- **Iconos FontAwesome:** Integración de iconos modernos
- **Scroll Suave:** Navegación fluida entre secciones

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd aws-group-manizales
```

2. Abre el archivo `index.html` en tu navegador:
```bash
# Puedes usar un servidor local
python -m http.server 8000
# O simplemente abrir index.html
```

## 📁 Estructura del Proyecto

```
aws-group-manizales/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos CSS
├── js/
│   └── script.js          # Funcionalidad JavaScript
├── assets/
│   └── images/           # Imágenes (si las necesitas)
└── README.md              # Este archivo
```

## 🎨 Tecnologías Utilizadas

- **HTML5:** Estructura semántica
- **CSS3:** Estilos modernos con Flexbox y Grid
- **JavaScript (Vanilla):** Interactividad sin frameworks
- **FontAwesome:** Iconos vectoriales

## 📝 Personalización

### Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary-color: #ff9900;      /* Naranja AWS */
    --secondary-color: #232f3e;    /* Azul oscuro AWS */
    /* ... otras variables */
}
```

### Eventos

Actualiza los eventos en `index.html` en la sección `#eventos`:

```html
<div class="event__card">
    <div class="event__date">
        <span class="event__day">20</span>
        <span class="event__month">May</span>
    </div>
    <div class="event__info">
        <h3 class="event__title">Título del Evento</h3>
        <p class="event__description">Descripción del evento</p>
        <div class="event__meta">
            <span><i class="fas fa-clock"></i> Hora</span>
            <span><i class="fas fa-map-marker-alt"></i> Lugar</span>
        </div>
    </div>
</div>
```

### Contacto

Configura el formulario en `js/script.js` para enviar emails:

```javascript
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Agrega aquí tu lógica de envío
    // Por ejemplo: enviar a un servicio de email
});
```

## 🌐 Despliegue

### GitHub Pages

1. Ve a Settings > Pages
2. Selecciona la rama `main`
3. El sitio estará disponible en `https://<usuario>.github.io/aws-group-manizales/`

### Netlify

1. Conecta tu repositorio de GitHub
2. Configura los ajustes de build:
   - Build command: (vacío)
   - Publish directory: `/`
3. Deploy

### Vercel

1. Conecta tu repositorio de GitHub
2. Configura el proyecto
3. Deploy

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Equipo

- AWS Group Manizales

## 📧 Contacto

- Email: contacto@awsgroupmanizales.com
- Discord: [Enlace al servidor]
- Meetup: [Enlace al grupo]

---

Hecho con ❤️ por la comunidad de AWS en Manizales
