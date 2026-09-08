/**
 * PRISMANEW - GESTIÓN DEL CARRITO DE COMPRAS & CHECKOUT DIRECTO POR WHATSAPP
 * Número Oficial WhatsApp: +57 304 364 6613 (573043646613)
 */

const WHATSAPP_PHONE = "573043646613";
const CART_STORAGE_KEY = "prismanew_cart_items_v1";

class ShoppingCart {
  constructor() {
    this.items = this.loadCart();
    this.initListeners();
    this.updateCartBadges();
  }

  loadCart() {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Error al cargar carrito:", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
      this.updateCartBadges();
      this.renderDrawer();
    } catch (e) {
      console.error("Error al guardar carrito:", e);
    }
  }

  addItem(productId, size, quantity = 1) {
    const product = PRISMANEW_PRODUCTS.find(p => p.id === productId);
    if (!product) return false;

    const existingIndex = this.items.findIndex(item => item.id === productId && item.size === size);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        category: product.categoryName,
        price: product.price,
        image: product.image,
        size: size || (product.sizes ? product.sizes[0] : "Única"),
        quantity: quantity,
        sku: product.sku
      });
    }

    this.saveCart();
    this.showToast(`"${product.name}" agregado al carrito.`);
    return true;
  }

  removeItem(index) {
    if (index >= 0 && index < this.items.length) {
      const removed = this.items.splice(index, 1);
      this.saveCart();
      if (removed[0]) {
        this.showToast(`Producto eliminado del carrito.`);
      }
    }
  }

  updateQuantity(index, delta) {
    if (index >= 0 && index < this.items.length) {
      this.items[index].quantity += delta;
      if (this.items[index].quantity <= 0) {
        this.removeItem(index);
      } else {
        this.saveCart();
      }
    }
  }

  getTotalCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  updateCartBadges() {
    const count = this.getTotalCount();
    document.querySelectorAll(".cart-badge").forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? "flex" : "none";
    });
  }

  generateWhatsAppOrderUrl() {
    if (this.items.length === 0) return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hola Prismanew, deseo recibir asesoría sobre sus prendas de moda y estilo.")}`;

    let msg = `🛍️ *NUEVO PEDIDO - PRISMANEW (www.prismanew.space)*\n\n`;
    msg += `Hola, deseo realizar la compra de los siguientes artículos:\n\n`;

    this.items.forEach((item, i) => {
      msg += `*${i + 1}. ${item.name}*\n`;
      msg += `   • Talla: ${item.size}\n`;
      msg += `   • Cantidad: ${item.quantity}\n`;
      msg += `   • Subtotal: ${formatCOP(item.price * item.quantity)}\n\n`;
    });

    msg += `------------------------------------\n`;
    msg += `💰 *TOTAL PEDIDO:* ${formatCOP(this.getSubtotal())}\n`;
    msg += `📍 *Despacho desde:* Bucaramanga, Santander\n\n`;
    msg += `Por favor indíquenme los pasos para la confirmación del pago y la información de envío. ¡Muchas gracias!`;

    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
  }

  renderDrawer() {
    const container = document.getElementById("cartDrawerBody");
    const subtotalEl = document.getElementById("cartSubtotalVal");
    const checkoutBtn = document.getElementById("cartCheckoutBtn");

    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h4 style="font-size:1.1rem; margin-bottom:0.5rem; color:var(--dark);">Tu carrito está vacío</h4>
          <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1.5rem;">Descubre nuestra colección de moda y añade tus prendas favoritas.</p>
          <a href="tienda.html" class="btn btn-primary btn-sm">Ir a la Tienda</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = formatCOP(0);
      if (checkoutBtn) {
        checkoutBtn.setAttribute("href", `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Hola Prismanew, deseo conocer su catálogo de moda.")}`);
        checkoutBtn.classList.add("disabled");
        checkoutBtn.style.opacity = "0.6";
        checkoutBtn.style.pointerEvents = "none";
      }
      return;
    }

    let html = `<div class="cart-items-list">`;
    this.items.forEach((item, index) => {
      html += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-info">
            <h5>${item.name}</h5>
            <div class="cart-item-variant">Talla: <strong>${item.size}</strong> | Ref: ${item.sku || 'PN'}</div>
            <div class="cart-item-price">${formatCOP(item.price)}</div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="window.prismanewCart.updateQuantity(${index}, -1)" title="Reducir">–</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="window.prismanewCart.updateQuantity(${index}, 1)" title="Aumentar">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="window.prismanewCart.removeItem(${index})" title="Eliminar producto">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;
    if (subtotalEl) subtotalEl.textContent = formatCOP(this.getSubtotal());
    if (checkoutBtn) {
      checkoutBtn.setAttribute("href", this.generateWhatsAppOrderUrl());
      checkoutBtn.classList.remove("disabled");
      checkoutBtn.style.opacity = "1";
      checkoutBtn.style.pointerEvents = "auto";
    }
  }

  showToast(message) {
    let toast = document.getElementById("toastNotification");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toastNotification";
      toast.className = "toast-notification";
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <svg class="toast-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toast.classList.add("active");
    setTimeout(() => {
      toast.classList.remove("active");
    }, 3000);
  }

  initListeners() {
    // Abrir/Cerrar Carrito Drawer
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest("#openCartBtn, .btn-open-cart");
      if (openBtn) {
        e.preventDefault();
        this.openDrawer();
      }

      const closeBtn = e.target.closest("#closeCartBtn, .cart-drawer-backdrop");
      if (closeBtn) {
        e.preventDefault();
        this.closeDrawer();
      }
    });
  }

  openDrawer() {
    this.renderDrawer();
    const drawer = document.getElementById("cartDrawer");
    const backdrop = document.getElementById("cartBackdrop");
    if (drawer) drawer.classList.add("active");
    if (backdrop) backdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  closeDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const backdrop = document.getElementById("cartBackdrop");
    if (drawer) drawer.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Inicializar globalmente
window.prismanewCart = new ShoppingCart();
