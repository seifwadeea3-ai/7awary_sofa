// 1. إعدادات النظام والرتب (Configuration)
const RANK_SETTINGS = {
    "None": { label: "بدون رتبة", color: "#d3d3d3", reward: 1000, price: 0 },
    "Bronze": { label: "برونزي", color: "#2ecc71", reward: 1000, price: 3000 },
    "Silver": { label: "فضي", color: "#3498db", reward: 2000, price: 8000 },
    "Gold": { label: "ذهبي", color: "#f1c40f", reward: 3000, price: 20000 },
    "Admin": { label: "المشرف العام", color: "#000000", reward: 5000, price: Infinity }
};

let currentUser = {
    username: "",
    rank: "None",
    coins: 0,
    messages: 0,
    isAdmin: false,
    isGuest: false,
    timeLeft: 3600,
    isClaimReady: false
};

let groups = [
    { id: 1, name: "عشاق البرمجة", icon: "💻", active: true, owner: "its_sofa" },
    { id: 2, name: "سيف تيم", icon: "🔥", active: true, owner: "its_sofa" }
];

// 2. نظام الدخول المطور
function attemptLogin() {
    const name = document.getElementById('loginName').value.trim();
    const pass = document.getElementById('loginPass').value;

    if (name === "its_sofa" && pass === "s1e2i3f4#") {
        currentUser = {
            ...currentUser,
            username: "its_sofa",
            rank: "Admin",
            coins: 500000,
            isAdmin: true,
            isGuest: false
        };
        applyAdminStyle();
    } else if (name.toLowerCase().includes("guest") || name === "") {
        currentUser.username = name || "زائر_" + Math.floor(Math.random() * 1000);
        currentUser.isGuest = true;
        currentUser.rank = "None";
        currentUser.coins = 0;
    } else {
        currentUser.username = name;
        currentUser.rank = "None";
        currentUser.isGuest = false;
        currentUser.coins = 1000; // رصيد ترحيبي
    }

    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    
    startSystem();
}

function applyAdminStyle() {
    const nameDisplay = document.getElementById('userNameDisplay');
    nameDisplay.style.color = "#000000"; 
    nameDisplay.style.background = "#ffffff"; 
    nameDisplay.style.padding = "2px 10px";
    nameDisplay.style.borderRadius = "5px";
    document.getElementById('adminTab').style.display = 'block';
}

// 3. نظام الكوينز والمكافآت اليدوي
function timerLogic() {
    if (currentUser.timeLeft > 0) {
        currentUser.timeLeft--;
        updateTimerUI();
    } else {
        currentUser.isClaimReady = true;
        document.getElementById('countdown').innerText = "جاهز للاستلام! 🎁";
        document.getElementById('countdown').style.color = "#2ecc71";
        document.getElementById('claimBtn').disabled = false;
        document.getElementById('rewardDot').style.display = "block"; // نقطة تنبيه في القائمة
    }
}

function claimCoins() {
    if (!currentUser.isClaimReady) return;

    const rewardAmount = RANK_SETTINGS[currentUser.rank].reward;
    currentUser.coins += rewardAmount;
    currentUser.timeLeft = 3600;
    currentUser.isClaimReady = false;
    
    document.getElementById('claimBtn').disabled = true;
    document.getElementById('rewardDot').style.display = "none";
    
    alert(`🎉 تم استلام ${rewardAmount.toLocaleString()} كوينز بنجاح!`);
    updateUI();
    closeModal('rewardModal');
}

// 4. نظام الشات المطور (إرسال، منشن، ودعم الـ Enter)
function handleKeyPress(e) {
    if (e.key === "Enter") sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    let text = input.value.trim();
    if (!text) return;

    // معالجة المنشن
    if (text.includes("@")) {
        text = text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
    }

    const chatBox = document.getElementById('chatBox');
    const msg = document.createElement('div');
    msg.className = `msg-bubble ${currentUser.isAdmin ? 'msg-admin' : ''}`;
    
    const rankColor = RANK_SETTINGS[currentUser.rank].color;
    const time = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    msg.innerHTML = `
        <div class="msg-content">
            <b style="color:${rankColor}">${currentUser.username}:</b> 
            <span>${text}</span>
        </div>
        <small class="msg-time">${time}</small>
    `;
    
    chatBox.appendChild(msg);
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
    
    currentUser.messages += 1;
    updateUI();
}

// 5. نظام التحويل والضرائب
function transferCoins(receiverName, amount) {
    if (currentUser.isGuest) return alert("الزوار لا يمكنهم التحويل!");
    
    const tax = Math.floor(amount * 0.15);
    const totalCost = amount + tax;

    if (currentUser.coins < totalCost) {
        return alert(`رصيدك غير كافٍ. تحتاج ${totalCost} كوينز (تشمل الضريبة 15%)`);
    }

    currentUser.coins -= totalCost;
    alert(`تم تحويل ${amount} كوينز إلى ${receiverName}.\nخصم ضريبة تحويل للمشرف: ${tax}`);
    updateUI();
}

// 6. تحديث الواجهة والتنقل
function updateUI() {
    const rankInfo = RANK_SETTINGS[currentUser.rank];
    document.getElementById('userNameDisplay').innerText = currentUser.username;
    document.getElementById('userRankBadge').innerText = rankInfo.label;
    document.getElementById('userRankBadge').style.background = rankInfo.color;
    document.getElementById('coinDisplay').innerText = currentUser.coins.toLocaleString();
    document.getElementById('earnRate').innerText = rankInfo.reward;
}

function updateTimerUI() {
    let m = Math.floor(currentUser.timeLeft / 60);
    let s = currentUser.timeLeft % 60;
    document.getElementById('countdown').innerText = `${m}:${s < 10 ? '0'+s : s}`;
}

function switchView(view) {
    document.querySelectorAll('.view-panel').forEach(p => p.style.display = 'none');
    document.getElementById('view' + view.charAt(0).toUpperCase() + view.slice(1)).style.display = 'block';
    
    // تغيير حالة النشاط في القائمة
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// 7. تشغيل النظام عند الدخول
function startSystem() {
    updateUI();
    setInterval(timerLogic, 1000);
}

// دوال فتح النوافذ المنبثقة
function openRewards() { document.getElementById('rewardModal').style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function toggleExtraMenu() { alert("🎁 قريباً: متجر الهدايا السريعة!"); }
