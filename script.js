// بيانات النظام
let currentUser = { username: "", rank: "None", coins: 0, messages: 0, isAdmin: false, timeLeft: 3600 };
let groups = [
    { id: 1, name: "عشاق البرمجة", icon: "💻", active: true },
    { id: 2, name: "سيف تيم", icon: "🔥", active: true }
];

// 1. تسجيل الدخول
function attemptLogin() {
    const name = document.getElementById('loginName').value.trim();
    const pass = document.getElementById('loginPass').value;

    if (name === "its_sofa" && pass === "s1e2i3f4#") {
        currentUser = { username: "its_sofa", rank: "Admin", coins: 300000, messages: 55500, isAdmin: true, timeLeft: 3600 };
        document.getElementById('userNameDisplay').classList.add('admin-name-style');
        document.getElementById('adminBadge').style.display = 'inline-block';
        document.getElementById('adminTab').style.display = 'block';
    } else {
        currentUser.username = name || "زائر";
    }

    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    updateUI();
    renderOnline();
    setInterval(timerLogic, 1000);
}

// 2. تحديث الواجهة والمستويات
function updateUI() {
    document.getElementById('userNameDisplay').innerText = currentUser.username;
    document.getElementById('coinDisplay').innerText = currentUser.coins.toLocaleString();
    document.getElementById('rankDisplay').innerText = currentUser.rank;
    document.getElementById('msgCurrent').innerText = currentUser.messages;

    let lvl = Math.floor(currentUser.messages / 1000);
    if (lvl > 10) lvl = 10;
    document.getElementById('lvlVal').innerText = lvl;
    document.getElementById('lvlBar').style.width = (lvl * 10) + "%";
}

// 3. نظام الشات
function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input.value.trim()) return;

    const chatBox = document.getElementById('chatBox');
    const msg = document.createElement('div');
    msg.className = `msg-bubble ${currentUser.isAdmin ? 'msg-admin' : ''}`;
    msg.innerHTML = `<b>${currentUser.username}:</b> ${input.value}`;
    chatBox.appendChild(msg);
    
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
    currentUser.messages += 15; // زيادة النقاط
    updateUI();
}

// 4. إدارة المجموعات (الإنشاء بـ 30 ألف)
function renderGroups() {
    const grid = document.getElementById('groupsGrid');
    grid.innerHTML = "";
    groups.forEach(g => {
        grid.innerHTML += `
            <div class="group-card ${g.active ? '' : 'group-off'}">
                <div style="font-size:30px">${g.icon}</div>
                <h4>${g.name}</h4>
                <button class="btn-main" onclick="alert('جاري الانضمام...')">${g.active ? 'دخول' : 'معطل'}</button>
                ${currentUser.isAdmin ? `
                    <div style="margin-top:10px">
                        <button onclick="toggleGroup(${g.id})" style="background:orange; border:none; padding:5px; cursor:pointer">تعطيل</button>
                        <button onclick="deleteGroup(${g.id})" style="background:red; color:#fff; border:none; padding:5px; cursor:pointer">حذف</button>
                    </div>
                ` : ""}
            </div>`;
    });
}

function openCreateGroupModal() {
    const price = 30000;
    if (!currentUser.isAdmin && currentUser.coins < price) {
        return alert(`❌ تحتاج إلى ${price.toLocaleString()} كوينز لإنشاء جروب!`);
    }

    let n = prompt("أدخل اسم الجروب:");
    if (n) {
        if (!currentUser.isAdmin) currentUser.coins -= price;
        groups.push({ id: Date.now(), name: n, icon: "💬", active: true });
        renderGroups();
        updateUI();
        alert("✅ تم إنشاء الجروب بنجاح.");
    }
}

// 5. التحكم في العرض والوقت
function switchView(v) {
    document.querySelectorAll('.view-panel').forEach(p => p.style.display = 'none');
    document.getElementById('view' + v.charAt(0).toUpperCase() + v.slice(1)).style.display = 'block';
    if(v === 'groups') renderGroups();
}

function timerLogic() {
    currentUser.timeLeft--;
    let m = Math.floor(currentUser.timeLeft / 60);
    let s = currentUser.timeLeft % 60;
    document.getElementById('countdown').innerText = `${m}:${s < 10 ? '0'+s : s}`;
    if(currentUser.timeLeft <= 0) {
        currentUser.coins += currentUser.isAdmin ? 5000 : 1000;
        currentUser.timeLeft = 3600;
        updateUI();
    }
}

function renderOnline() {
    const list = document.getElementById('onlineList');
    const users = ["سيف", "أحمد", "ليلى", "نور"];
    document.getElementById('totalOnline').innerText = users.length;
    users.forEach(u => {
        list.innerHTML += `<div style="text-align:center"><img src="https://i.pravatar.cc/40?u=${u}" class="u-avatar"><br><small>${u}</small></div>`;
    });
}

function toggleGroup(id) {
    let g = groups.find(x => x.id === id);
    g.active = !g.active;
    renderGroups();
}

function deleteGroup(id) {
    groups = groups.filter(x => x.id !== id);
    renderGroups();
}

function adminAction(a) { alert("🛡️ المشرف سيف: تم تنفيذ " + a); }

function openSettings() {
    let n = prompt("تغيير الاسم:", currentUser.username);
    if(n) { currentUser.username = n; updateUI(); }
}
