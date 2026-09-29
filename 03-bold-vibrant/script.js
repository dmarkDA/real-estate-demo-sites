// ===== Dummy listing data =====
const PROPERTIES = [
  { id:1, title:"Sunny Maple Street Condo", type:"Condo", price:312000, beds:2, baths:1, sqft:920, address:"14 Maple St, Unit 3", city:"Fernwood",
    img:"https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=70",
    desc:"Bright and cheerful condo with big windows, an updated kitchen, and a shared rooftop deck perfect for evening hangs.",
    features:["Rooftop Deck","In-Unit Laundry","Bike Storage","Pet Friendly"] },
  { id:2, title:"Cozy Birchdale Starter Home", type:"Starter Home", price:268000, beds:2, baths:1, sqft:1080, address:"22 Birchdale Ave", city:"Fernwood",
    img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=70",
    desc:"The perfect first home — a fenced yard, updated bathroom, and a driveway with room for two cars. Move-in ready.",
    features:["Fenced Yard","Driveway Parking","Updated Bath","Move-In Ready"] },
  { id:3, title:"The Twin Oaks Duplex", type:"Duplex", price:398000, beds:4, baths:2, sqft:1900, address:"5-5A Twin Oaks Ct", city:"Rosedale",
    img:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=70",
    desc:"Live in one side, rent the other — or knock through for extra space. Two separate entrances and utilities.",
    features:["Two Units","Separate Entrances","Great for Investors","Shared Backyard"] },
  { id:4, title:"Lantern Loft #212", type:"Condo", price:289000, beds:1, baths:1, sqft:760, address:"212 Lantern Lofts", city:"Downtown",
    img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=70",
    desc:"Exposed brick, tall ceilings, and a walkable location just blocks from cafes, transit, and the weekend farmers market.",
    features:["Exposed Brick","Walkable Location","Gym Access","Elevator Building"] },
  { id:5, title:"Sparrow Lane Cottage", type:"Starter Home", price:245000, beds:2, baths:1, sqft:940, address:"9 Sparrow Ln", city:"Millbrook",
    img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=70",
    desc:"A sweet single-story cottage with a sunroom, garden beds already planted, and a covered front porch.",
    features:["Sunroom","Garden Beds","Covered Porch","Low Maintenance"] },
  { id:6, title:"Riverbend Duplex Retreat", type:"Duplex", price:429000, beds:4, baths:3, sqft:2100, address:"18-18B Riverbend Way", city:"Rosedale",
    img:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=70",
    desc:"Newly renovated duplex near the river trail — each unit has its own deck, in-unit laundry, and off-street parking.",
    features:["River Trail Access","Private Decks","In-Unit Laundry","Off-Street Parking"] },
  { id:7, title:"The Cornerstone Condo", type:"Condo", price:335000, beds:2, baths:2, sqft:1020, address:"77 Cornerstone Sq, Unit 5", city:"Downtown",
    img:"https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=70",
    desc:"Modern finishes, a private balcony, and secure underground parking — all steps from the light rail station.",
    features:["Private Balcony","Underground Parking","Near Light Rail","Modern Finishes"] },
  { id:8, title:"Hollyhock Starter Bungalow", type:"Starter Home", price:279000, beds:3, baths:2, sqft:1180, address:"31 Hollyhock St", city:"Fernwood",
    img:"https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=70",
    desc:"Three bedrooms, a fully fenced backyard, and freshly painted rooms throughout. Great starter or forever home.",
    features:["3 Bedrooms","Fully Fenced","Freshly Painted","Quiet Street"] },
  { id:9, title:"Pinecrest Duplex Duo", type:"Duplex", price:365000, beds:3, baths:2, sqft:1650, address:"40-40A Pinecrest Rd", city:"Millbrook",
    img:"https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=70",
    desc:"Charming duplex with matching front porches, a shared driveway, and easy access to the neighborhood park.",
    features:["Front Porches","Shared Driveway","Near Park","Storage Sheds"] }
];

const fmt = n => "$" + n.toLocaleString("en-US");

const grid = document.getElementById("listingGrid");
let activeFilter = "all";

function renderListings(){
  const filtered = PROPERTIES.filter(p => activeFilter === "all" || p.type === activeFilter);
  grid.innerHTML = filtered.map(p=>`
    <article class="listing-card" data-id="${p.id}">
      <div class="listing-media">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
        <span class="listing-badge">${p.type}</span>
        <span class="listing-price">${fmt(p.price)}</span>
      </div>
      <div class="listing-body">
        <h3>${p.title}</h3>
        <p class="listing-addr">${p.address}, ${p.city}</p>
        <div class="listing-meta">
          <span>🛏️ ${p.beds} bd</span>
          <span>🛁 ${p.baths} ba</span>
          <span>📐 ${p.sqft.toLocaleString()} sqft</span>
        </div>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".listing-card").forEach(card=>{
    card.addEventListener("click", ()=> openModal(Number(card.dataset.id)));
  });
}
renderListings();

document.getElementById("filterChips").addEventListener("click", e=>{
  const btn = e.target.closest(".chip");
  if(!btn) return;
  document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  renderListings();
});

// ===== Modal =====
const modalBackdrop = document.getElementById("modalBackdrop");
const modalBody = document.getElementById("modalBody");

function openModal(id){
  const p = PROPERTIES.find(x=>x.id===id);
  if(!p) return;
  modalBody.innerHTML = `
    <img class="modal-img" src="${p.img}" alt="${p.title}">
    <div class="modal-content">
      <span class="listing-price">${fmt(p.price)}</span>
      <h2>${p.title}</h2>
      <p class="listing-addr">${p.address}, ${p.city}</p>
      <div class="modal-meta">
        <div><strong>${p.beds}</strong>Bedrooms</div>
        <div><strong>${p.baths}</strong>Bathrooms</div>
        <div><strong>${p.sqft.toLocaleString()}</strong>Sq Ft</div>
      </div>
      <p>${p.desc}</p>
      <div class="modal-features">${p.features.map(f=>`<span>${f}</span>`).join("")}</div>
      <button class="btn btn-primary" style="width:100%;margin-top:8px;" id="tourBtn">Book a Tour 📅</button>
      <p class="form-note" id="tourNote" hidden style="margin-top:10px;">Nice! We'll text you shortly to set up a time 🎉</p>
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
