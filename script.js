// ==================== إعدادات النظام ====================
const CONFIG = {
    ranks: {
        "None":   { color: "#d3d3d3", rate: 1000, price: 0 },
        "Bronze": { color: "#cd7f32", rate: 1000, price: 3000 },
        "Silver": { color: "#3498db", rate: 2000, price: 8000 },
        "Gold":   { color: "#f1c40f", rate: 3000, price: 20000 },
        "Admin":  { color: "#ff4757", rate: 5000, price: 0 }
    },
    adminName: "its_sofa",
    adminPass: "s1e2i3f4#",
    taxRate: 0.15
};

// ==================== حالة المستخدم ====================
let userState = {
    username: "Guest",
    rank: "None",
    coins: 0,
    isAdmin: false,
    timer: 3600,
    claimReady: false
};

let groups = [
    { id: 1, name: "مجتمع المطورين", owner: "its_sofa" },
    { id: 2, name: "سوالف عامة", owner: "Guest" }
];

// الربط بالسيرفر (Firebase)
const dbMessages = database.ref('messages');

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
        userState.coins = 500;
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
    document.getElementById('dashboard').style.display = 'grid';
    
    if (userState.isAdmin) {
        document.getElementById('adminTab').style.display = 'block';
    }

    updateUI();
    renderGroups();
    listenForMessages(); // بدء الاستماع للرسائل من السيرفر
    setInterval(timerLoop, 1000);
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
        document.getElementById('claimBtn').disabled = false;
    }
}

function claimCoins() {
    if (!userState.claimReady) return;
    let reward = CONFIG.ranks[userState.rank].rate;
    userState.coins += reward;
    userState.timer = 3600;
    userState.claimReady = false;
    document.getElementById('claimBtn').disabled = true;
    closeModal('rewardsModal');
    alert(`🎉 تم استلام ${reward} كوينز!`);
    updateUI();
}

// ==================== 3. نظام الشات المدمج بالسيرفر ====================
function handleEnter(e) {
    if (e.key === "Enter") sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    let text = input.value.trim();
    if (!text) return;

    // إرسال البيانات للسيرفر ليراها الجميع
    dbMessages.push({
        username: userState.username,
        text: text,
        rank: userState.rank,
        timestamp: Date.now()
    });

    input.value = "";
}

function listenForMessages() {
    dbMessages.limitToLast(50).on('child_added', (snapshot) => {
        const data = snapshot.val();
        renderMessage(data);
    });
}

function renderMessage(data) {
    const chatBox = document.getElementById('chatBox');
    const isMe = data.username === userState.username; 
    const msgDiv = document.createElement('div');
    
    msgDiv.style = `display:flex; flex-direction:column; align-items:${isMe ? 'flex-end' : 'flex-start'}; width:100%; margin-bottom:10px;`;

    const nameColor = CONFIG.ranks[data.rank].color;
    const time = new Date(data.timestamp).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'});

    msgDiv.innerHTML = `
        <div class="msg-bubble ${data.rank === 'Admin' ? 'admin' : ''}" style="${isMe ? 'background: var(--accent); color: white;' : ''}">
            <div class="msg-header" style="pointer-events: auto;">
                <span onclick="openUserProfile('${data.username}')" style="color: ${isMe ? 'white' : nameColor}; font-weight:bold; cursor:pointer; position:relative; z-index:999;">${data.username}</span>
                <span class="msg-time" style="${isMe ? 'color: #eee' : ''}">${time}</span>
            </div>
            <div class="msg-body">${data.text}</div>
        </div>
    `;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
    
    const msgDiv = document.createElement('div');
    // إضافة كلاسات الجهة والألوان
    msgDiv.className = `msg-container ${isMe ? 'me' : 'others'}`;
    
    const nameColor = CONFIG.ranks[data.rank].color;
    const time = new Date(data.timestamp).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'});

    msgDiv.innerHTML = `
        <div class="msg-bubble">
            <div class="msg-header">
                <span onclick="openUserProfile('${data.username}')" style="color: ${nameColor}; font-weight:bold; cursor:pointer;">${data.username}</span>
                <span class="msg-time">${time}</span>
            </div>
            <div class="msg-body">${data.text}</div>
        </div>
    `;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ==================== 4. نظام الجروبات والواجهة ====================
function openUserProfile(targetUser) {
    if (targetUser === userState.username) return;
    let amount = prompt(`أدخل كمية الكوينز لتحويلها إلى ${targetUser}:`);
    if (amount && !isNaN(amount) && userState.coins >= amount) {
        userState.coins -= parseInt(amount);
        alert(`تم تحويل ${amount} كوينز بنجاح!`);
        updateUI();
    }
}

function updateUI() {
    document.getElementById('userNameDisplay').innerText = userState.username;
    document.getElementById('coinDisplay').innerText = userState.coins.toLocaleString();
    const rankData = CONFIG.ranks[userState.rank];
    document.getElementById('rankBadge').innerText = userState.rank;
    document.getElementById('rankBadge').style.color = rankData.color;
}

function renderGroups() {
    const grid = document.getElementById('groupsGrid');
    grid.innerHTML = "";
    groups.forEach(g => {
        grid.innerHTML += `
            <div class="group-card">
                <h3>${g.name}</h3>
                <small>المالك: ${g.owner}</small>
                <button class="btn-primary">دخول</button>
            </div>`;
    });
}

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

