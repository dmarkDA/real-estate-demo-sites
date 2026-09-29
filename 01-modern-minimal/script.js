// ===== Dummy listing data =====
const PROPERTIES = [
  { id:1, title:"Sunlit Craftsman Bungalow", type:"House", price:485000, beds:3, baths:2, sqft:1820, address:"142 Maple Grove Rd", city:"Rivendale", status:"New",
    img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=70",
    desc:"A beautifully updated craftsman bungalow with original hardwood floors, a wraparound porch, and a freshly renovated kitchen with quartz countertops.",
    features:["Hardwood Floors","Updated Kitchen","Front Porch","Attached Garage"] },
  { id:2, title:"Skyline Loft Residences", type:"Condo", price:379000, beds:2, baths:2, sqft:1150, address:"88 Founders Tower, Unit 14B", city:"Downtown", status:"For Sale",
    img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=70",
    desc:"Floor-to-ceiling windows and panoramic skyline views define this modern downtown loft. Steps from restaurants, transit, and the riverwalk.",
    features:["City Views","In-Unit Laundry","Gym Access","Rooftop Deck"] },
  { id:3, title:"Willowbrook Family Home", type:"House", price:612000, beds:4, baths:3, sqft:2640, address:"27 Willowbrook Ln", city:"Ashford Hills", status:"For Sale",
    img:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=70",
    desc:"Spacious two-story family home on a quiet cul-de-sac with a fenced backyard, finished basement, and top-rated school district.",
    features:["Finished Basement","Fenced Yard","3-Car Garage","Cul-de-sac"] },
  { id:4, title:"The Aster Townhome Collection", type:"Townhouse", price:449000, beds:3, baths:2.5, sqft:1780, address:"9 Aster Row", city:"Millbrook", status:"New",
    img:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=70",
    desc:"Brand-new construction townhome featuring an open-concept main floor, private patio, and low-maintenance living close to the greenway trail.",
    features:["New Construction","Private Patio","Energy Efficient","Greenway Access"] },
  { id:5, title:"Harbor Point Condo", type:"Condo", price:329000, beds:1, baths:1, sqft:840, address:"501 Harbor Point Dr, Unit 6", city:"Bayside", status:"For Sale",
    img:"https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=70",
    desc:"Cozy waterfront condo with a private balcony overlooking the marina. Perfect starter home or investment property.",
    features:["Water Views","Balcony","Storage Unit","Pet Friendly"] },
  { id:6, title:"Cedar Hollow Colonial", type:"House", price:734000, beds:5, baths:3.5, sqft:3120, address:"316 Cedar Hollow Ct", city:"Ashford Hills", status:"For Sale",
    img:"https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=70",
    desc:"Elegant colonial with a chef's kitchen, formal dining room, and a resort-style backyard complete with heated pool.",
    features:["Heated Pool","Chef's Kitchen","Formal Dining","Home Office"] },
  { id:7, title:"Birchwood Corner Townhome", type:"Townhouse", price:398000, beds:3, baths:2, sqft:1640, address:"14 Birchwood Mews", city:"Millbrook", status:"Pending",
    img:"https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=70",
    desc:"End-unit townhome with extra natural light, an attached garage, and a community clubhouse with pool access.",
    features:["End Unit","Attached Garage","Community Pool","Walk-in Closets"] },
  { id:8, title:"Riverside Ranch", type:"House", price:559000, beds:3, baths:2, sqft:2040, address:"77 Riverside Dr", city:"Rivendale", status:"For Sale",
    img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=70",
    desc:"Single-story ranch backing to a nature preserve, with an open floor plan, vaulted ceilings, and a screened-in porch.",
    features:["Single Story","Vaulted Ceilings","Screened Porch","Nature Preserve Lot"] },
  { id:9, title:"Parkline Modern Condo", type:"Condo", price:445000, beds:2, baths:2, sqft:1240, address:"200 Parkline Ave, Unit 9C", city:"Downtown", status:"New",
    img:"https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=70",
    desc:"Sleek new-build condo across from the park, with designer finishes, a smart-home package, and secure parking included.",
    features:["Smart Home","Secure Parking","Designer Finishes","Park Views"] }
];

const fmt = n => n == null ? "Price on request" : "$" + Number(n).toLocaleString("en-US");
const num = n => n == null ? "—" : Number(n).toLocaleString("en-US");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// ===== Listing source: REALTOR.ca via /api/listings when the proxy is live, else demo data =====
const grid = document.getElementById("listingGrid");
const emptyState = document.getElementById("emptyState");
const dataSource = document.getElementById("dataSource");
let activeFilter = "all";
let searchState = { q:"", type:"all", price:0 };
let listings = PROPERTIES;
let isLive = false;

async function loadListings(){
  const params = new URLSearchParams();
  if(searchState.q.trim()) params.set("q", searchState.q.trim());
  if(searchState.price) params.set("maxPrice", searchState.price);
  try{
    const res = await fetch("/api/listings?" + params);
    if(!res.ok) throw new Error("live search unavailable");
    listings = (await res.json()).listings;
    isLive = true;
  }catch{
    listings = PROPERTIES;
    isLive = false;
  }
  renderListings();
}

function renderListings(){
  const q = searchState.q.trim().toLowerCase();
  const filtered = listings.filter(p=>{
    const matchesChip = activeFilter === "all" || p.type === activeFilter;
    const matchesType = searchState.type === "all" || p.type === searchState.type;
    const matchesPrice = isLive || !searchState.price || p.price <= searchState.price;
    const matchesQuery = isLive || !q || (p.title+p.address+p.city).toLowerCase().includes(q);
    return matchesChip && matchesType && matchesPrice && matchesQuery;
  });

  grid.innerHTML = filtered.map(p=>`
    <article class="listing-card" data-id="${esc(p.id)}">
      <div class="listing-media">
        ${p.img ? `<img src="${esc(p.img)}" alt="${esc(p.title)}" loading="lazy">` : `<div class="no-photo">Photo coming soon</div>`}
        <span class="listing-badge ${p.status==='New'?'new':''}">${esc(p.status)}</span>
        <span class="listing-price">${fmt(p.price)}</span>
      </div>
      <div class="listing-body">
        <h3>${esc(p.title)}</h3>
        <p class="listing-addr">${esc(p.address)}${p.city && !String(p.address).includes(p.city) ? ", " + esc(p.city) : ""}</p>
        <div class="listing-meta">
          <span>${num(p.beds)} bd</span>
          <span>${num(p.baths)} ba</span>
          <span>${num(p.sqft)} sqft</span>
          ${p.mls ? `<span>MLS® ${esc(p.mls)}</span>` : ""}
        </div>
      </div>
    </article>
  `).join("");

  emptyState.hidden = filtered.length > 0;
  grid.hidden = filtered.length === 0;
  dataSource.textContent = isLive
    ? "Listing data provided by REALTOR.ca® DDF®. MLS®, REALTOR® and the associated logos are trademarks of CREA."
    : "Demo listings. Start the proxy with DDF credentials to show live REALTOR.ca listings.";

  grid.querySelectorAll(".listing-card").forEach(card=>{
    card.addEventListener("click", ()=> openModal(card.dataset.id));
  });
}
loadListings();

// ===== Filter chips =====
document.getElementById("filterChips").addEventListener("click", e=>{
  const btn = e.target.closest(".chip");
  if(!btn) return;
  document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  renderListings();
});

document.getElementById("resetFilters").addEventListener("click", ()=>{
  activeFilter = "all";
  searchState = { q:"", type:"all", price:0 };
  document.getElementById("q").value = "";
  document.getElementById("type").value = "all";
  document.getElementById("price").value = "0";
  document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
  document.querySelector('.chip[data-filter="all"]').classList.add("active");
  loadListings();
});

// ===== Search form =====
document.getElementById("searchForm").addEventListener("submit", e=>{
  e.preventDefault();
  searchState.q = document.getElementById("q").value;
  searchState.type = document.getElementById("type").value;
  searchState.price = Number(document.getElementById("price").value);
  document.getElementById("listings").scrollIntoView({behavior:"smooth"});
  loadListings();
});

// ===== Modal =====
const modalBackdrop = document.getElementById("modalBackdrop");
const modalBody = document.getElementById("modalBody");

function openModal(id){
  const p = listings.find(x=>String(x.id)===id);
  if(!p) return;
  modalBody.innerHTML = `
    ${p.img ? `<img class="modal-img" src="${esc(p.img)}" alt="${esc(p.title)}">` : ""}
    <div class="modal-content">
      <span class="listing-price">${fmt(p.price)}</span>
      <h2>${esc(p.title)}</h2>
      <p class="listing-addr">${esc(p.address)}${p.city && !String(p.address).includes(p.city) ? ", " + esc(p.city) : ""}</p>
      <div class="modal-meta">
        <div><strong>${num(p.beds)}</strong>Bedrooms</div>
        <div><strong>${num(p.baths)}</strong>Bathrooms</div>
        <div><strong>${num(p.sqft)}</strong>Sq Ft</div>
      </div>
      <p>${esc(p.desc)}</p>
      <div class="modal-features">${(p.features || []).map(f=>`<span>${esc(f)}</span>`).join("")}</div>
      <button class="btn btn-primary" style="width:100%;margin-top:8px;" id="tourBtn">Request a Tour</button>
      <p class="form-note" id="tourNote" hidden>Request sent! An agent will contact you within 24 hours.</p>
    </div>
  `;
  modalBackdrop.classList.add("open");
  document.body.style.overflow = "hidden";
  document.getElementById("tourBtn").addEventListener("click", ()=>{
    document.getElementById("tourNote").hidden = false;
  });
}
function closeModal(){
  modalBackdrop.classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("modalClose").addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", e=>{ if(e.target === modalBackdrop) closeModal(); });
document.addEventListener("keydown", e=>{ if(e.key === "Escape") closeModal(); });

// ===== Mobile nav =====
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
menuToggle.addEventListener("click", ()=>{
  const isOpen = mobileNav.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
});
mobileNav.querySelectorAll("a").forEach(a=> a.addEventListener("click", ()=>{
  mobileNav.classList.remove("open");
  menuToggle.classList.remove("open");
}));

// ===== Contact form =====
document.getElementById("contactForm").addEventListener("submit", e=>{
  e.preventDefault();
  document.getElementById("formNote").hidden = false;
  e.target.reset();
});
