// In public/js/script.js or inline script
console.log("IN Js");
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

const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");

if (checkinInput && checkoutInput) {
  const today = new Date().toISOString().split('T')[0];
  checkinInput.setAttribute("min", today);

  checkinInput.addEventListener("change", () => {
    const checkinDate = new Date(checkinInput.value);
    const minCheckout = new Date(checkinDate);
    minCheckout.setDate(minCheckout.getDate() + 1);

    const isoMin = minCheckout.toISOString().split('T')[0];
    checkoutInput.min = isoMin;
    checkoutInput.value = ""; // Reset if previously set
  });
}


const propertyIcons = document.querySelectorAll(".property-type");

propertyIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    const type = icon.getAttribute("data-type");
    window.location.href = `/listings?type=${type}`;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');

  // === CASE 1: Form page (new or edit listing) ===
  const latInput = document.getElementById('lat');
  const lngInput = document.getElementById('lng');

  if (mapElement && latInput && lngInput) {
    const defaultLat = parseFloat(latInput.value) || 26.72098;
    const defaultLng = parseFloat(lngInput.value) || 88.43010;

    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=orQJlTV0osvHWSlRP4p9',
      center: [defaultLng, defaultLat],
      zoom: 13
    });

    let marker = new maplibregl.Marker({ draggable: true })
      .setLngLat([defaultLng, defaultLat])
      .addTo(map);

    // Update hidden fields when marker is dragged
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      lngInput.value = lngLat.lng;
      latInput.value = lngLat.lat;
    });

    // Click on map to move marker
    map.on('click', (e) => {
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;
      marker.setLngLat([lng, lat]);
      lngInput.value = lng;
      latInput.value = lat;
    });
  }

  // === CASE 2: Show page (view-only map with pin) ===
  if (mapElement && mapElement.dataset.lat && mapElement.dataset.lng) {
    const lat = parseFloat(mapElement.dataset.lat);
    const lng = parseFloat(mapElement.dataset.lng);

    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=orQJlTV0osvHWSlRP4p9',
      center: [lng, lat],
      zoom: 13
    });

    new maplibregl.Marker()
      .setLngLat([lng, lat])
      .addTo(map);
  }
});
