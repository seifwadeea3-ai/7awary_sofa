// ======== قاعدة البيانات (حفظ في المتصفح) ========
let usersData = JSON.parse(localStorage.getItem('chatUsers')) || {}; 
let username = '';
let coins = 0;

// ======== وظائف تسجيل الدخول ========

// 1. إنشاء حساب
function createAccount() {
    const userInput = prompt('اكتب اسم المستخدم الجديد:');
    if(!userInput) return;
    if(usersData[userInput]) return alert('الاسم مستخدم بالفعل');
    const passInput = prompt('اكتب كلمة المرور:');
    if(!passInput) return;

    usersData[userInput] = {
        password: passInput, 
        rank: 'مبتدئ', 
        badges: [], 
        coins: 1000, 
        bio: 'أنا مستخدم جديد', 
        profilePic: '', 
        friends: []
    };
    
    // حفظ في ذاكرة المتصفح
    localStorage.setItem('chatUsers', JSON.stringify(usersData));
    alert('تم إنشاء الحساب بنجاح! جرب تسجل دخول دلوقتي.');
}

// 2. تسجيل الدخول
function login() {
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value.trim();
    
    if(!userInput || !passInput){ alert('اكتب اسمك وكلمة المرور'); return; }
    if(!usersData[userInput]) { alert('الحساب غير موجود.. اضغط على إنشاء حساب أولاً'); return; }
    if(usersData[userInput].password !== passInput){ alert('كلمة المرور خطأ'); return; }

    username = userInput;
    coins = usersData[username].coins;
    startSession();
}

// 3. دخول زائر
function guestLogin() {
    username = 'زائر_' + Math.floor(Math.random() * 1000);
    coins = 0;
    startSession();
}

// ======== تشغيل الموقع بعد الدخول ========
function startSession() {
    // إظهار وإخفاء الشاشات
    const loginScreen = document.getElementById('login-screen');
    const appContent = document.getElementById('app-content');
    
    if(loginScreen) loginScreen.style.display = 'none';
    if(appContent) {
        appContent.style.display = 'block';
        appContent.classList.remove('hidden'); // احتياطاً لو مستخدم CSS
    }
    
    // تحديث البيانات المعروضة
    updateCoinsDisplay();
    renderProfile();
    alert('منور الموقع يا ' + username);
}

function updateCoinsDisplay() {
    const el = document.getElementById('coins-display');
    if(el) el.innerText = 'الكوينز: ' + coins;
}

function renderProfile() {
    if(document.getElementById('profile-name')) document.getElementById('profile-name').innerText = username;
    if(document.getElementById('profile-rank')) document.getElementById('profile-rank').innerText = usersData[username]?.rank || 'زائر';
    if(document.getElementById('profile-coins')) document.getElementById('profile-coins').innerText = 'رصيدك: ' + coins;
}

// دالة المتجر البسيطة للتجربة
function openShop() {
    alert('المتجر سيتم تفعيله قريباً.. رصيدك الحالي: ' + coins);
}
