// ==================== إعدادات النظام ====================
const CONFIG = {
    ranks: {
        "None":   { color: "#d3d3d3", rate: 1000, price: 0 },
        "Bronze": { color: "#cd7f32", rate: 1000, price: 3000 },
        "Silver": { color: "#3498db", rate: 2000, price: 8000 },
        "Gold":   { color: "#f1c40f", rate: 3000, price: 20000 },
        "Admin":  { color: "#000000", rate: 5000, price: 0 }
    },
    adminName: "its_sofa",
    adminPass: "s1e2i3f4#",
    taxRate: 0.15 // 15%
};

// ==================== حالة المستخدم ====================
let userState = {
    username: "Guest",
    rank: "None",
    coins: 0,
    isAdmin: false,
    timer: 3600, // 60 دقيقة
    claimReady: false
};

// بيانات وهمية للتجربة
let groups = [
    { id: 1, name: "مجتمع المطورين", owner: "its_sofa" },
    { id: 2, name: "سوالف عامة", owner: "Guest" }
];

let onlineUsers = ["أحمد", "سارة", "خالد", "مدير النظام"];

// ==================== 1. نظام الدخول ====================
function attemptLogin() {
    const name = document.getElementById('loginName').value.trim();
    const pass = document.getElementById('loginPass').value;

    if (!name) return alert("الرجاء إدخال اسم المستخدم");

    if (name === CONFIG.adminName && pass === CONFIG.adminPass) {
        userState.username = CONFIG.adminName;
        userState.rank = "Admin";
        userState.coins = 500000;
        userState.isAdmin = true;
    } else {
        userState.username = name;
        userState.rank = "None";
        userState.coins = 500; // رصيد بداية
        userState.isAdmin = false;
    }

    startApp();
}

function loginAsGuest() {
    userState.username = "زائر_" + Math.floor(Math.random() * 999);
    userState.rank = "None";
    userState.coins = 0;
    startApp();
}

function startApp() {
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('dashboard').style.display = 'grid'; // تشغيل الشبكة
    
    // إعداد واجهة المشرف
    if (userState.isAdmin) {
        document.getElementById('adminTab').style.display = 'block';
        document.getElementById('userNameDisplay').style.background = "white";
        document.getElementById('userNameDisplay').style.color = "black";
        document.getElementById('userNameDisplay').style.borderRadius = "5px";
        document.getElementById('userNameDisplay').style.padding = "2px 8px";
    }

    updateUI();
    renderGroups();
    renderOnline();
    setInterval(timerLoop, 1000); // بدء العداد
}

// ==================== 2. نظام الاقتصاد ====================
function timerLoop() {
    if (userState.timer > 0) {
        userState.timer--;
        let m = Math.floor(userState.timer / 60);
        let s = userState.timer % 60;
        document.getElementById('countdown').innerText = `${m}:${s < 10 ? '0'+s : s}`;
    } else {
        userState.claimReady = true;
        document.getElementById('countdown').innerText = "جاهز!";
        document.getElementById('countdown').style.color = "#2ecc71";
        document.getElementById('claimBtn').disabled = false;
        document.getElementById('rewardDot').style.display = "inline-block";
    }
}

function claimCoins() {
    if (!userState.claimReady) return;
    
    let reward = CONFIG.ranks[userState.rank].rate;
    userState.coins += reward;
    userState.timer = 3600;
    userState.claimReady = false;
    
    document.getElementById('claimBtn').disabled = true;
    document.getElementById('rewardDot').style.display = "none";
    document.getElementById('countdown').style.color = "white";
    
    closeModal('rewardsModal');
    alert(`🎉 تم استلام ${reward} كوينز!`);
    updateUI();
}

function buyRank(rankName) {
    let price = CONFIG.ranks[rankName].price;
    
    if (userState.coins >= price) {
        if (confirm(`هل أنت متأكد من شراء رتبة ${rankName} بسعر ${price}؟`)) {
            userState.coins -= price;
            userState.rank = rankName;
            alert(`مبروك! أصبحت الآن برتبة ${rankName} 🌟`);
            closeModal('storeModal');
            updateUI();
        }
    } else {
        alert(`رصيدك غير كافٍ. تحتاج ${price} كوينز.`);
    }
}

// ==================== 3. نظام الشات ====================
function handleEnter(e) {
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
    const msgDiv = document.createElement('div');
    const isAdmin = userState.isAdmin;
    
    msgDiv.className = `msg-bubble ${isAdmin ? 'admin' : ''}`;
    
    // لون الاسم حسب الرتبة
    const nameColor = CONFIG.ranks[userState.rank].color;
    const time = new Date().toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'});

    msgDiv.innerHTML = `
        <div class="msg-header">
            <span style="color: ${nameColor}; font-weight:bold;">${userState.username}</span>
            <span class="msg-time">${time}</span>
        </div>
        <div class="msg-body">${text}</div>
    `;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = "";
}

// ==================== 4. الجروبات والواجهة ====================
function createGroup() {
    const cost = 30000;
    if (userState.coins >= cost) {
        if (confirm("تكلفة إنشاء الجروب 30,000 كوينز. موافق؟")) {
            userState.coins -= cost;
            let groupName = prompt("اسم الجروب:");
            if (groupName) {
                groups.push({ id: Date.now(), name: groupName, owner: userState.username });
                renderGroups();
                updateUI();
            }
        }
    } else {
        alert("تحتاج 30,000 كوينز لإنشاء جروب!");
    }
}

function renderGroups() {
    const grid = document.getElementById('groupsGrid');
    grid.innerHTML = "";
    groups.forEach(g => {
        grid.innerHTML += `
            <div class="group-card">
                <div style="font-size:30px; margin-bottom:10px;">👥</div>
                <h3>${g.name}</h3>
                <small>المالك: ${g.owner}</small>
                <br><br>
                <button class="btn-primary" style="padding:5px 20px;">دخول</button>
            </div>
        `;
    });
}

function renderOnline() {
    const list = document.getElementById('onlineList');
    list.innerHTML = "";
    onlineUsers.forEach(u => {
        list.innerHTML += `<div style="padding:5px; border-bottom:1px solid #333;">🟢 ${u}</div>`;
    });
    document.getElementById('onlineCount').innerText = onlineUsers.length;
}

// أدوات مساعدة
function updateUI() {
    document.getElementById('userNameDisplay').innerText = userState.username;
    document.getElementById('coinDisplay').innerText = userState.coins.toLocaleString();
    
    const rankData = CONFIG.ranks[userState.rank];
    document.getElementById('rankBadge').innerText = userState.rank;
    document.getElementById('rankBadge').style.color = rankData.color;
    document.getElementById('rateDisplay').innerText = rankData.rate;
}

function switchView(viewName) {
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
    document.getElementById('view' + viewName.charAt(0).toUpperCase() + viewName.slice(1)).style.display = 'flex';
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function toggleQuickMenu() { alert("قائمة الهدايا السريعة (قريباً)"); }

// Admin Functions
function adminAction(action) {
    if(!userState.isAdmin) return;
    alert("تم تنفيذ الأمر الإداري: " + action);
}
