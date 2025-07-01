// In public/js/script.js or inline script
(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()


function toggleMenu() {
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Optional: hide menu on outside click
document.addEventListener("click", function (e) {
  const menu = document.querySelector(".menu-wrapper");
  if (!menu.contains(e.target)) {
    document.getElementById("dropdown").style.display = "none";
  }
});

var today = new Date().toISOString().split('T')[0];
const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");
checkinInput.setAttribute("min", today);

checkinInput.addEventListener("change", () => {
    const checkinDate = new Date(checkinInput.value);
    const minCheckout = new Date(checkinDate);
    minCheckout.setDate(minCheckout.getDate() + 1); // next day

    const isoMin = minCheckout.toISOString().split('T')[0];
    checkoutInput.min = isoMin;
    checkoutInput.value = ""; // reset if previously set
});

const propertyIcons = document.querySelectorAll(".property-type");

propertyIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    const type = icon.getAttribute("data-type");
    window.location.href = `/listings?type=${type}`;
  });
});
