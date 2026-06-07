// Data - Barbers only (services now in HTML)
const BARBERS = [
  { name: "Thabo Mokgotho", initials: "TM" },
  { name: "Lerato Dlamini", initials: "LD" },
  { name: "Sipho Ndlovu", initials: "SN" }
];

const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

// State
let currentStep = 'form';
let selectedTime = null;
let formData = {
  name: '',
  phone: '',
  date: new Date().toISOString().slice(0, 10),
  service: 'Fade',
  barber: 'Any available'
};

// DOM elements
const modal = document.getElementById('bookingModal');
const modalBody = document.getElementById('modalBody');

// Attach service book buttons (since services are now in HTML)
function attachServiceButtons() {
  document.querySelectorAll('.book-link').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service');
      openModal(serviceName, null);
    });
  });
}

// Render barbers
function renderBarbers() {
  const grid = document.getElementById('barbersGrid');
  if (!grid) return;

  grid.innerHTML = BARBERS.map(b => `
    <div class="barber-card">
      <div class="barber-avatar">${b.initials}</div>
      <div class="barber-name">${b.name}</div>
      <div class="barber-meta">${b.role} · ${b.years} yrs</div>
      <button class="barber-btn" data-barber="${b.name}">Book with ${b.name.split(' ')[0]}</button>
    </div>
  `).join('');

  document.querySelectorAll('.barber-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      openModal(null, btn.getAttribute('data-barber'));
    });
  });
}

// Modal functions
function openModal(serviceVal, barberVal) {
  if (serviceVal) formData.service = serviceVal;
  if (barberVal) formData.barber = barberVal;
  currentStep = 'form';
  selectedTime = null;
  renderFormStep();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function renderFormStep() {
  const SERVICES_LIST = [
    "Fade", "Low Fade", "High Fade", "Buzz Cut",
    "Afro", "Dreadlocks", "Braids", "Mohawk", "Taper"
  ];

  modalBody.innerHTML = `
    <form id="bookingForm">
      <div class="flex-row-2">
        <div class="form-group">
          <label>Choose a Style</label>
          <select id="modalService">
            ${SERVICES_LIST.map(s => `<option ${formData.service === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Barber</label>
          <select id="modalBarber">
            <option ${formData.barber === 'Any available' ? 'selected' : ''}>Any available</option>
            ${BARBERS.map(b => `<option ${formData.barber === b.name ? 'selected' : ''}>${b.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="flex-row-2">
        <div class="form-group">
          <label>Full name</label>
          <input id="modalName" type="text" value="${formData.name}" placeholder="James Carter">
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input id="modalPhone" type="tel" value="${formData.phone}" placeholder="(+27) 123 4567">
        </div>
      </div>
      <div class="form-group">
        <label>Date</label>
        <input id="modalDate" type="date" value="${formData.date}" min="${new Date().toISOString().slice(0, 10)}">
      </div>
      <div class="form-group">
        <label>Pick a time</label>
        <div id="timeSlots" class="time-grid"></div>
      </div>
      <button type="submit" class="btn-primary btn-full">Confirm booking</button>
    </form>
  `;

  const timeContainer = document.getElementById('timeSlots');
  TIMES.forEach(t => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `time-slot ${selectedTime === t ? 'selected' : ''}`;
    btn.textContent = t;
    btn.onclick = () => {
      selectedTime = t;
      renderFormStep();
    };
    timeContainer.appendChild(btn);
  });

  const formEl = document.getElementById('bookingForm');
  formEl.onsubmit = (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('modalName').value.trim();
    const phoneInput = document.getElementById('modalPhone').value.trim();
    const dateInput = document.getElementById('modalDate').value;
    const serviceSelect = document.getElementById('modalService').value;
    const barberSelect = document.getElementById('modalBarber').value;

    if (!nameInput || !phoneInput || !selectedTime) {
      alert('Please fill all fields and select a time.');
      return;
    }

    formData = {
      name: nameInput,
      phone: phoneInput,
      date: dateInput,
      service: serviceSelect,
      barber: barberSelect
    };
    currentStep = 'done';
    renderDoneStep();
  };
}

function renderDoneStep() {
  modalBody.innerHTML = `
    <div class="success-state">
      <i data-lucide="check-circle-2" class="check-icon"></i>
      <h3 class="modal-title" style="font-size:1.8rem">You're booked</h3>
      <p style="margin:1rem 0; color: var(--text-light);">
        ${formData.service} with <strong>${formData.barber}</strong><br>
        ${new Date(formData.date).toDateString()} at ${selectedTime}
      </p>
      <p style="font-size:0.85rem; color:var(--text-muted)">
        A confirmation will be sent to ${formData.phone}.
      </p>
      <button id="doneBtn" class="btn-primary btn-full" style="margin-top:1rem">Done</button>
    </div>
  `;
  lucide.createIcons();
  document.getElementById('doneBtn')?.addEventListener('click', closeModal);
}

// Event listeners
document.getElementById('globalBookBtn')?.addEventListener('click', () => openModal(null, null));
document.getElementById('heroBookBtn')?.addEventListener('click', () => openModal(null, null));
document.getElementById('visitBookBtn')?.addEventListener('click', () => openModal(null, null));
document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Initialize
attachServiceButtons();
renderBarbers();
lucide.createIcons();
