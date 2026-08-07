const productPrice = 3000;
const googleSheetsEndpoint = 'https://script.google.com/macros/s/AKfycbymQavLeUXQuGbt34PaW3rA9VFxm8fe1IASdpBON6m4SmVVn8kEBy8hzsdrFJjyHUpIcA/exec';
const communesUrl = 'https://raw.githubusercontent.com/othmanus/algeria-cities/master/json/algeria_cities.json';
let chosenSize = 'M';
let selectedProduct = { name: 'T-Shirt Yamaha T-MAX 560 Classic', title: 'T-MAX 560', image: 'assets/tmax-classic.png', variant: 'Classic', description: 'T-MAX 560 print on the front and back.' };
let communesByWilaya = {};

const wilayas = [
  [1,'Adrar',1100,600],[2,'Chlef',700,400],[3,'Laghouat',900,500],[4,'Oum El Bouaghi',800,400],[5,'Batna',800,400],[6,'Bejaia',700,400],[7,'Biskra',900,500],[8,'Bechar',1100,600],[9,'Blida',500,250],[10,'Bouira',650,400],[11,'Tamanrasset',1300,800],[12,'Tebessa',800,500],[13,'Tlemcen',800,400],[14,'Tiaret',800,400],[15,'Tizi Ouzou',650,400],[16,'Alger',400,200],[17,'Djelfa',900,500],[18,'Jijel',700,400],[19,'Setif',700,400],[20,'Saida',800,400],[21,'Skikda',700,400],[22,'Sidi Bel Abbes',700,400],[23,'Annaba',700,400],[24,'Guelma',800,400],[25,'Constantine',700,400],[26,'Medea',600,400],[27,'Mostaganem',700,400],[28,'M Sila',800,400],[29,'Mascara',700,500],[30,'Ouargla',1000,500],[31,'Oran',700,400],[32,'El Bayadh',1000,500],[33,'Illizi',1300,600],[34,'Bordj Bou Arreridj',700,400],[35,'Boumerdes',600,350],[36,'El Tarf',800,400],[37,'Tindouf',1300,600],[38,'Tissemsilt',800,400],[39,'El Oued',900,500],[40,'Khenchela',800,500],[41,'Souk Ahras',800,500],[42,'Tipaza',600,350],[43,'Mila',700,400],[44,'Ain Defla',600,400],[45,'Naama',1000,500],[46,'Ain Temouchent',700,400],[47,'Ghardaia',1000,500],[48,'Relizane',700,400],[49,'Timimoun',1300,600],[51,'Ouled Djellal',900,500],[52,'Beni Abbes',1300,null],[53,'In Salah',1300,600],[55,'Touggourt',900,500],[57,'El Mghair',900,null],[58,'El Meniaa',1000,500]
];

const wilayaSelect = document.querySelector('#wilaya');
const communeSelect = document.querySelector('#commune');
wilayas.forEach(([code, name, home, stop]) => { const option = document.createElement('option'); option.value = name; option.dataset.code = code; option.dataset.home = home; option.dataset.stop = stop ?? ''; option.textContent = name; wilayaSelect.append(option); });

const priceFormat = number => `${number.toLocaleString('fr-FR').replace(/\u202f/g, ' ')} DA`;
function updateVariant() { document.querySelector('#summary-variant').textContent = `${selectedProduct.variant} / ${chosenSize}`; }
function selectModel(key) {
  const models = {
    classic:{name:'T-Shirt Yamaha T-MAX 560 Classic',title:'T-MAX 560',image:'assets/tmax-classic.png',variant:'Classic',description:'T-MAX 560 print on the front and back.'},
    evolution:{name:'T-Shirt Yamaha T-MAX 560 Evolution',title:'EVOLUTION',image:'assets/tmax-evolution.png',variant:'Evolution',description:'Maxi Scooter Evolution edition.'},
    blueprint:{name:'T-Shirt Yamaha T-MAX 560 Blueprint',title:'BLUEPRINT',image:'assets/tmax-blueprint.png',variant:'Blueprint',description:'T-MAX 560 Blueprint edition.'}
  };
  selectedProduct = models[key];
  document.querySelectorAll('.model-card').forEach(card => card.classList.toggle('active', card.dataset.model === key));
  document.querySelector('#product-image').src = selectedProduct.image;
  document.querySelector('#product-image').alt = selectedProduct.name;
  document.querySelector('#summary-image').src = selectedProduct.image;
  document.querySelector('#product-title').textContent = selectedProduct.title;
  document.querySelector('#product-description').textContent = selectedProduct.description;
  document.querySelector('#summary-name').textContent = selectedProduct.name.toUpperCase();
  updateVariant();
  document.querySelector('#product').scrollIntoView({behavior:'smooth', block:'start'});
}
document.querySelectorAll('.model-card').forEach(card => card.addEventListener('click', () => selectModel(card.dataset.model)));

function updateDelivery() {
  const selected = wilayaSelect.options[wilayaSelect.selectedIndex];
  const type = document.querySelector('#delivery').value;
  const raw = type === 'home' ? selected?.dataset.home : selected?.dataset.stop;
  const delivery = raw ? Number(raw) : 0;
  document.querySelector('#delivery-label').textContent = type === 'home' ? 'Home delivery' : 'Stop desk delivery';
  document.querySelector('#delivery-price').textContent = raw ? priceFormat(delivery) : '-';
  document.querySelector('#grand-total').textContent = priceFormat(productPrice + delivery);
  return raw ? delivery : null;
}
function updateCommunes() {
  const code = wilayaSelect.options[wilayaSelect.selectedIndex]?.dataset.code;
  communeSelect.innerHTML = '';
  const placeholder = document.createElement('option'); placeholder.value = ''; placeholder.textContent = code ? 'Choose your commune' : 'Choose your wilaya first'; communeSelect.append(placeholder);
  const communes = communesByWilaya[code] || [];
  communes.forEach(name => { const option = document.createElement('option'); option.value = name; option.textContent = name; communeSelect.append(option); });
  communeSelect.disabled = !code || !communes.length;
}
async function loadCommunes() {
  try {
    const response = await fetch(communesUrl);
    if (!response.ok) throw new Error('Unable to load communes');
    const records = await response.json();
    communesByWilaya = records.reduce((result, record) => { const code = String(Number(record.wilaya_code)); (result[code] ||= []).push(record.commune_name_ascii); return result; }, {});
    Object.values(communesByWilaya).forEach(list => list.sort((a,b) => a.localeCompare(b, 'fr')));
    updateCommunes();
  } catch (error) {
    communeSelect.innerHTML = '<option value="">Communes unavailable - refresh the page</option>';
  }
}
let leadFired = false;
document.querySelector('#order-form').addEventListener('input', () => {
  if (leadFired) return;
  leadFired = true;
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', {
      content_name: selectedProduct.name,
      currency: 'DZD',
      value: productPrice
    });
  }
}, { once: false });
document.querySelector('#sizes').addEventListener('click', event => { if (event.target.tagName !== 'BUTTON') return; document.querySelectorAll('#sizes button').forEach(button => button.classList.remove('active')); event.target.classList.add('active'); chosenSize = event.target.dataset.size; updateVariant(); });
wilayaSelect.addEventListener('change', () => { updateDelivery(); updateCommunes(); });
document.querySelector('#delivery').addEventListener('change', updateDelivery);
loadCommunes();

document.querySelector('#order-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const error = document.querySelector('#form-error');
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton.disabled) return;
  error.classList.remove('form-success');
  if (!form.checkValidity()) { error.textContent = 'Please complete all required fields.'; form.reportValidity(); return; }
  const delivery = updateDelivery();
  if (delivery === null) { error.textContent = 'This delivery method is unavailable for that wilaya. Please choose home delivery.'; return; }
  const data = new FormData(form);
  const type = data.get('delivery') === 'home' ? 'Home delivery' : 'Stop desk';
  const order = { product:selectedProduct.name, model:selectedProduct.variant, size:chosenSize, productPrice, deliveryType:type, deliveryPrice:delivery, total:productPrice + delivery, firstName:data.get('firstName'), lastName:data.get('lastName'), phone:data.get('phone'), wilaya:data.get('wilaya'), commune:data.get('commune') };
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.textContent = 'CONFIRMING...';
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const sendOrder = fetch(googleSheetsEndpoint, {method:'POST', mode:'no-cors', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(order)});
  Promise.all([sendOrder, wait(3000)])
    .then(() => {
      if (typeof fbq === 'function') {
        fbq('track', 'Purchase', {
          value: order.total,
          currency: 'DZD',
          content_name: order.product,
          content_type: 'product'
        });
      }
      form.reset(); updateDelivery(); updateCommunes();
      document.querySelector('#order-confirmation-overlay').classList.add('visible');
    })
    .catch(() => { error.textContent = 'Unable to send the order. Please try again.'; submitButton.disabled = false; submitButton.innerHTML = originalButtonText; });
});
document.querySelector('#order-confirmation-overlay').addEventListener('click', function () {
  this.classList.remove('visible');
  const submitButton = document.querySelector('#order-form button[type="submit"]');
  submitButton.disabled = false;
  submitButton.innerHTML = 'CONFIRMER LA COMMANDE <span>→</span>';
});
