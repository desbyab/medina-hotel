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
      'assets/images/room-classique-2.jpeg',
      'assets/images/room-classique-3.jpeg',
      'assets/images/lobby-chandelier.jpeg',
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
      'assets/images/room-classique-2.jpeg',
      'assets/images/room-classique-3.jpeg',
      'assets/images/exterior-lawn.jpeg',
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
      window._bookingTotal    = total * 100; // convert to kobo for Paystack
      window._bookingNights   = nights;
    }
  }

  checkInEl.addEventListener('change', calculateTotal);
  checkOutEl.addEventListener('change', calculateTotal);
  calculateTotal();

  /* ---- Update button label ---- */
  const paystackBtn = document.getElementById('paystackBtn');
  if (paystackBtn) {
    paystackBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" style="flex-shrink:0">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
      Pay via Zenith Bank Transfer
    `;

    /* ---- Paystack popup ----

       HOW THE ZENITH BANK TRANSFER WORKS:
       ─────────────────────────────────────
       The key line is: channels: ['bank_transfer']

       This tells Paystack to skip card/USSD and
       go straight to the bank transfer screen.
       Paystack then generates a VIRTUAL Zenith Bank
       account number unique to this transaction.

       The customer sees:
         "Transfer ₦65,000 to:
          Zenith Bank — 1234567890
          Account Name: Madina Hotel"

       They open their bank app, transfer the exact
       amount, and Paystack confirms it automatically.
       No manual checking needed on the hotel's end.

       SETUP STEPS FOR THE CLIENT:
       ────────────────────────────
       1. Create account at dashboard.paystack.com
       2. Go to Settings → Preferences
       3. Under "Virtual Account Bank", select Zenith Bank
       4. Copy your Public Key from Settings → API Keys
       5. Paste it below where it says REPLACE_THIS
    ------------------------------------------------ */
    paystackBtn.addEventListener('click', () => {

      const name  = document.getElementById('guestName').value.trim();
      const email = document.getElementById('guestEmail').value.trim();

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
      if (!window._bookingTotal || window._bookingTotal <= 0) {
        showToast('⚠️ Please select your check-in and check-out dates');
        return;
      }

      const ref = `MADINA-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      const handler = PaystackPop.setup({

        // ⚠️ REPLACE THIS with your Paystack Public Key
        // Get it from: dashboard.paystack.com → Settings → API Keys
        // Looks like: pk_live_xxxxxxxxxxxxxxxxxxxxxxxx
        key: 'pk_test_REPLACE_WITH_YOUR_PAYSTACK_PUBLIC_KEY',

        email:    email,
        amount:   window._bookingTotal, // in kobo (Naira × 100)
        currency: 'NGN',
        ref:      ref,
        label:    `${room.name} — Madina Hotel`,

        // ✅ THIS IS WHAT TRIGGERS ZENITH BANK TRANSFER
        // Paystack will show ONLY the bank transfer option
        // and generate a Zenith virtual account number
        channels: ['bank_transfer'],

        metadata: {
          custom_fields: [
            { display_name: 'Guest Name',  variable_name: 'guest_name',  value: name },
            { display_name: 'Room',        variable_name: 'room_type',   value: room.name },
            { display_name: 'Check In',    variable_name: 'check_in',    value: checkInEl.value },
            { display_name: 'Check Out',   variable_name: 'check_out',   value: checkOutEl.value },
            { display_name: 'Nights',      variable_name: 'nights',      value: window._bookingNights },
          ]
        },

        // ✅ Payment successful
        callback: function(response) {
          showToast(`✅ Booking confirmed! Ref: ${response.reference}`);
          paystackBtn.innerHTML    = '✅ Booking Confirmed';
          paystackBtn.disabled     = true;
          paystackBtn.style.background   = '#2d7a3a';
          paystackBtn.style.borderColor  = '#2d7a3a';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        // User closed popup without paying
        onClose: function() {
          showToast('Transfer cancelled. Your booking is not confirmed yet.');
        }
      });

      handler.openIframe();
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
