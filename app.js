var cart = [];
var avgPrice = 149;

var emojiMap = {
    1: '💪',
    2: '🧠',
    3: '🌅',
    4: '🌱',
    5: '🌶️',
    6: '📦'
};

function addToCart(id, name, price) {
    var found = false;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart[i].qty = cart[i].qty + 1;
            found = true;
        }
    }
    if (!found) {
        cart.push({ id: id, name: name, price: price, qty: 1 });
    }
    refreshCart();
    openCart();
    showToast(name + ' added to cart! ✅');
}

function removeItem(id) {
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            cart.splice(i, 1);
            break;
        }
    }
    refreshCart();
}

function getTotalQty() {
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total = total + cart[i].qty;
    }
    return total;
}

function getSubtotal() {
    var sub = 0;
    for (var i = 0; i < cart.length; i++) {
        sub = sub + (cart[i].price * cart[i].qty);
    }
    return sub;
}

function refreshCart() {
    document.getElementById('cartCount').textContent = getTotalQty();

    var itemsDiv = document.getElementById('cartItems');
    var emptyDiv = document.getElementById('cartEmpty');
    var bottomDiv = document.getElementById('cartBottom');

    var oldRows = itemsDiv.querySelectorAll('.cart-item-row');
    for (var i = 0; i < oldRows.length; i++) {
        oldRows[i].remove();
    }

    if (cart.length == 0) {
        emptyDiv.style.display = 'block';
        bottomDiv.style.display = 'none';
        return;
    }

    emptyDiv.style.display = 'none';
    bottomDiv.style.display = 'block';

    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = '<div class="cart-item-icon">' + (emojiMap[item.id] || '🥜') + '</div>' +
            '<div style="flex:1;">' +
                '<div style="font-size:14px; font-weight:700;">' + item.name + ' x' + item.qty + '</div>' +
                '<div style="font-size:13px; color:#16a34a; font-weight:700;">Rs.' + (item.price * item.qty) + '</div>' +
            '</div>' +
            '<button onclick="removeItem(' + item.id + ')" style="background:#fee2e2; border:none; color:#ef4444; width:26px; height:26px; border-radius:50%; cursor:pointer; font-size:12px;">✕</button>';
        itemsDiv.appendChild(row);
    }

    var sub = getSubtotal();
    var qty = getTotalQty();
    var freeShipping = qty >= 3;
    var discount = freeShipping ? Math.round(sub * 0.10) : 0;
    var delivery = freeShipping ? 0 : 60;
    var total = sub - discount + delivery;

    document.getElementById('cartSubtotal').textContent = 'Rs.' + sub;
    document.getElementById('cartTotal').textContent = 'Rs.' + total;

    var noteEl = document.getElementById('freeDelivNote');
    if (freeShipping) {
        noteEl.textContent = '🎉 Free Delivery + Rs.' + discount + ' discount applied!';
        noteEl.style.display = 'block';
    } else {
        noteEl.style.display = 'none';
    }
}

function openCart() {
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartOverlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').style.display = 'none';
    document.body.style.overflow = '';
}

document.getElementById('cartBtn').onclick = function() {
    openCart();
};

function checkout() {
    if (cart.length == 0) {
        showToast('Your cart is empty!');
        return;
    }
    try {
        localStorage.setItem('fitbiteCart', JSON.stringify(cart));
    } catch(e) {}
    closeCart();
    window.location.href = 'checkout.html';
}

function updateCalc(packs) {
    var btns = document.querySelectorAll('.pack-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].className = 'pack-btn';
    }
    event.target.className = 'pack-btn active-pack';

    var sub = packs * avgPrice;
    var freeShip = packs >= 3;
    var discount = freeShip ? Math.round(sub * 0.10) : 0;
    var delivery = freeShip ? 0 : 60;
    var final = sub - discount + delivery;
    var saved = discount + (freeShip ? 60 : 0);

    document.getElementById('subtotal').textContent = 'Rs.' + sub;
    document.getElementById('finalPrice').textContent = 'Rs.' + final;

    if (freeShip) {
        document.getElementById('totalSave').textContent = 'Rs.' + saved + ' + Free Delivery!';
        document.getElementById('unlockMsg').style.display = 'block';
    } else {
        document.getElementById('totalSave').textContent = 'Rs.' + discount;
        document.getElementById('unlockMsg').style.display = 'none';
    }

    var percent = Math.min((packs / 5) * 100, 100);
    document.getElementById('progressFill').style.width = percent + '%';
}

var responses = {
    late: {
        words: ['late', 'night', '11', '12', 'midnight', 'exam', 'stay up'],
        reply: '🌙 Late night studying? Try the <b>FitBite 5-in-1 Seed Mix (Rs.99)</b> – light and rich in omega-3 for mental clarity. Perfect for midnight sessions!',
        product: '🌱 Seed Mix – Rs.99'
    },
    workout: {
        words: ['gym', 'workout', 'exercise', 'protein', 'muscle'],
        reply: '💪 Post-workout your muscles need protein fast! The <b>Protein Bar Pack (Rs.249)</b> gives you 20g protein per bar. Chocolate fudge is the best flavor!',
        product: '💪 Protein Bar Pack – Rs.249'
    },
    budget: {
        words: ['budget', 'cheap', '150', 'broke', 'affordable'],
        reply: '💸 The <b>Seed Mix at just Rs.99</b> is amazing value! Order 3 packs to unlock free delivery + 10% off!',
        product: '🌱 Seed Mix – Rs.99'
    },
    energy: {
        words: ['tired', 'energy', 'afternoon', 'sleepy', 'fatigue'],
        reply: '⚡ 3 PM slump? The <b>Breakfast Bars Pack (Rs.199)</b> gives you steady energy for 2-3 hours. No crash!',
        product: '🌅 Breakfast Bars – Rs.199'
    },
    study: {
        words: ['study', 'focus', 'brain', 'memory', 'assignment'],
        reply: '📚 The <b>Brain Fuel Mix (Rs.149)</b> is perfect! Almonds boost memory and omega-3 sharpens focus during long sessions.',
        product: '🧠 Brain Fuel Mix – Rs.149'
    }
};

var defaultReply = {
    reply: '🌟 I\'d suggest the <b>Weekly Snack Box (Rs.799)</b> – all 6 packs, free delivery and 10% off! Tell me more about your routine and I can narrow it down.',
    product: '📦 Weekly Snack Box – Rs.799'
};

function quickMsg(text) {
    document.getElementById('chatInput').value = text;
    sendMsg();
}

function sendMsg() {
    var input = document.getElementById('chatInput');
    var text = input.value.trim();
    if (!text) return;
    addChatMessage(text, 'user');
    input.value = '';

    var typingId = 'typing_' + Date.now();
    var tDiv = document.createElement('div');
    tDiv.className = 'bot-msg';
    tDiv.id = typingId;
    tDiv.innerHTML = '<div class="msg-bubble" style="color:#aaa;">● ● ●</div>';
    document.getElementById('chatMessages').appendChild(tDiv);
    document.getElementById('chatMessages').scrollTop = 9999;

    setTimeout(function() {
        var el = document.getElementById(typingId);
        if (el) el.remove();
        var r = getAIReply(text);
        addChatMessage(r.reply, 'bot', true);
        if (r.product) {
            var pDiv = document.createElement('div');
            pDiv.className = 'bot-msg';
            pDiv.innerHTML = '<div class="msg-bubble" style="background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; font-weight:700; cursor:pointer;" onclick="document.getElementById(\'products\').scrollIntoView({behavior:\'smooth\'})">👆 ' + r.product + ' – tap to view!</div>';
            document.getElementById('chatMessages').appendChild(pDiv);
            document.getElementById('chatMessages').scrollTop = 9999;
        }
    }, 900 + Math.random() * 400);
}

function getAIReply(text) {
    var lower = text.toLowerCase();
    var keys = Object.keys(responses);
    for (var i = 0; i < keys.length; i++) {
        var r = responses[keys[i]];
        for (var j = 0; j < r.words.length; j++) {
            if (lower.indexOf(r.words[j]) !== -1) {
                return r;
            }
        }
    }
    return defaultReply;
}

function addChatMessage(text, type, isHTML) {
    var container = document.getElementById('chatMessages');
    var div = document.createElement('div');
    div.className = type + '-msg';
    var now = new Date();
    var time = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    if (isHTML) {
        div.innerHTML = '<div class="msg-bubble">' + text + '</div><div class="msg-time">' + time + '</div>';
    } else {
        div.innerHTML = '<div class="msg-bubble">' + text + '</div><div class="msg-time">' + time + '</div>';
    }
    container.appendChild(div);
    container.scrollTop = 9999;
}

function toggleChat() {
    var panel = document.getElementById('aiPanel');
    var icon = document.getElementById('bubbleIcon');
    var closeX = document.getElementById('bubbleClose');
    var badge = document.getElementById('bubbleBadge');

    if (panel.style.display == 'none' || panel.style.display == '') {
        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        icon.style.display = 'none';
        closeX.style.display = 'block';
        if (badge) badge.style.display = 'none';
        setTimeout(function() {
            document.getElementById('chatInput').focus();
        }, 200);
    } else {
        panel.style.display = 'none';
        icon.style.display = 'block';
        closeX.style.display = 'none';
    }
}

function toggleMenu() {
    var nav = document.getElementById('navLinks');
    if (nav.classList.contains('mobile-open')) {
        nav.classList.remove('mobile-open');
    } else {
        nav.classList.add('mobile-open');
    }
}

var PLAN_DATA = {
    Starter: { label: '🌱 Starter Plan', amount: 2999, emoji: '🌱' },
    Pro:     { label: '⚡ Pro Plan',     amount: 4999, emoji: '⚡' },
    Elite:   { label: '👑 Elite Plan',   amount: 7999, emoji: '👑' }
};

function openSubscribeModal(plan) {
    document.getElementById('subscribeModal').classList.add('open');
    document.body.style.overflow = 'hidden';
    // Reset to step 1
    document.getElementById('subStep1').style.display = 'block';
    document.getElementById('subStep2').style.display = 'none';
    // Pre-select plan if provided
    if (plan) {
        var sel = document.getElementById('subPlan');
        var lbl = document.getElementById('modalPlanLabel');
        if (sel) sel.value = plan;
        if (lbl) {
            var p = PLAN_DATA[plan];
            lbl.textContent = (plan + ' Plan · Rs.' + p.amount.toLocaleString() + '/yr · Cancel anytime');
        }
    }
}

function closeSubscribeModal() {
    document.getElementById('subscribeModal').classList.remove('open');
    document.body.style.overflow = '';
}

function closeModal(e) {
    if (e.target == document.getElementById('subscribeModal')) {
        closeSubscribeModal();
    }
}

function updatePlanLabel() {
    var plan = document.getElementById('subPlan').value;
    var lbl = document.getElementById('modalPlanLabel');
    if (lbl && PLAN_DATA[plan]) {
        var p = PLAN_DATA[plan];
        lbl.textContent = plan + ' Plan · Rs.' + p.amount.toLocaleString() + '/yr · Cancel anytime';
    }
}

function submitSub(e) {
    e.preventDefault();
    var plan = document.getElementById('subPlan').value;
    var p = PLAN_DATA[plan] || PLAN_DATA['Pro'];
    var amt = p.amount;
    var upiBase = 'upi://pay?pa=fitbite@upi&pn=FitBite&am=' + amt + '&cu=INR&tn=FitBite+' + plan + '+Membership';
    var qrData = encodeURIComponent('upi://pay?pa=fitbite@upi&pn=FitBite&am=' + amt + '&cu=INR');

    // Update Step 2 content
    document.getElementById('subPlanName').textContent = p.emoji + ' ' + plan + ' Plan';
    document.getElementById('subPlanAmt').textContent = 'Rs.' + amt.toLocaleString();
    document.getElementById('subQrImg').src = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=16a34a&data=' + qrData;
    document.getElementById('phonePeLink').href = upiBase;
    document.getElementById('gpayLink').href = upiBase;
    document.getElementById('paytmLink').href = upiBase;

    // Switch to payment step
    document.getElementById('subStep1').style.display = 'none';
    document.getElementById('subStep2').style.display = 'block';
    document.querySelector('#subscribeModal .modal-box').scrollTop = 0;
}

function goBackToSubForm() {
    document.getElementById('subStep1').style.display = 'block';
    document.getElementById('subStep2').style.display = 'none';
}

function confirmMembershipPayment() {
    var name = document.getElementById('subName').value;
    var plan = document.getElementById('subPlan').value;
    closeSubscribeModal();
    showToast('🎉 Welcome ' + name + '! Your ' + plan + ' Membership is now active. First pack on its way!');
}

function subscribeNewsletter() {
    var email = document.getElementById('newsletterEmail').value.trim();
    if (!email || email.indexOf('@') == -1) {
        showToast('⚠️ Please enter a valid email!');
        return;
    }
    document.getElementById('newsletterEmail').value = '';
    showToast('🎉 You\'re in! Check inbox for 15% off coupon!');
}

var toastTimer;
function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        t.classList.remove('show');
    }, 3000);
}

window.addEventListener('scroll', function() {
    var header = document.getElementById('header');
    if (window.scrollY > 20) {
        header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key == 'Escape') {
        closeCart();
        closeSubscribeModal();
    }
});

window.onload = function() {
    updateCalc(3);

    var hour = new Date().getHours();
    var msg = '';
    if (hour >= 22 || hour < 5) {
        msg = '🌙 It\'s late! Try the <b>Seed Mix</b> – perfect for midnight study sessions.';
    } else if (hour >= 5 && hour < 11) {
        msg = '☀️ Good morning! Start with the <b>Breakfast Bars Pack</b> for a great day!';
    } else if (hour >= 14 && hour < 18) {
        msg = '😴 Afternoon slump? The <b>Protein Bar</b> will keep you sharp!';
    } else {
        msg = '🌆 Evening session? The <b>Roasted Namkeen Pack</b> is light and crunchy!';
    }

    if (msg) {
        setTimeout(function() {
            addChatMessage(msg, 'bot', true);
        }, 2500);
    }
};
