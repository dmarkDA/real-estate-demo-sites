// ===== Dummy luxury listing data =====
const PROPERTIES = [
  { id:1, title:"Villa Aurelia", type:"Waterfront", price:8250000, beds:6, baths:7, sqft:9800, address:"1 Promontory Point", city:"Belhaven Cove",
    img:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=70",
    desc:"A gated waterfront estate with private dock, infinity pool overlooking the bay, and a wine cellar carved into the coastal bluff.",
    features:["Private Dock","Infinity Pool","Wine Cellar","Guest House","Home Theater"] },
  { id:2, title:"The Meridian Penthouse", type:"Penthouse", price:5900000, beds:4, baths:5, sqft:5200, address:"One Meridian Tower, PH1", city:"Uptown",
    img:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=70",
    desc:"Full-floor penthouse with 360-degree skyline views, a private elevator lobby, and a wraparound terrace built for entertaining.",
    features:["Private Elevator","360° Views","Wraparound Terrace","Smart Home","Concierge"] },
  { id:3, title:"Foxglove Hill Estate", type:"Estate", price:6400000, beds:7, baths:8, sqft:11200, address:"420 Foxglove Hill Rd", city:"Ashcombe Valley",
    img:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=70",
    desc:"Set on 14 private acres, this stone-and-timber estate features formal gardens, a full equestrian facility, and a five-car heated garage.",
    features:["14 Acres","Equestrian Facility","Formal Gardens","Guest Cottage","Heated Garage"] },
  { id:4, title:"Casa del Mar", type:"Waterfront", price:11800000, beds:8, baths:9, sqft:13400, address:"7 Seabreeze Terrace", city:"Belhaven Cove",
    img:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1000&q=70",
    desc:"An oceanfront masterpiece with 200 feet of private beach frontage, an infinity-edge pool, and a rooftop lounge built for sunset views.",
    features:["Beach Frontage","Rooftop Lounge","Elevator","Chef's Kitchen","Spa"] },
  { id:5, title:"Skyline Residence 88", type:"Penthouse", price:4350000, beds:3, baths:4, sqft:4100, address:"88 Regency Sky, Unit PH2", city:"Uptown",
    img:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=70",
    desc:"A sophisticated sky residence with a chef's kitchen, library, and access to a private members' lounge on the ground floor.",
    features:["Members' Lounge","Library","Floor-to-Ceiling Glass","Private Parking"] },
  { id:6, title:"Wrenwood Manor", type:"Estate", price:7150000, beds:6, baths:7, sqft:10100, address:"12 Wrenwood Ln", city:"Ashcombe Valley",
    img:"https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=70",
    desc:"A restored Georgian manor with contemporary interiors, a sunken tennis court, and orchards spanning the eastern grounds.",
    features:["Tennis Court","Orchards","Wine Room","Library","Pool House"] },
  { id:7, title:"The Cascade House", type:"Waterfront", price:9600000, beds:5, baths:6, sqft:8700, address:"3 Cascade Bluff", city:"Belhaven Cove",
    img:"https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1000&q=70",
    desc:"Cantilevered over the cliffside with a glass-walled great room, this residence blurs the line between architecture and ocean.",
    features:["Cliffside Views","Glass Walls","Infinity Pool","Private Trail"] },
  { id:8, title:"Somerset Ridge Estate", type:"Estate", price:5450000, beds:5, baths:6, sqft:8200, address:"901 Somerset Ridge", city:"Ashcombe Valley",
    img:"https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=70",
    desc:"A refined countryside estate with a hilltop pool pavilion, four-stall stable, and sweeping views across the valley.",
    features:["Pool Pavilion","Stable","Valley Views","Home Gym","Guest Suite"] }
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
          <span><strong>${p.beds}</strong> Beds</span>
          <span><strong>${p.baths}</strong> Baths</span>
          <span><strong>${p.sqft.toLocaleString()}</strong> Sq Ft</span>
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
      <button class="btn btn-gold" style="width:100%;margin-top:8px;" id="tourBtn">Request a Private Viewing</button>
      <p class="form-note" id="tourNote" hidden>Inquiry received. An advisor will be in touch in strict confidence.</p>
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
