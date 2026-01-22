// ======== بيانات المستخدمين والجروبات ========
let username = '';
let coins = 0;
let currentGroup = null;
let groups = {};
let usersData = JSON.parse(localStorage.getItem('chatUsers')) || {}; 
let messages = {};

const ranksGeneral = {
    'برونزي': {color: 'green', price: 3000, coinsPerHour: 1000},
    'فضي': {color: 'blue', price: 8000, coinsPerHour: 2000},
    'ذهبي': {color: 'gold', price: 20000, coinsPerHour: 3000}
};

// ======== وظائف تسجيل الدخول ========
function login() {
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value.trim();
    
    if(!userInput || !passInput){ alert('اكتب اسم وكلمة المرور'); return; }
    if(!usersData[userInput]) { alert('الحساب غير موجود.. أنشئ حساب أولاً'); return; }
    if(usersData[userInput].password !== passInput){ alert('كلمة المرور خطأ'); return; }

    username = userInput;
    coins = usersData[username].coins || 0;
    startSession();
}

function createAccount() {
    const userInput = prompt('اكتب اسم المستخدم الجديد:');
    if(!userInput) return;
    if(usersData[userInput]) return alert('الاسم مستخدم بالفعل');
    const passInput = prompt('اكتب كلمة المرور:');
    if(!passInput) return;

    usersData[userInput] = {
        password: passInput, 
        rank: null, 
        badges: [], 
        coins: 1000, // هدية تسجيل
        bio: '', 
        profilePic: '', 
        friends: []
    };
    
    localStorage.setItem('chatUsers', JSON.stringify(usersData));
    alert('تم إنشاء الحساب بنجاح! يمكنك الدخول الآن.');
}

function guestLogin() {
    username = 'زائر_' + Math.floor(Math.random() * 1000);
    coins = 0;
    startSession();
}

// ======== بدء الجلسة ========
function startSession() {
    // إخفاء شاشة الدخول وإظهار الموقع
    const loginScreen = document.getElementById('login-screen');
    const appContent = document.getElementById('app-content');
    
    if(loginScreen) loginScreen.style.display = 'none';
    if(appContent) appContent.style.display = 'block';
    
    updateCoinsDisplay();
    renderProfile();
    alert('أهلاً بك يا ' + username);
}

function updateCoinsDisplay() {
    const el = document.getElementById('coins-display');
    if(el) el.innerText = 'الكوينز: ' + coins;
}

function renderProfile() {
    if(document.getElementById('profile-name')) document.getElementById('profile-name').innerText = username;
    if(document.getElementById('profile-coins')) document.getElementById('profile-coins').innerText = 'الكوينز: ' + coins;
}
