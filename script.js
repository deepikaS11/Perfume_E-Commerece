const products = [
  {
    id: "santal-22",
    name: "Santal No. 22",
    notes: "Sandalwood · Fig · Cardamom",
    category: "woody",
    price: 118,
    tag: "Bestseller",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=900&q=85",
    alt: "Amber perfume bottle against a softly lit neutral backdrop"
  },
  {
    id: "rose-doree",
    name: "Rose Dorée",
    notes: "Rose · Pink Pepper · Musk",
    category: "floral",
    price: 126,
    tag: "New",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85",
    alt: "Elegant perfume bottle with rose-toned details"
  },
  {
    id: "the-sunday",
    name: "The Sunday",
    notes: "Neroli · Bergamot · Linen",
    category: "fresh",
    price: 108,
    tag: "",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=900&q=85",
    alt: "Minimal glass fragrance bottle in natural light"
  },
  {
    id: "amber-hour",
    name: "Amber Hour",
    notes: "Amber · Vanilla · Cedar",
    category: "woody",
    price: 132,
    tag: "",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=85",
    alt: "Warm golden perfume bottle"
  }
];

const bag = new Map();
const productGrid = document.querySelector("#product-grid");
const bagCount = document.querySelector(".bag-count");
const drawerCount = document.querySelector(".drawer-count");
const bagItems = document.querySelector(".bag-items");
const emptyBag = document.querySelector(".empty-bag");
const drawer = document.querySelector(".bag-drawer");
const backdrop = document.querySelector(".drawer-backdrop");
const toast = document.querySelector(".toast");
let toastTimer;

function renderProducts(filter = "all", search = "") {
  const query = search.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesFilter = filter === "all" || product.category === filter;
    const matchesSearch = !query || `${product.name} ${product.notes} ${product.category}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  document.querySelector(".product-total").textContent = `${String(visibleProducts.length).padStart(2, "0")} ${visibleProducts.length === 1 ? "piece" : "pieces"}`;
  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-visual">
        <img src="${product.image}" alt="${product.alt}" loading="lazy">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        <button class="quick-add" data-add="${product.id}">Add to bag — $${product.price}</button>
      </div>
      <div class="product-info">
        <div><h3>${product.name}</h3><p>${product.notes}</p></div>
        <span class="product-price">$${product.price}</span>
      </div>
    </article>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function renderBag() {
  const items = [...bag.entries()];
  const count = items.reduce((total, [, quantity]) => total + quantity, 0);
  const subtotal = items.reduce((total, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return total + product.price * quantity;
  }, 0);
  bagCount.textContent = count;
  drawerCount.textContent = `(${count})`;
  emptyBag.hidden = items.length > 0;
  bagItems.innerHTML = items.map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return `<article class="bag-item">
      <img src="${product.image}" alt="">
      <div><h3>${product.name}</h3><p>${product.notes}</p>
        <div class="quantity-control">
          <button data-quantity="${id}" data-change="-1" aria-label="Remove one ${product.name}">−</button>
          <span>${quantity}</span>
          <button data-quantity="${id}" data-change="1" aria-label="Add one ${product.name}">+</button>
        </div>
      </div>
      <span class="bag-item-price">$${product.price * quantity}</span>
    </article>`;
  }).join("");
  document.querySelector(".subtotal strong").textContent = `$${subtotal}`;
  document.querySelector(".checkout-button").disabled = count === 0;
}

function setDrawerOpen(open) {
  drawer.classList.toggle("open", open);
  backdrop.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("drawer-open", open);
}

document.querySelector(".filter-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  document.querySelector(".filter-button.active").classList.remove("active");
  button.classList.add("active");
  renderProducts(button.dataset.filter, document.querySelector("#site-search").value);
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.add);
  bag.set(product.id, (bag.get(product.id) || 0) + 1);
  renderBag();
  showToast(`${product.name} added to your bag`);
});

bagItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;
  const id = button.dataset.quantity;
  const nextQuantity = (bag.get(id) || 0) + Number(button.dataset.change);
  if (nextQuantity <= 0) bag.delete(id);
  else bag.set(id, nextQuantity);
  renderBag();
});

document.querySelector(".bag-button").addEventListener("click", () => setDrawerOpen(true));
document.querySelector(".drawer-close").addEventListener("click", () => setDrawerOpen(false));
backdrop.addEventListener("click", () => setDrawerOpen(false));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setDrawerOpen(false);
    document.querySelector(".search-panel").classList.remove("open");
  }
});

const searchPanel = document.querySelector(".search-panel");
document.querySelector(".search-toggle").addEventListener("click", () => {
  const open = !searchPanel.classList.contains("open");
  searchPanel.classList.toggle("open", open);
  searchPanel.setAttribute("aria-hidden", String(!open));
  if (open) document.querySelector("#site-search").focus();
});
document.querySelector(".search-close").addEventListener("click", () => {
  searchPanel.classList.remove("open");
  searchPanel.setAttribute("aria-hidden", "true");
  document.querySelector("#site-search").value = "";
  renderProducts(document.querySelector(".filter-button.active").dataset.filter);
});
document.querySelector("#site-search").addEventListener("input", (event) => {
  renderProducts(document.querySelector(".filter-button.active").dataset.filter, event.target.value);
  document.querySelector("#shop").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const nav = document.querySelector(".desktop-nav");
  const open = nav.classList.toggle("open");
  event.currentTarget.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".desktop-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".desktop-nav").classList.remove("open");
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
  });
});

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#email");
  document.querySelector(".newsletter-message").textContent = `Thank you — a little note is on its way to ${email.value}.`;
  event.currentTarget.reset();
});

document.querySelector(".checkout-button").addEventListener("click", () => {
  if (bag.size) showToast("Checkout is coming soon.");
});

renderProducts();
renderBag();
