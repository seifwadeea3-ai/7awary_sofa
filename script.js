let currentUser = { username: "", rank: "None", coins: 0, messages: 0, isAdmin: false, badges: [], timeLeft: 3600 };
let groups = [{ id: 1, name: "عام", icon: "💬", active: true }];
const shopItems = [
    { em: "👑", name: "تاج الملك", price: 50000 },
    { em: "🦁", name: "قلب الأسد", price: 20000 },
    { em: "💎", name: "الألماسة", price: 100000 },
    { em: "🔥", name: "المتفاعل", price: 5000 }
];

function attemptLogin() {
    const name = document.getElementById('loginName').value.trim();
    const pass = document.getElementById('loginPass').value;

    if (name === "its_sofa" && pass === "s1e2i3f4#") {
        currentUser = { ...currentUser, username: "its_sofa", rank: "Admin", coins: 500000, isAdmin: true, badges: ["🛡️", "👑", "💎"] };
        document.getElementById('userNameDisplay').classList.add('admin-name-style');
        document.getElementById('adminBadge').style.display = 'block';
        document.getElementById('adminTab').style.display = 'block';
    } else {
        currentUser.username = name || "User" + Math.floor(Math.random()*100);
    }
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    updateUI();
    renderShop();
}

function updateUI() {
    document.getElementById('userNameDisplay').innerText = currentUser.username;
    document.getElementById('coinDisplay').innerText = currentUser.coins.toLocaleString();
    
    // تحديث صف الأوسمة في الحساب الشخصي
    const badgeRow = document.getElementById('userBadgesRow');
    badgeRow.innerHTML = currentUser.badges.map(b => `<span class="badge-item">${b}</span>`).join('');

    let lvl = Math.floor(currentUser.messages / 100);
    document.getElementById('lvlVal').innerText = lvl > 10 ? 10 : lvl;
    document.getElementById('lvlBar').style.width = (lvl * 10) + "%";
}

function renderShop() {
    const grid = document.getElementById('shopGrid');
    grid.innerHTML = shopItems.map(item => `
        <div class="shop-item">
            <span>${item.em}</span>
            <p>${item.name}</p>
            <button onclick="buyBadge('${item.em}', ${item.price})">${item.price.toLocaleString()}</button>
        </div>
    `).join('');
}

function buyBadge(em, price) {
    if (currentUser.badges.includes(em)) return alert("تملك هذا الوسام!");
    if (currentUser.coins < price) return alert("الرصيد غير كافٍ!");
    
    currentUser.coins -= price;
    currentUser.badges.push(em);
    updateUI();
    alert("تم شراء الوسام وظهوره في حسابك!");
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input.value.trim()) return;
    const chatBox = document.getElementById('chatBox');
    const msg = document.createElement('div');
    msg.className = `msg-bubble ${currentUser.isAdmin ? 'msg-admin' : ''}`;
    // عرض الأوسمة بجانب الاسم في الشات أيضاً
    const myBadges = currentUser.badges.join('');
    msg.innerHTML = `<small>${myBadges}</small> <b>${currentUser.username}:</b> ${input.value}`;
    chatBox.appendChild(msg);
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
    currentUser.messages += 10;
    updateUI();
}

function openCreateGroupModal() {
    if (!currentUser.isAdmin && currentUser.coins < 30000) return alert("تحتاج 30,000 كوينز!");
    let n = prompt("اسم الجروب:");
    if (n) {
        if (!currentUser.isAdmin) currentUser.coins -= 30000;
        groups.push({ id: Date.now(), name: n, icon: "🔥", active: true });
        renderGroups();
        updateUI();
    }
}

function renderGroups() {
    const grid = document.getElementById('groupsGrid');
    grid.innerHTML = groups.map(g => `
        <div class="group-card">
            <span>${g.icon}</span>
            <h4>${g.name}</h4>
            <button class="btn-main" onclick="alert('انضممت')">دخول</button>
        </div>
    `).join('');
}

function switchView(v) {
    document.querySelectorAll('.view-panel').forEach(p => p.style.display = 'none');
    document.getElementById('view' + v.charAt(0).toUpperCase() + v.slice(1)).style.display = 'block';
    if(v === 'groups') renderGroups();
}

function timerLogic() {
    currentUser.timeLeft--;
    if(currentUser.timeLeft <= 0) {
        currentUser.coins += currentUser.isAdmin ? 5000 : 1000;
        currentUser.timeLeft = 3600;
        updateUI();
    }
}
