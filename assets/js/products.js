/**
 * PRISMANEW - MODA & ESTILO
 * Catálogo Oficial de Productos
 * Moneda: COP (Pesos Colombianos)
 */

const PRISMANEW_PRODUCTS = [
  {
    id: "PN-01",
    name: "Vestido Floral Cruzado Aurora",
    category: "vestidos",
    categoryName: "Vestidos",
    price: 139000,
    formattedPrice: "$139.000 COP",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80",
    badge: "Destacado",
    description: "Vestido midi con estampado floral delicado sobre fondo rosa empolvado. Diseño cruzado envolvente con escote en V y falda con vuelo fluido. Confeccionado en tejido fresco y suave al tacto.",
    sizes: ["S", "M", "L", "XL"],
    sku: "PN-VES-001",
    isFeatured: true
  },
  {
    id: "PN-02",
    name: "Chaqueta Denim Clásica Vintage",
    category: "chaquetas",
    categoryName: "Chaquetas & Abrigos",
    price: 159000,
    formattedPrice: "$159.000 COP",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=700&q=80",
    badge: "Básico Imprescindible",
    description: "Chaqueta en denim 100% algodón colombiano con acabado lavado artesanal, botones metálicos frontales y bolsillos funcionales en pecho. Un básico versátil y atemporal.",
    sizes: ["S", "M", "L"],
    sku: "PN-CHQ-002",
    isFeatured: true
  },
  {
    id: "PN-03",
    name: "Blazer Ejecutivo Estructurado",
    category: "chaquetas",
    categoryName: "Chaquetas & Abrigos",
    price: 179000,
    formattedPrice: "$179.000 COP",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80",
    badge: "Elegancia",
    description: "Blazer sastre con forro interior suave, solapa en pico y corte ligeramente entallado. Ideal para entornos de oficina, reuniones o para complementar un look casual moderno.",
    sizes: ["S", "M", "L", "XL"],
    sku: "PN-BLZ-003",
    isFeatured: true
  },
  {
    id: "PN-04",
    name: "Suéter Tejido Suave Arena",
    category: "tejidos",
    categoryName: "Tejidos & Suéteres",
    price: 119000,
    formattedPrice: "$119.000 COP",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=700&q=80",
    badge: "Nueva Temporada",
    description: "Suéter de punto trenzado confeccionado en hilaza suave con textura acanalada en cuello, puños y pretina. Diseño abrigado y ligero en tono neutro arena.",
    sizes: ["S", "M", "L"],
    sku: "PN-SUE-004",
    isFeatured: true
  },
  {
    id: "PN-05",
    name: "Blusa Camisera Lino Silvestre",
    category: "blusas",
    categoryName: "Blusas & Tops",
    price: 95000,
    formattedPrice: "$95.000 COP",
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=700&q=80",
    badge: "Tendencia",
    description: "Blusa en mezcla de lino natural y algodón con cuello camisero clásico, botonadura frontal oculta y mangas con opción recogible. Máxima frescura y elegancia.",
    sizes: ["S", "M", "L", "XL"],
    sku: "PN-BLU-005",
    isFeatured: false
  },
  {
    id: "PN-06",
    name: "Pantalón Palazzo Fluido Terracota",
    category: "pantalones",
    categoryName: "Pantalones & Faldas",
    price: 125000,
    formattedPrice: "$125.000 COP",
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=700&q=80",
    badge: "Favorito",
    description: "Pantalón de bota ancha en tono terracota con pretina alta ajustable y caída suave. Estiliza la figura y brinda total comodidad durante todo el día.",
    sizes: ["S", "M", "L"],
    sku: "PN-PAN-006",
    isFeatured: false
  },
  {
    id: "PN-07",
    name: "Calzado Mocasín Cuero Casual",
    category: "accesorios",
    categoryName: "Calzado & Accesorios",
    price: 165000,
    formattedPrice: "$165.000 COP",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80",
    badge: "Cuero Genuino",
    description: "Mocasín elaborado en cuero vacuno suave color caramelo con suela de goma flexible y plantilla acolchada para máximo confort en caminatas urbanas.",
    sizes: ["36", "37", "38", "39", "40"],
    sku: "PN-CAL-007",
    isFeatured: true
  },
  {
    id: "PN-08",
    name: "Bolso Tote Canvas & Detalles Cuero",
    category: "accesorios",
    categoryName: "Calzado & Accesorios",
    price: 89000,
    formattedPrice: "$89.000 COP",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",
    badge: "Esencial",
    description: "Bolso tote espacioso confeccionado en lona canvas de alta resistencia con asas y apliques en cuero sintético reforzado. Incluye bolsillo interior con cremallera.",
    sizes: ["Única"],
    sku: "PN-ACC-008",
    isFeatured: false
  }
];

const PRISMANEW_CATEGORIES = [
  { id: "todos", name: "Todas las Categorías" },
  { id: "vestidos", name: "Vestidos" },
  { id: "chaquetas", name: "Chaquetas & Abrigos" },
  { id: "blusas", name: "Blusas & Tops" },
  { id: "tejidos", name: "Tejidos & Suéteres" },
  { id: "pantalones", name: "Pantalones & Faldas" },
  { id: "accesorios", name: "Calzado & Accesorios" }
];

// Helper para formatear precios en pesos colombianos
function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
}
