/* ============================================
   MAIN.JS — Shared functionality
   Runs on every page of the website
   ============================================ */

/* ---- NAVIGATION: Shrink on scroll ----
   When you scroll down, the navbar gets a
   white background so it's readable over
   any page content below the hero.
------------------------------------------------ */
const navbar = document.getElementById('navbar');

if (navbar) {
  // On inner pages, navbar is already white — keep it that way
  const isInnerPage = navbar.classList.contains('scrolled');

  window.addEventListener('scroll', () => {
    if (!isInnerPage) {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
}

/* ---- MOBILE MENU: Open / Close ----
   The hamburger button (three lines) toggles
   the nav menu open and closed on mobile.
------------------------------------------------ */
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
  navLinks.classList.add('open');
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // stop page scrolling behind menu
}

function closeMenu() {
  navLinks.classList.remove('open');
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (navToggle) navToggle.addEventListener('click', openMenu);
if (navOverlay) navOverlay.addEventListener('click', closeMenu);

// Also close menu when any nav link is clicked
if (navLinks) {
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ---- TOAST NOTIFICATION ----
   A small message that pops up at the
   bottom-right of the screen briefly.
   Usage: showToast("Your message here")
------------------------------------------------ */
function showToast(message, duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Make showToast available to other scripts
window.showToast = showToast;

/* ---- ROOM FILTER (rooms.html only) ----
   Filters the room grid when user clicks Apply
------------------------------------------------ */
const applyFilter = document.getElementById('applyFilter');
const roomsGrid   = document.getElementById('roomsGrid');
const noResults   = document.getElementById('noResults');

if (applyFilter && roomsGrid) {
  applyFilter.addEventListener('click', () => {
    const selectedType = document.getElementById('roomType').value;
    const cards = roomsGrid.querySelectorAll('.room-card');
    let visible = 0;

    cards.forEach(card => {
      const type = card.dataset.type;
      // If "all" selected OR card matches selected type → show it
      if (selectedType === 'all' || type === selectedType) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    // Show "no results" message if nothing matches
    if (noResults) {
      noResults.style.display = visible === 0 ? 'block' : 'none';
    }

    showToast(visible > 0 ? `Showing ${visible} room(s)` : 'No rooms found for that filter');
  });
}

/* ---- SET TODAY'S DATE as default check-in ----
   Prevents users from accidentally picking
   past dates on any page with date inputs.
------------------------------------------------ */
function setDefaultDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Format: YYYY-MM-DD (required by date inputs)
  const fmt = d => d.toISOString().split('T')[0];

  const checkInInputs  = document.querySelectorAll('#checkIn, #cardCheckIn');
  const checkOutInputs = document.querySelectorAll('#checkOut, #cardCheckOut');

  checkInInputs.forEach(el => {
    el.min   = fmt(today);
    el.value = fmt(today);
  });

  checkOutInputs.forEach(el => {
    el.min   = fmt(tomorrow);
    el.value = fmt(tomorrow);
  });
}

setDefaultDates();

/* ---- SCROLL REVEAL ANIMATION ----
   Elements with class "reveal" fade in
   as they enter the viewport while scrolling.
   Think of it like Framer Motion but simpler.
------------------------------------------------ */
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(revealStyle);

// Add .reveal to cards and sections automatically
document.querySelectorAll('.room-card, .amenity-pill, .gallery-item, .section-title').forEach(el => {
  el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger: each element delays slightly after the previous
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
