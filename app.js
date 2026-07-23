(function () {
  const API_URL = "https://contacts.sonicwebdev.com/runItRemote/srtFSmiu";

  const form = document.getElementById('leadTransferForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastText = document.getElementById('toastText');

  const fields = ['leadDate', 'firstName', 'lastName', 'primaryPhone', 'addressOne', 'currentCarrier', 'income', 'comments'];

  function showError(name, message) {
    const wrap = document.getElementById('field-' + name);
    wrap.classList.add('invalid');
    wrap.querySelector('.ltf-error').textContent = message;
  }

  function clearError(name) {
    const wrap = document.getElementById('field-' + name);
    wrap.classList.remove('invalid');
    wrap.querySelector('.ltf-error').textContent = '';
  }

  function showToast(type, message) {
    toast.className = 'ltf-toast ' + type + ' show';
    toastText.textContent = message;
    if (type === 'success') {
      toastIcon.style.stroke = '#16a34a';
      toastIcon.innerHTML = '<polyline points="20 6 9 17 4 12"/>';
    } else {
      toastIcon.style.stroke = '#ef4444';
      toastIcon.innerHTML = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
    }
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

  function validate() {
    let valid = true;
    const values = {};
    fields.forEach((name) => values[name] = document.getElementById(name).value.trim());

    if (!values.leadDate) { showError('leadDate', 'Lead date is required'); valid = false; }
    else clearError('leadDate');

    if (values.firstName.length < 2) { showError('firstName', 'First name is required'); valid = false; }
    else clearError('firstName');

    if (values.lastName.length < 2) { showError('lastName', 'Last name is required'); valid = false; }
    else clearError('lastName');

    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!phoneRegex.test(values.primaryPhone)) { showError('primaryPhone', 'Enter a valid phone number'); valid = false; }
    else clearError('primaryPhone');

    if (values.addressOne.length < 5) { showError('addressOne', 'Property address is required'); valid = false; }
    else clearError('addressOne');

    if (!values.currentCarrier) { showError('currentCarrier', 'This field is required'); valid = false; }
    else clearError('currentCarrier');

    if (!values.income) { showError('income', 'Household income is required'); valid = false; }
    else clearError('income');

    if (values.comments.length < 3) { showError('comments', 'Lead notes are required'); valid = false; }
    else clearError('comments');

    return { valid, values };
  }
const phoneInput = document.getElementById("primaryPhone");

phoneInput.addEventListener("input", function () {
  this.value = formatPhone(this.value);
});
  fields.forEach((name) => {
    document.getElementById(name).addEventListener('input', () => clearError(name));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const { valid, values } = validate();
    if (!valid) return;
    values.primaryPhone = values.primaryPhone.replace(/\D/g, "");

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtnText.textContent = 'Transferring...';

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json().catch(() => ({}));
      })
      .then(() => {
        showToast('success', 'Lead transferred successfully!');
        form.reset();
      })
      .catch(() => {
        showToast('error', 'Something went wrong. Please try again.');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtnText.textContent = 'Transfer Lead';
      });
  });
})();