// --- DATABASE PRODUK ---
const products = [
    {
        id: 1,
        name: "[ sᴄʀɪᴘᴛ ʙᴏᴛ ᴡᴀ ᴍᴅ ]",
        variants: [
            { price: 30000, features: ["Free Req Nama/No/Owner/Logo", "Get Enc Script", "Free Req 2 Fiture Bebas"] },
            { price: 50000, features: ["Get No Enc & Enc", "Prefix Menu", "Panel Unli 1 Bulan", "5 Fitur Bebas"] }
        ]
    },
    {
        id: 2,
        name: "[ sᴄʀɪᴘᴛ ʙᴜɢ ᴠɪᴀ ᴛᴇʟᴇɢʀᴀᴍ ]",
        variants: [{ price: 30000, features: ["Get 1 Function Bug Random", "Enc & No Enc Script", "Free Req ID Bot/Owner"] }]
    },
    {
        id: 3,
        name: "[ ᴀᴘᴋ ʙᴜɢ ]",
        variants: [{ price: 110000, features: ["Get 5 Fiture Special", "Chat Global", "Access Bot Telegram", "NO ENC"] }]
    },
    {
        id: 4,
        name: "[ ᴡᴇʙsɪᴛᴇ ᴘᴏʀᴛᴏғᴏʟɪᴏ ]",
        variants: [{ price: 20000, features: ["Anti DDoS", "Free Subdomain", "Landing Page", "Responsif"] }]
    },
    {
        id: 5,
        name: "[ ᴡᴇʙsɪᴛᴇ sᴛᴏʀᴇ ]",
        variants: [{ price: 300000, features: ["Modern UI", "Payment Integration", "Admin Panel", "Free Revisi"] }]
    },
    {
        id: 6,
        name: "[ ᴡᴇʙsɪᴛᴇ ᴘᴀʏᴍᴇɴᴛ ]",
        variants: [{ price: 50000, features: ["Sistem Manual", "Invoice Form", "Notif Otomatis"] }]
    }
];

// --- APP STATE ---
let cart = [];
let currentView = 'home';
let paymentTimer = null;
const OWNER_PIN = "1945201011121314";

// --- INITIALIZATION ---
window.onload = () => {
    lucide.createIcons();
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        renderProducts();
    }, 6000);
};

// --- NAVIGATION ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    currentView = viewId;
}

// --- RENDER PRODUCTS ---
function renderProducts() {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    
    products.forEach(p => {
        p.variants.forEach((v, idx) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <h3>${p.name} ${p.variants.length > 1 ? '(V'+(idx+1)+')' : ''}</h3>
                <div class="price-box">Rp${v.price.toLocaleString()}</div>
                <ul class="features">
                    ${v.features.map(f => `<li>➥ ${f}</li>`).join('')}
                </ul>
                <div class="btn-group">
                    <button class="btn-add" onclick="addToCart('${p.name}', ${v.price})">Keranjang</button>
                    <button class="btn-buy" onclick="initiatePayment('${p.name}', ${v.price})">Buy Now</button>
                </div>
            `;
            container.appendChild(card);
        });
    });
}

// --- CART LOGIC ---
function addToCart(name, price) {
    cart.push({ name, price, id: Date.now() });
    updateCart();
}

function updateCart() {
    document.getElementById('cart-count').innerText = cart.length;
    const itemsContainer = document.getElementById('cart-items');
    let total = 0;
    
    itemsContainer.innerHTML = cart.map(item => {
        total += item.price;
        return `<div class="cart-item">
            <span>${item.name}</span>
            <span>Rp${item.price.toLocaleString()}</span>
        </div>`;
    }).join('');
    
    document.getElementById('cart-total').innerText = `Rp${total.toLocaleString()}`;
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('active');
}

// --- PAYMENT LOGIC ---
function initiatePayment(name, price) {
    showView('payment');
    const details = document.getElementById('payment-details');
    details.innerHTML = `<h4>Produk: ${name}</h4><p>Total: Rp${price.toLocaleString()}</p>`;
    
    let timeLeft = 300;
    const timerElem = document.getElementById('timer');
    
    if(paymentTimer) clearInterval(paymentTimer);
    
    paymentTimer = setInterval(() => {
        let mins = Math.floor(timeLeft / 60);
        let secs = timeLeft % 60;
        timerElem.innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        
        if(timeLeft <= 0) {
            clearInterval(paymentTimer);
            alert("Waktu habis! Silakan pesan ulang.");
            showView('home');
        }
        timeLeft--;
    }, 1000);

    // Save current for confirmation
    window.lastOrder = { name, price };
}

function confirmPayment() {
    const order = window.lastOrder;
    const text = `Halo Owner, saya ingin konfirmasi pembayaran:\n\nProduk: ${order.name}\nHarga: Rp${order.price.toLocaleString()}\n\nBerikut Bukti Transfer saya: (Lampirkan SS)`;
    window.open(`https://wa.me/6281399649577?text=${encodeURIComponent(text)}`);
}

// --- OWNER PANEL ---
function openPinModal() { document.getElementById('pin-modal').style.display = 'flex'; }
function closePinModal() { document.getElementById('pin-modal').style.display = 'none'; }

function verifyPin() {
    const pin = document.getElementById('pin-input').value;
    if(pin === OWNER_PIN) {
        closePinModal();
        showView('owner');
    } else {
        alert("PIN Salah!");
    }
}

function broadcastInfo() {
    const val = document.getElementById('info-input').value;
    if(!val) return;
    const list = document.getElementById('announcement-list');
    const div = document.createElement('div');
    div.className = 'ann-item';
    div.innerHTML = `<small>OWNER • ${new Date().toLocaleDateString()}</small><p>${val}</p>`;
    list.prepend(div);
    alert("Informasi berhasil dikirim!");
    document.getElementById('info-input').value = "";
}
