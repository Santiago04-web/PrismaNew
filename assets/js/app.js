/**
 * PRISMANEW - INTERACTIVIDAD PRINCIPAL, MODAL DE PRODUCTO Y FILTROS
 * Razón Social: Prismanew | NIT: 804000673-3
 * Bucaramanga, Santander, Colombia
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initModalListeners();
  initHomeProducts();
  initShopCatalog();
  initContactForm();
  initLegalScrollSpy();
});

/* ==========================================================================
   1. MENÚ MÓVIL (DRAWER)
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById("mobileMenuToggle");
  const navMenu = document.getElementById("navMenu");

  if (!toggleBtn || !navMenu) return;

  let backdrop = document.querySelector(".nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);
  }

  const closeMenu = () => {
    navMenu.classList.remove("active");
    backdrop.classList.remove("active");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    navMenu.classList.add("active");
    backdrop.classList.add("active");
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  toggleBtn.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener("click", closeMenu);

  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}

/* ==========================================================================
   2. MODAL DE VISTA RÁPIDA (QUICK VIEW)
   ========================================================================== */
let currentModalProduct = null;
let selectedModalSize = null;

function initModalListeners() {
  const backdrop = document.getElementById("quickViewModal");
  const closeBtn = document.getElementById("closeModalBtn");

  if (closeBtn && backdrop) {
    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  // Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function openQuickView(productId) {
  const product = PRISMANEW_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentModalProduct = product;
  selectedModalSize = product.sizes ? product.sizes[0] : "Única";

  const modal = document.getElementById("quickViewModal");
  const imgEl = document.getElementById("modalImg");
  const catEl = document.getElementById("modalCategory");
  const titleEl = document.getElementById("modalTitle");
  const priceEl = document.getElementById("modalPrice");
  const descEl = document.getElementById("modalDesc");
  const sizesContainer = document.getElementById("modalSizes");
  const addCartBtn = document.getElementById("modalAddCartBtn");
  const buyWaBtn = document.getElementById("modalBuyWaBtn");

  if (imgEl) imgEl.src = product.image;
  if (imgEl) imgEl.alt = product.name;
  if (catEl) catEl.textContent = product.categoryName;
  if (titleEl) titleEl.textContent = product.name;
  if (priceEl) priceEl.textContent = formatCOP(product.price);
  if (descEl) descEl.textContent = product.description;

  // Render tallas
  if (sizesContainer) {
    sizesContainer.innerHTML = "";
    if (product.sizes && product.sizes.length > 0) {
      product.sizes.forEach((size, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `size-btn ${idx === 0 ? 'selected' : ''}`;
        btn.textContent = size;
        btn.addEventListener("click", () => {
          sizesContainer.querySelectorAll(".size-btn").forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          selectedModalSize = size;
          updateModalWaLink();
        });
        sizesContainer.appendChild(btn);
      });
    }
  }

  // Asignar listeners a botones del modal
  if (addCartBtn) {
    addCartBtn.onclick = () => {
      window.prismanewCart.addItem(product.id, selectedModalSize, 1);
      closeModal();
      window.prismanewCart.openDrawer();
    };
  }

  updateModalWaLink();

  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function updateModalWaLink() {
  const buyWaBtn = document.getElementById("modalBuyWaBtn");
  if (!buyWaBtn || !currentModalProduct) return;

  const msg = `Hola Prismanew, me interesa comprar:\n\n• *${currentModalProduct.name}*\n• Talla: *${selectedModalSize}*\n• Precio: *${formatCOP(currentModalProduct.price)}*\n• Ref: ${currentModalProduct.sku}\n\n¿Tienen disponibilidad para envío desde Bucaramanga?`;
  buyWaBtn.href = `https://wa.me/573043646613?text=${encodeURIComponent(msg)}`;
}

function closeModal() {
  const modal = document.getElementById("quickViewModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

/* ==========================================================================
   3. RENDERIZADO DE PRODUCTOS EN HOME
   ========================================================================== */
function initHomeProducts() {
  const container = document.getElementById("featuredProductsGrid");
  if (!container) return;

  const featured = PRISMANEW_PRODUCTS.filter(p => p.isFeatured).slice(0, 4);
  renderProductCards(featured, container);
}

/* ==========================================================================
   4. CATÁLOGO EN PÁGINA TIENDA CON FILTROS Y BÚSQUEDA
   ========================================================================== */
let activeCategory = "todos";
let currentSearchTerm = "";
let currentSortOrder = "default";

function initShopCatalog() {
  const container = document.getElementById("shopProductsGrid");
  if (!container) return;

  renderCategoryFilters();
  applyFilters();

  const searchInput = document.getElementById("shopSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchTerm = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  const sortSelect = document.getElementById("shopSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSortOrder = e.target.value;
      applyFilters();
    });
  }
}

function renderCategoryFilters() {
  const listContainer = document.getElementById("categoryFilterList");
  const chipsContainer = document.getElementById("categoryChipsBar");

  const categories = PRISMANEW_CATEGORIES.map(cat => {
    const count = cat.id === "todos" 
      ? PRISMANEW_PRODUCTS.length 
      : PRISMANEW_PRODUCTS.filter(p => p.category === cat.id).length;
    return { ...cat, count };
  });

  // 1. Sidebar desktop
  if (listContainer) {
    let html = "";
    categories.forEach(cat => {
      html += `
        <li>
          <button class="category-filter-btn ${cat.id === activeCategory ? 'active' : ''}" data-cat="${cat.id}">
            <span>${cat.name}</span>
            <span class="category-count">${cat.count}</span>
          </button>
        </li>
      `;
    });
    listContainer.innerHTML = html;

    listContainer.querySelectorAll(".category-filter-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setCategory(btn.dataset.cat);
      });
    });
  }

  // 2. Chips deslizables (móvil y tablet)
  if (chipsContainer) {
    let chipsHtml = "";
    categories.forEach(cat => {
      chipsHtml += `
        <button class="category-chip-btn ${cat.id === activeCategory ? 'active' : ''}" data-cat="${cat.id}">
          <span>${cat.name}</span>
          <span class="chip-count">${cat.count}</span>
        </button>
      `;
    });
    chipsContainer.innerHTML = chipsHtml;

    chipsContainer.querySelectorAll(".category-chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setCategory(btn.dataset.cat);
      });
    });
  }
}

function setCategory(catId) {
  activeCategory = catId;

  // Sincronizar clases activas
  document.querySelectorAll(".category-filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.cat === catId);
  });
  document.querySelectorAll(".category-chip-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.cat === catId);
  });

  applyFilters();
}

function applyFilters() {
  const container = document.getElementById("shopProductsGrid");
  const countEl = document.getElementById("resultsCount");
  if (!container) return;

  let filtered = PRISMANEW_PRODUCTS.filter(product => {
    const matchesCat = activeCategory === "todos" || product.category === activeCategory;
    const matchesSearch = !currentSearchTerm || 
      product.name.toLowerCase().includes(currentSearchTerm) || 
      product.description.toLowerCase().includes(currentSearchTerm) ||
      product.categoryName.toLowerCase().includes(currentSearchTerm);
    return matchesCat && matchesSearch;
  });

  // Ordenamiento
  if (currentSortOrder === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSortOrder === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSortOrder === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (countEl) {
    countEl.textContent = `${filtered.length} prenda${filtered.length === 1 ? '' : 's'} encontrada${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-catalog">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3>No se encontraron prendas</h3>
        <p style="color:var(--text-muted); margin-top:0.5rem;">Intenta con otros términos de búsqueda o selecciona otra categoría.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top:1.25rem;" onclick="resetShopFilters()">Ver todas las prendas</button>
      </div>
    `;
  } else {
    renderProductCards(filtered, container);
  }
}

function resetShopFilters() {
  activeCategory = "todos";
  currentSearchTerm = "";
  const searchInput = document.getElementById("shopSearchInput");
  if (searchInput) searchInput.value = "";
  renderCategoryFilters();
  applyFilters();
}

function renderProductCards(products, container) {
  let html = "";
  products.forEach(p => {
    const waMsg = encodeURIComponent(`Hola Prismanew, me interesa información y disponibilidad de la prenda: ${p.name} (${formatCOP(p.price)}).`);
    const defaultSize = (p.sizes && p.sizes.length > 0) ? p.sizes[0] : "Única";
    html += `
      <article class="product-card">
        <div class="product-thumb" onclick="openQuickView('${p.id}')" role="button" tabindex="0" title="Ver detalles de ${p.name}" style="cursor:pointer;">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${p.badge ? `<span class="product-badge-tag">${p.badge}</span>` : ''}
          <div class="product-quick-actions" onclick="event.stopPropagation()">
            <button type="button" class="btn btn-secondary btn-quick-view" onclick="openQuickView('${p.id}')">
              Vista Rápida
            </button>
            <button type="button" class="btn btn-primary btn-add-cart" onclick="window.prismanewCart.addItem('${p.id}', '${defaultSize}', 1)">
              + Añadir
            </button>
          </div>
        </div>
        <div class="product-body">
          <span class="product-cat">${p.categoryName}</span>
          <h3 class="product-title">
            <a href="javascript:void(0)" onclick="openQuickView('${p.id}')">${p.name}</a>
          </h3>
          <div class="product-price-row">
            <span class="product-price">${formatCOP(p.price)}</span>
            <a href="https://wa.me/573043646613?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="product-btn-wa" title="Consultar por WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </article>
    `;
  });
  container.innerHTML = html;
}

/* ==========================================================================
   5. FORMULARIO DE CONTACTO
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !message) {
      alert("Por favor diligencia todos los campos obligatorios.");
      return;
    }

    const waMsg = `📩 *MENSAJE DE CONTACTO WEB - PRISMANEW*\n\n` +
      `• *Nombre:* ${name}\n` +
      `• *Correo:* ${email}\n` +
      `• *Teléfono:* ${phone || 'No especificado'}\n` +
      `• *Asunto:* ${subject || 'Consulta General'}\n` +
      `• *Mensaje:* ${message}\n\n` +
      `Enviado desde www.prismanew.space`;

    // Abrir WhatsApp con el mensaje estructurado
    window.open(`https://wa.me/573043646613?text=${encodeURIComponent(waMsg)}`, '_blank');
    window.prismanewCart.showToast("Redirigiendo a WhatsApp con tu mensaje...");
    form.reset();
  });
}

/* ==========================================================================
   6. SCROLLSPY PARA PÁGINAS LEGALES
   ========================================================================== */
function initLegalScrollSpy() {
  const links = document.querySelectorAll(".legal-nav-link");
  const sections = document.querySelectorAll(".legal-section");
  if (links.length === 0 || sections.length === 0) return;

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    links.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}
