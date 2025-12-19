// ==================== CATÁLOGO DINÁMICO ====================
const productosCatalogo = [
    {
        nombre: "Vestido volados Noel",
        precio: 12500,
        imagen: "Imagenes/imagen-1.jpg",
        descripcion: "Algodón 100%. Ideal para las fiestas."
    },
    {
        nombre: "Pijama planetas invierno",
        precio: 22000,
        imagen: "Imagenes/imagen-2.jpg",
        descripcion: "Suave, 100% Algodón."
    },
    {
        nombre: "Buzo canguro",
        precio: 23000,
        imagen: "Imagenes/imagen-3.jpg",
        descripcion: "Frizado con líneas blancas. Color rosa."
    },
    {
        nombre: "Jean lady",
        precio: 18500,
        imagen: "Imagenes/imagen-4.jpg",
        descripcion: "Jean azul clásico, cómodo y resistente."
    },
    {
        nombre: "Remera super girl",
        precio: 9500,
        imagen: "Imagenes/imagen-5.jpg",
        descripcion: "Remera estampada, algodón suave."
    },
    {
        nombre: "Buzo canchero",
        precio: 21000,
        imagen: "Imagenes/imagen-6.jpg",
        descripcion: "Buzo moderno, ideal para días frescos."
    }
];

function mostrarCatalogo() {
    const contenedor = document.getElementById('apiProducts');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    productosCatalogo.forEach(prod => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <picture>
                <img src="${prod.imagen}" alt="${prod.nombre}" style="width:100%;height:auto;object-fit:cover;">
            </picture>
            <div class="card__body">
                <h3>${prod.nombre}</h3>
                <p>${prod.descripcion}</p>
                <div class="card__actions">
                    <span style="font-weight:600;color:#7c4dff;">$${prod.precio}</span>
                    <button class="btn btn--primary add-to-cart">Agregar</button>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

if (window.location.pathname.includes('Catalogo')) {
    document.addEventListener('DOMContentLoaded', mostrarCatalogo);
}
// Actualizar año del footer
document.getElementById('year').textContent = new Date().getFullYear();

// Lógica del Carrito
const cartDrawer = document.getElementById('cartDrawer');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
let cart = [];

// Abrir/Cerrar Carrito
openCartBtn.addEventListener('click', () => {
    cartDrawer.classList.add('active');
    renderCart();
});
closeCartBtn.addEventListener('click', () => cartDrawer.classList.remove('active'));

// Agregar al carrito
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price);
        // Buscar si ya existe en el carrito
        const idx = cart.findIndex(p => p.name === name);
        if (idx > -1) {
            cart[idx].cantidad += 1;
        } else {
            cart.push({ name, price, cantidad: 1 });
        }
        updateCartCount();
    });
});

function updateCartCount() {
    const totalPrendas = cart.reduce((acc, p) => acc + p.cantidad, 0);
    cartCount.textContent = totalPrendas;
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    cartItems.innerHTML = '';
    let totalDinero = 0;
    let totalPrendas = 0;
    cart.forEach((prod, idx) => {
        totalDinero += prod.price * prod.cantidad;
        totalPrendas += prod.cantidad;
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <span style="font-weight:600;">${prod.name}</span>
            <input type="number" min="1" value="${prod.cantidad}" style="width:50px;margin:0 8px;" data-idx="${idx}" class="cart-qty">
            <span>$${prod.price * prod.cantidad}</span>
            <button class="btn btn--ghost cart-remove" data-idx="${idx}" style="margin-left:8px;">🗑</button>
        `;
        cartItems.appendChild(item);
    });
    cartTotal.textContent = `$${totalDinero} (${totalPrendas} prendas)`;

    // Listeners para cantidades
    cartItems.querySelectorAll('.cart-qty').forEach(input => {
        input.addEventListener('change', function() {
            const idx = parseInt(this.dataset.idx);
            let val = parseInt(this.value);
            if (isNaN(val) || val < 1) val = 1;
            cart[idx].cantidad = val;
            updateCartCount();
            renderCart();
        });
    });
    // Listeners para borrar producto
    cartItems.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            cart.splice(idx, 1);
            updateCartCount();
            renderCart();
        });
    });
}

// Vaciar carrito
document.getElementById('clearCart').addEventListener('click', function() {
    cart = [];
    updateCartCount();
    renderCart();
});

// Formulario Formspree
const form = document.getElementById('formTienda');
const formStatus = document.getElementById('form-status');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // reset status
    formStatus.textContent = '';
    formStatus.className = 'form-status';
    submitBtn.disabled = true;

    const data = new FormData(form);
    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            formStatus.textContent = '¡Gracias! Tu mensaje fue enviado correctamente.';
            formStatus.classList.add('success');
            form.reset();
        } else {
            // intentar leer mensaje del servidor
            let msg = 'Ocurrió un error al enviar. Intenta nuevamente.';
            try { const j = await response.json(); if (j?.error) msg = j.error; } catch (e) {}
            formStatus.textContent = msg;
            formStatus.classList.add('error');
        }
    } catch (err) {
        formStatus.textContent = 'Error de conexión. Intenta nuevamente más tarde.';
        formStatus.classList.add('error');
    } finally {
        submitBtn.disabled = false;
    }
});

// limpiar mensajes cuando el usuario edita
form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
    });
});

/* ==================== LIGHTBOX ==================== */
(function () {
    const lightbox = document.getElementById('lightbox');
    const lbBackdrop = lightbox.querySelector('.lightbox__backdrop');
    const lbPanel = lightbox.querySelector('.lightbox__panel');
    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbSource = lightbox.querySelector('.lightbox__source');
    const lbCaption = lightbox.querySelector('.lightbox__caption');
    const btnClose = lightbox.querySelector('.lightbox__close');
    const btnPrev = lightbox.querySelector('.lightbox__prev');
    const btnNext = lightbox.querySelector('.lightbox__next');

    const links = Array.from(document.querySelectorAll('.gallery a'));
    const items = links.map(a => ({
        href: a.getAttribute('href'),
        alt: a.querySelector('img')?.getAttribute('alt') || ''
    }));

    let current = -1;

    function openAt(i) {
        current = i;
        const item = items[current];
        const webp = item.href.replace(/\.jpg$/i, '.webp');
        lbSource.srcset = webp;
        lbImg.src = item.href;
        lbImg.alt = item.alt;
        lbCaption.textContent = item.alt;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        btnClose.focus();
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        current = -1;
        document.body.style.overflow = '';
    }

    function showPrev() { if (current > 0) openAt(current - 1); }
    function showNext() { if (current < items.length - 1) openAt(current + 1); }

    links.forEach((a, idx) => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            openAt(idx);
        });
    });

    btnClose.addEventListener('click', close);
    lbBackdrop.addEventListener('click', close);
    btnPrev.addEventListener('click', showPrev);
    btnNext.addEventListener('click', showNext);

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }
    });
})();
