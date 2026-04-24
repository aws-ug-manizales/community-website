// Toggle menú móvil
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Cerrar menú móvil al hacer clic en un enlace
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.25)';
    } else {
        header.style.boxShadow = '0 2px 24px rgba(124, 58, 237, 0.18)';
    }

    lastScroll = currentScroll;
});

// ─── Meetup Events ────────────────────────────────────────────────────────────
const MEETUP_GROUP = 'aws-user-group-manizales';
const MEETUP_BASE  = `https://www.meetup.com/${MEETUP_GROUP}/`;
const MEETUP_ICAL  = `https://www.meetup.com/${MEETUP_GROUP}/events/ical/`;
const HIDE_EVENTS_SECTION_WHEN_EMPTY = true;

// Varios proxies CORS — se intentan en orden hasta que uno funcione
// cors.eu.org: Cloudflare-backed, devuelve Access-Control-Allow-Origin: *
const CORS_PROXIES = [
    (url) => `https://cors.eu.org/${url}`,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
];

const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return { day: '--', month: '---', time: '', full: new Date(0) };
    return {
        day:   d.getDate().toString().padStart(2, '0'),
        month: MONTHS_ES[d.getMonth()],
        time:  d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true }),
        full:  d
    };
}

function getXmlText(item, tag) {
    const node = item.getElementsByTagName(tag)[0];
    return node ? node.textContent.trim() : '';
}

function parseIcsDate(value) {
    // DTSTART;TZID=America/Bogota:20260423T180000 or DTSTART:20260423T230000Z
    const m = /^([0-9]{8})T([0-9]{6})(Z)?$/.exec(value || '');
    if (!m) return null;

    const year = Number(m[1].slice(0, 4));
    const month = Number(m[1].slice(4, 6));
    const day = Number(m[1].slice(6, 8));
    const hour = Number(m[2].slice(0, 2));
    const minute = Number(m[2].slice(2, 4));
    const second = Number(m[2].slice(4, 6));

    if (m[3] === 'Z') {
        return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    }

    return new Date(year, month - 1, day, hour, minute, second);
}

function unfoldIcsLines(icsText) {
    return icsText
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n[ \t]/g, '');
}

function parseIcsEvents(icsText) {
    const unfolded = unfoldIcsLines(icsText);
    const blocks = unfolded.split('BEGIN:VEVENT').slice(1);

    return blocks.map(block => {
        const eventBody = block.split('END:VEVENT')[0] || '';
        const lines = eventBody.split('\n');
        const event = {
            title: '',
            description: '',
            url: MEETUP_BASE,
            start: null
        };

        lines.forEach(line => {
            if (line.startsWith('SUMMARY:')) {
                event.title = line.slice('SUMMARY:'.length).trim();
            } else if (line.startsWith('DESCRIPTION:')) {
                event.description = line.slice('DESCRIPTION:'.length).trim();
            } else if (line.startsWith('URL')) {
                const idx = line.indexOf(':');
                if (idx !== -1) {
                    const url = line.slice(idx + 1).trim();
                    if (url.startsWith('http')) event.url = url;
                }
            } else if (line.startsWith('DTSTART')) {
                const idx = line.indexOf(':');
                if (idx !== -1) {
                    event.start = parseIcsDate(line.slice(idx + 1).trim());
                }
            }
        });

        return event;
    }).filter(evt => evt.title && evt.start instanceof Date && !isNaN(evt.start));
}

function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
}

function buildEventCard(title, link, startDate, descText) {
    const date      = formatDate(startDate);
    const desc      = stripHtml((descText || '').replace(/\\n/g, '\n').replace(/\\,/g, ','));
    const shortDesc = desc.length > 150 ? desc.slice(0, 150) + '…' : (desc || 'Evento del AWS User Group Manizales.');
    const isPast    = date.full < new Date();

    return `
        <div class="event__card${isPast ? ' event__card--past' : ''}">
            <div class="event__date">
                <span class="event__day">${date.day}</span>
                <span class="event__month">${date.month}</span>
            </div>
            <div class="event__info">
                <h3 class="event__title">
                    <a href="${link}" target="_blank" rel="noopener noreferrer">${title}</a>
                </h3>
                <p class="event__description">${shortDesc}</p>
                <div class="event__meta">
                    ${date.time ? `<span><i class="fas fa-clock"></i> ${date.time}</span>` : ''}
                    <span><i class="fab fa-meetup"></i> Meetup</span>
                </div>
                <a href="${link}" target="_blank" rel="noopener noreferrer" class="event__cta">
                    ${isPast ? 'Ver detalles' : 'Registrarse'} <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>`;
}

function hideEventsSection() {
    const section = document.getElementById('eventos');
    if (section) {
        section.classList.add('section--hidden');
    }

    const eventsNavLink = document.querySelector('.nav__link[href="#eventos"]');
    if (eventsNavLink) {
        eventsNavLink.parentElement.style.display = 'none';
    }
}

function showNoEvents(grid) {
    if (HIDE_EVENTS_SECTION_WHEN_EMPTY) {
        hideEventsSection();
        return;
    }

    grid.innerHTML = `
        <div class="events__empty">
            <div class="events__empty-icon">
                <i class="fas fa-calendar-check"></i>
            </div>
            <h3>Próximamente más eventos</h3>
            <p>En este momento no hay eventos activos en Meetup. Vuelve pronto para ver nuevas publicaciones.</p>
        </div>`;
}

function showError(grid) {
    grid.innerHTML = `
        <div class="events__empty">
            <i class="fab fa-meetup"></i>
            <h3>No se pudieron cargar los eventos</h3>
            <p>Revisa nuestra página de Meetup directamente para ver los próximos eventos.</p>
            <a href="${MEETUP_BASE}" target="_blank" rel="noopener noreferrer"
               class="btn btn--outline" style="margin-top:1.2rem">
                <i class="fab fa-meetup"></i> Ir a Meetup
            </a>
        </div>`;
}

async function fetchWithProxy(proxyFn, feedUrl) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
        const res = await fetch(proxyFn(feedUrl), { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (!text || text.trim().length < 50) throw new Error('Respuesta vacía');
        return text;
    } catch (e) {
        clearTimeout(timer);
        throw e;
    }
}

async function loadMeetupEvents() {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;

    let icsText = null;
    let lastError = null;

    // Intentar cada proxy en orden
    for (const proxyFn of CORS_PROXIES) {
        try {
            icsText = await fetchWithProxy(proxyFn, MEETUP_ICAL);
            if (icsText) break;
        } catch (e) {
            lastError = e;
        }
    }

    if (!icsText) {
        if (lastError) {
            console.warn('[Meetup] No se pudo cargar el feed iCal:', lastError.message);
        }
        showError(grid);
        return;
    }

    try {
        const now = new Date();
        const events = parseIcsEvents(icsText)
            .filter(evt => evt.start >= now)
            .sort((a, b) => a.start - b.start);

        if (events.length === 0) {
            showNoEvents(grid);
            return;
        }

        grid.innerHTML = events.slice(0, 9).map(event => {
            return buildEventCard(event.title, event.url, event.start, event.description);
        }).join('');

        grid.querySelectorAll('.event__card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            if (observer) observer.observe(el);
        });

    } catch (e) {
        console.warn('[Meetup] Error procesando iCal:', e.message);
        showError(grid);
    }
}

loadMeetupEvents();
// ──────────────────────────────────────────────────────────────────────────────

// Formulario de contacto — envía por mailto con feedback visual
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const subject = contactForm.querySelector('#subject').value;
        const message = contactForm.querySelector('#message').value.trim();

        if (!name || !email || !subject || !message) {
            showFormStatus('Por favor completa todos los campos.', 'error');
            return;
        }

        // Construir mailto
        const mailSubject = encodeURIComponent(`[AWS UG Manizales] ${subject}`);
        const mailBody = encodeURIComponent(
            `Nombre: ${name}\nEmail: ${email}\nAsunto: ${subject}\n\nMensaje:\n${message}`
        );
        const mailtoLink = `mailto:awsugmanizales@gmail.com?subject=${mailSubject}&body=${mailBody}`;

        // Abrir cliente de correo
        window.location.href = mailtoLink;

        // Feedback visual
        showFormStatus('¡Se abrió tu cliente de correo! Si no se abrió, puedes escribirnos directamente a awsugmanizales@gmail.com', 'success');
        contactForm.reset();
    });
}

function showFormStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = `form__status form__status--${type}`;
    formStatus.style.display = 'block';
    setTimeout(() => {
        formStatus.style.opacity = '0';
        setTimeout(() => {
            formStatus.style.display = 'none';
            formStatus.style.opacity = '1';
        }, 400);
    }, 6000);
}

// Animación de elementos al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animación a las cards
document.querySelectorAll('.about__card, .event__card, .benefit__item, .member__card, .project__card, .docs__category, .instagram__banner').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Active nav link on scroll
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav__link[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// Contador animado para estadísticas (si se agregan en el futuro)
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Lazy loading de imágenes
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imgObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imgObserver.observe(img);
    });
}

// Validación de formulario en tiempo real
const emailInput = document.getElementById('email');
const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');

function validateInput(input, regex) {
    return regex.test(input.value);
}

if (emailInput) {
    emailInput.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validateInput(emailInput, emailRegex) && emailInput.value !== '') {
            emailInput.style.borderColor = '#ff4444';
        } else {
            emailInput.style.borderColor = '#e0e0e0';
        }
    });
}

if (nameInput) {
    nameInput.addEventListener('input', () => {
        if (nameInput.value.length < 2 && nameInput.value !== '') {
            nameInput.style.borderColor = '#ff4444';
        } else {
            nameInput.style.borderColor = '#e0e0e0';
        }
    });
}

if (messageInput) {
    messageInput.addEventListener('input', () => {
        if (messageInput.value.length < 10 && messageInput.value !== '') {
            messageInput.style.borderColor = '#ff4444';
        } else {
            messageInput.style.borderColor = '#e0e0e0';
        }
    });
}

// Tooltip simple para iconos (opcional)
document.querySelectorAll('.benefit__icon, .about__icon').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.1)';
    });
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1)';
    });
});

console.log('AWS Group Manizales - Landing Page cargada exitosamente 🚀');
