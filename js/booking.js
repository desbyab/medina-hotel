/* ============================================
   BOOKING.JS
   Handles:
   - Room data (descriptions, images, prices)
   - Night calculator (price × nights)
   - Paystack payment popup (defaults to
     Bank Transfer → Zenith Bank account)
   ============================================ */

const ROOMS = {
  premium: {
    name:        'Smart Premium',
    price:       65000,
    size:        '50.3 m²',
    bed:         '6 × 7 King',
    guests:      2,
    description: `Our most spacious offering, the Smart Premium room is a sanctuary of refined luxury.
    Featuring a grand 6×7 king-size bed dressed in premium linens, a separate living and work area,
    and warm ambient lighting, this room is designed for guests who want the very best.
    Enjoy sweeping views, a fully stocked minibar, complimentary breakfast, and attentive room
    service available around the clock. Whether you are visiting Uyo for business or leisure,
    the Smart Premium ensures every detail of your stay feels effortless and exceptional.`,
    amenities: [
      { icon: '📶', label: 'Free High-Speed WiFi' },
      { icon: '❄️', label: 'Air Conditioning' },
      { icon: '🚿', label: 'Hot Water Shower' },
      { icon: '📺', label: 'Flat-Screen TV' },
      { icon: '💼', label: 'Work Desk & Chair' },
      { icon: '☕', label: 'Complimentary Breakfast' },
      { icon: '🛁', label: 'En-Suite Bathroom' },
      { icon: '🧴', label: 'Premium Toiletries' },
      { icon: '🔒', label: 'In-Room Safe' },
      { icon: '🌅', label: 'City View' },
    ],
    images: [
      'assets/images/room-premium-1.jpeg',
      'assets/images/room-classique-1.jpeg',
      'assets/images/room-premium-2.jpeg',
      'assets/images/room-premium-3.jpeg',
    ],
  },

  classique: {
    name:        'Smart Classique',
    price:       55000,
    size:        '43.4 m²',
    bed:         '6 × 6 Queen',
    guests:      2,
    description: `Elegant and thoughtfully designed, the Smart Classique strikes the perfect balance
    between comfort and sophistication. The room features a 6×6 queen-size bed with plush bedding,
    warm décor accents, and carefully selected furnishings that create a calm, welcoming atmosphere.
    Guests enjoy complimentary breakfast, high-speed WiFi, and all standard amenities you would
    expect from a premium hotel experience. Ideal for couples, solo business travellers, and anyone
    who appreciates tasteful design and genuine hospitality in the heart of Uyo.`,
    amenities: [
      { icon: '📶', label: 'Free High-Speed WiFi' },
      { icon: '❄️', label: 'Air Conditioning' },
      { icon: '🚿', label: 'Hot Water Shower' },
      { icon: '📺', label: 'Flat-Screen TV' },
      { icon: '💼', label: 'Work Desk & Chair' },
      { icon: '☕', label: 'Complimentary Breakfast' },
      { icon: '🛁', label: 'En-Suite Bathroom' },
      { icon: '🧴', label: 'Quality Toiletries' },
    ],
    images: [
      'assets/images/room-classique-1.jpeg',
      'assets/images/room-premium-1.jpeg',
      'assets/images/room-premium-2.jpeg',
      'assets/images/reception-2.jpeg',
    ],
  },

  economy: {
    name:        'Smart Economy',
    price:       45000,
    size:        '30.8 m²',
    bed:         '6 × 4 Standard',
    guests:      2,
    description: `The Smart Economy room delivers genuine comfort at excellent value. Compact, clean,
    and thoughtfully arranged, this room includes a 6×4 standard bed with quality linens, modern
    décor, and all the amenities needed for a relaxed and productive stay. Complimentary breakfast
    is included, along with free WiFi, air conditioning, and access to all hotel facilities including
    the pool, gym, spa, and restaurant. A smart choice for budget-conscious travellers who refuse
    to compromise on quality or experience during their time in Uyo.`,
    amenities: [
      { icon: '📶', label: 'Free High-Speed WiFi' },
      { icon: '❄️', label: 'Air Conditioning' },
      { icon: '🚿', label: 'Hot Water Shower' },
      { icon: '📺', label: 'Flat-Screen TV' },
      { icon: '☕', label: 'Complimentary Breakfast' },
      { icon: '🛁', label: 'En-Suite Bathroom' },
      { icon: '🧴', label: 'Quality Toiletries' },
    ],
    images: [
      'assets/images/room-economy-1.jpeg',
      'assets/images/room-economy-2.jpeg',
      'assets/images/room-classique-1.jpeg',
      'assets/images/reception-1.jpeg',
    ],
  },
};


/* ============================================
   ROOM DETAIL PAGE LOGIC
============================================ */
const roomTitleEl = document.getElementById('roomTitle');

if (roomTitleEl) {

  const params   = new URLSearchParams(window.location.search);
  const roomType = params.get('type') || 'premium';
  const room     = ROOMS[roomType];

  if (!room) { window.location.href = 'rooms.html'; }

  /* ---- Populate page content ---- */
  document.title = `${room.name} — Madina Hotel & Residences`;
  document.getElementById('breadcrumbName').textContent = room.name;
  document.getElementById('roomTitle').textContent      = room.name;
  document.getElementById('cardPrice').textContent      = `₦${room.price.toLocaleString()}`;

  const descEl = document.getElementById('roomDesc');
  if (descEl) {
    descEl.innerHTML = room.description
      .split('\n').map(l => l.trim()).filter(Boolean).join('<br/><br/>');
  }

  const metaEl = document.getElementById('roomMeta');
  if (metaEl) {
    metaEl.innerHTML = `
      <span class="room-meta-chip">📐 ${room.size}</span>
      <span class="room-meta-chip">🛏 ${room.bed}</span>
      <span class="room-meta-chip">👤 Up to ${room.guests} Adults</span>
    `;
  }

  const amenGrid = document.getElementById('amenitiesGrid');
  if (amenGrid) {
    amenGrid.innerHTML = room.amenities
      .map(a => `<div class="amenity-item"><span>${a.icon}</span><span>${a.label}</span></div>`)
      .join('');
  }

  const heroImg = document.getElementById('heroImage');
  if (heroImg) {
    heroImg.src = room.images[0];
    heroImg.alt = room.name;
  }

  const thumbsEl = document.getElementById('roomThumbnails');
  if (thumbsEl) {
    thumbsEl.innerHTML = room.images.map((src, i) => `
      <div class="room-thumbnail ${i === 0 ? 'active' : ''}" data-src="${src}">
        <img src="${src}" alt="${room.name} photo ${i + 1}" />
      </div>
    `).join('');

    thumbsEl.querySelectorAll('.room-thumbnail').forEach(thumb => {
      thumb.addEventListener('click', () => {
        heroImg.src = thumb.dataset.src;
        thumbsEl.querySelectorAll('.room-thumbnail').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }

  /* ---- Night & price calculator ---- */
  const checkInEl   = document.getElementById('cardCheckIn');
  const checkOutEl  = document.getElementById('cardCheckOut');
  const nightsLabel = document.getElementById('nightsLabel');
  const totalAmtEl  = document.getElementById('totalAmount');

  function calculateTotal() {
    const inDate  = new Date(checkInEl.value);
    const outDate = new Date(checkOutEl.value);

    if (outDate <= inDate) {
      const nextDay = new Date(inDate);
      nextDay.setDate(inDate.getDate() + 1);
      checkOutEl.value = nextDay.toISOString().split('T')[0];
    }

    const nights = Math.ceil(
      (new Date(checkOutEl.value) - inDate) / (1000 * 60 * 60 * 24)
    );

    if (nights > 0) {
      const total = nights * room.price;
      nightsLabel.textContent = `${nights} night${nights > 1 ? 's' : ''} × ₦${room.price.toLocaleString()}`;
      totalAmtEl.textContent  = `₦${total.toLocaleString()}`;
      window._bookingTotal    = total; // total in Naira (NOT kobo — GlobalPay uses Naira)
      window._bookingNights   = nights;
    }
  }

  checkInEl.addEventListener('change', calculateTotal);
  checkOutEl.addEventListener('change', calculateTotal);
  calculateTotal();

  /* ---- PAYMENT: GlobalPay (Zenith Bank) ----

     HOW THIS WORKS:
     ─────────────────────────────────────
     1. Guest fills in name, email, phone and clicks Pay.
     2. The browser sends those details to a small,
        secure file that lives on Netlify's servers
        (netlify/functions/create-payment.js).
     3. That file talks to GlobalPay using the secret
        API key (hidden from visitors) and asks for a
        "checkout link".
     4. GlobalPay sends back a checkout link — a secure
        payment page where the guest can pay via Zenith
        Bank transfer, card, or USSD.
     5. The browser redirects the guest to that page.
     6. After payment, GlobalPay redirects the guest
        back to your site (configured in the GlobalPay
        merchant dashboard under "Redirect URL").

     The API key is NEVER visible here — it's stored
     securely in Netlify's Environment Variables.
  ------------------------------------------------ */
  const paystackBtn = document.getElementById('paystackBtn');

  if (paystackBtn) {
    paystackBtn.addEventListener('click', async () => {

      const name  = document.getElementById('guestName').value.trim();
      const email = document.getElementById('guestEmail').value.trim();
      const phone = document.getElementById('guestPhone').value.trim();

      // --- Validation ---
      if (!name) {
        showToast('⚠️ Please enter your full name');
        document.getElementById('guestName').focus();
        return;
      }
      if (!email || !email.includes('@')) {
        showToast('⚠️ Please enter a valid email address');
        document.getElementById('guestEmail').focus();
        return;
      }
      if (!phone || phone.length < 10) {
        showToast('⚠️ Please enter a valid phone number');
        document.getElementById('guestPhone').focus();
        return;
      }
      if (!window._bookingTotal || window._bookingTotal <= 0) {
        showToast('⚠️ Please select your check-in and check-out dates');
        return;
      }

      // --- Show loading state ---
      const originalLabel = paystackBtn.innerHTML;
      paystackBtn.disabled = true;
      paystackBtn.innerHTML = 'Redirecting to secure payment…';

      try {
        // --- Call our secure Netlify Function ---
        const response = await fetch('/.netlify/functions/create-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: name,
            email:    email,
            phone:    phone,
            address:  `${room.name} booking — Madina Hotel, Uyo`,
            amount:   window._bookingTotal, // in Naira
          }),
        });

        const data = await response.json();
        console.log('Payment response:', data); // visible in browser console (F12)

        if (data.checkoutUrl) {
          // ✅ Redirect guest to GlobalPay's secure checkout
          window.location.href = data.checkoutUrl;
        } else {
          // Show the actual error so we can debug it
          const errMsg = data?.globalpayResponse?.responseDescription
            || data?.globalpayResponse?.message
            || data?.error
            || 'Could not start payment';
          showToast(`⚠️ ${errMsg}. Please call +234 802 303 9293`);
          console.error('GlobalPay error details:', data);
          paystackBtn.disabled = false;
          paystackBtn.innerHTML = originalLabel;
        }

      } catch (err) {
        showToast('⚠️ Network error. Please check your connection and try again.');
        console.error('Network error:', err);
        paystackBtn.disabled = false;
        paystackBtn.innerHTML = originalLabel;
      }
    });
  }

} // end room detail page


/* ============================================
   HOME PAGE BOOKING BAR
============================================ */
const viewRatesBtn = document.getElementById('viewRatesBtn');

if (viewRatesBtn) {
  viewRatesBtn.addEventListener('click', () => {
    const checkIn  = document.getElementById('checkIn')?.value;
    const checkOut = document.getElementById('checkOut')?.value;
    const type     = document.getElementById('roomType')?.value;
    if (checkIn)  sessionStorage.setItem('checkIn', checkIn);
    if (checkOut) sessionStorage.setItem('checkOut', checkOut);
    if (type)     sessionStorage.setItem('roomType', type);
  });
}

/* ---- Restore saved filter values on rooms.html ---- */
if (document.getElementById('roomsGrid')) {
  const savedCheckIn  = sessionStorage.getItem('checkIn');
  const savedCheckOut = sessionStorage.getItem('checkOut');
  const savedType     = sessionStorage.getItem('roomType');
  if (savedCheckIn)  { const el = document.getElementById('checkIn');  if (el) el.value = savedCheckIn; }
  if (savedCheckOut) { const el = document.getElementById('checkOut'); if (el) el.value = savedCheckOut; }
  if (savedType)     { const el = document.getElementById('roomType'); if (el) el.value = savedType; }
}
