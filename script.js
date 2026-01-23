// 1. إعدادات النظام والرتب (Data Configuration)
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
    isClaimReady: false // لا يتم إضافة الكوينز تلقائياً
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
        // حساب المشرف العام
        currentUser = {
            ...currentUser,
            username: "its_sofa",
            rank: "Admin",
            coins: 500000, // حسب المواصفات
            isAdmin: true,
            isGuest: false
        };
        applyAdminStyle();
    } else if (name.toLowerCase().includes("guest") || name === "") {
        // حساب زائر
        currentUser.username = name || "زائر_" + Math.floor(Math.random() * 1000);
        currentUser.isGuest = true;
        currentUser.rank = "None";
    } else {
        // حساب مسجل عادي
        currentUser.username = name;
        currentUser.rank = "None";
        currentUser.isGuest = false;
    }

    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    
    startSystem();
}

function applyAdminStyle() {
    const nameDisplay = document.getElementById('userNameDisplay');
    nameDisplay.style.color = "#000000"; // اسم أسود
    nameDisplay.style.background = "#ffffff"; // خلفية بيضاء لتمييزه في الثيم الأسود
    nameDisplay.style.padding = "2px 10px";
    nameDisplay.style.borderRadius = "5px";
    document.getElementById('adminBadge').style.display = 'inline-block';
    document.getElementById('adminTab').style.display = 'block';
}

// 3. نظام الكوينز والمكافآت (Manual Claim System)
function timerLogic() {
    if (currentUser.timeLeft > 0) {
        currentUser.timeLeft--;
        updateTimerUI();
    } else {
        // عند انتهاء الوقت
        currentUser.isClaimReady = true;
        document.getElementById('countdown').innerText = "جاهز للاستلام! 🎁";
        document.getElementById('countdown').style.color = "#2ecc71";
    }
}

function claimReward() {
    if (!currentUser.isClaimReady) {
        alert("انتظر انتهاء العداد التنازلي!");
        return;
    }

    const rewardAmount = RANK_SETTINGS[currentUser.rank].reward;
    currentUser.coins += rewardAmount;
    currentUser.timeLeft = 3600; // إعادة العداد لساعة
    currentUser.isClaimReady = false;
    
    alert(`تم استلام مكافأة الرتبة: ${rewardAmount} كوينز`);
    updateUI();
}

// 4. نظام تحويل الكوينز مع الضريبة (15%)
function transferCoins(receiverName, amount) {
    if (currentUser.isGuest) return alert("الزوار لا يمكنهم تحويل الكوينز!");
    
    const tax = Math.floor(amount * 0.15);
    const totalCost = amount + tax;

    if (currentUser.coins < totalCost) {
        return alert("رصيدك لا يكفي (المبلغ + 15% ضريبة)");
    }

    currentUser.coins -= totalCost;
    // برمجياً: الـ tax تذهب لحساب 'its_sofa'
    alert(`تم التحويل بنجاح! \nالمبلغ: ${amount} \nالضريبة (15%): ${tax}`);
    updateUI();
}

// 5. تحديث الواجهة (UI Rendering)
function updateUI() {
    const rankInfo = RANK_SETTINGS[currentUser.rank];
    
    document.getElementById('userNameDisplay').innerText = currentUser.username;
    document.getElementById('userNameDisplay').style.color = rankInfo.color;
    document.getElementById('rankDisplay').innerText = rankInfo.label;
    document.getElementById('rankDisplay').style.color = rankInfo.color;
    document.getElementById('coinDisplay').innerText = currentUser.coins.toLocaleString();
    document.getElementById('msgCurrent').innerText = currentUser.messages;

    // ليفل بناءً على الرسايل
    let lvl = Math.floor(currentUser.messages / 1000);
    document.getElementById('lvlVal').innerText = lvl;
    document.getElementById('lvlBar').style.width = Math.min((lvl * 10), 100) + "%";
}

function updateTimerUI() {
    let m = Math.floor(currentUser.timeLeft / 60);
    let s = currentUser.timeLeft % 60;
    document.getElementById('countdown').innerText = `${m}:${s < 10 ? '0'+s : s}`;
    document.getElementById('countdown').style.color = "white";
}

// 6. تشغيل النظام
function startSystem() {
    updateUI();
    renderGroups();
    renderOnline();
    setInterval(timerLogic, 1000);
}

// تحسين إرسال الرسائل (دعم المنشن)
function sendMessage() {
    const input = document.getElementById('chatInput');
    let text = input.value.trim();
    if (!text) return;

    if (text.includes("@")) {
        // منطق المنشن البسيط
        text = text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
    }

    const chatBox = document.getElementById('chatBox');
    const msg = document.createElement('div');
    msg.className = `msg-bubble ${currentUser.isAdmin ? 'msg-admin' : ''}`;
    
    // إظهار اللون حسب الرتبة في الشات
    const color = RANK_SETTINGS[currentUser.rank].color;
    msg.innerHTML = `<b style="color:${color}">${currentUser.username}:</b> ${text}`;
    
    chatBox.appendChild(msg);
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
    
    currentUser.messages += 1;
    updateUI();
}
