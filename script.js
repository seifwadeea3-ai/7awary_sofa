// --- إعدادات النظام ---
const CONFIG = {
    msgForMaxLevel: 50000,
    hourlyRewards: { 'None': 1000, 'Bronze': 1000, 'Silver': 2000, 'Gold': 3000, 'Admin': 0 } // المشرف له نظام خاص
};

// --- بيانات المستخدم الحالية (الافتراضية) ---
let currentUser = {
    username: "",
    handle: "",
    rank: "None", // None, Bronze, Silver, Gold, Admin
    coins: 0,
    messages: 0,
    isAdmin: false,
    taxRate: 0,
    timeLeft: 3600
};

// 1. دالة تسجيل الدخول (مع التحقق من المشرف)
function attemptLogin() {
    const nameIn = document.getElementById('loginName').value.trim();
    const passIn = document.getElementById('loginPass').value.trim();
    const genderIn = document.getElementById('loginGender').value;

    if (!nameIn) return alert("الرجاء كتابة الاسم");

    // التحقق الخاص بحساب المشرف its_sofa
    if (nameIn === "its_sofa") {
        if (passIn === "s1e2i3f4#") {
            // تفعيل صلاحيات المشرف الكاملة
            setupAdminProfile();
        } else {
            return alert("❌ كلمة المرور خاطئة لهذا الحساب!");
        }
    } else {
        // تسجيل دخول مستخدم عادي (زائر)
        setupUserProfile(nameIn, genderIn);
    }

    // الانتقال للداشبورد
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    
    // تشغيل الأنظمة
    updateUI();
    setInterval(timerLogic, 1000);
}

// 2. إعداد بروفايل المشرف
function setupAdminProfile() {
    currentUser.username = "its_sofa";
    currentUser.handle = "@its_sofa";
    currentUser.rank = "Admin";
    currentUser.coins = 300000; // رصيد البداية
    currentUser.isAdmin = true;
    currentUser.taxRate = 0.15; // تفعيل الضريبة

    // تعديلات الواجهة للمشرف
    document.getElementById('userNameDisplay').classList.add('admin-name-style'); // اللون الأسود
    document.getElementById('adminBadge').style.display = 'inline-block';
    document.getElementById('btnAdminPanel').style.display = 'block'; // زر الإدارة
    document.getElementById('taxRow').style.display = 'flex';
}

// 3. إعداد بروفايل المستخدم العادي
function setupUserProfile(name, gender) {
    currentUser.username = name;
    currentUser.handle = "@" + name.replace(/\s+/g, '_');
    currentUser.rank = "None";
    currentUser.coins = 0;
    
    // صورة حسب الجنس
    if(gender === 'أنثى') {
        document.getElementById('userAvatar').src = 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png';
    }
}

// 4. منطق الموقت وتوزيع الكوينز
function timerLogic() {
    currentUser.timeLeft--;
    
    // تحديث العرض
    let m = Math.floor(currentUser.timeLeft / 60);
    let s = currentUser.timeLeft % 60;
    document.getElementById('countdown').innerText = `${m}:${s < 10 ? '0'+s : s}`;

    if (currentUser.timeLeft <= 0) {
        // توزيع الراتب
        if (currentUser.isAdmin) {
            // المشرف يزداد رصيده من الضرائب (محاكاة)
            currentUser.coins += 5000; // دخل سلبي للمشرف
            alert("💰 تم تحصيل عوائد الضرائب للمشرف!");
        } else {
            let salary = CONFIG.hourlyRewards[currentUser.rank];
            currentUser.coins += salary;
            alert(`💰 مبروك! تم استلام راتب ${salary} كوينز.`);
        }
        currentUser.timeLeft = 3600;
        updateUI();
    }
}

// 5. تحديث الواجهة والبيانات والمستويات
function updateUI() {
    // البيانات الأساسية
    document.getElementById('userNameDisplay').innerText = currentUser.username;
    document.getElementById('userHandle').innerText = currentUser.handle;
    document.getElementById('coinDisplay').innerText = currentUser.coins.toLocaleString();
    document.getElementById('rankDisplay').innerText = currentUser.isAdmin ? "مشرف الموقع" : currentUser.rank;

    // حساب المستوى
    // المستوى 10 = 50,000 رسالة
    let lvl = 0;
    let target = 100;
    
    // معادلة بسيطة للمستويات
    if(currentUser.messages >= 50000) { lvl = 10; target = "MAX"; }
    else if(currentUser.messages >= 30000) { lvl = 9; target = 50000; }
    else if(currentUser.messages >= 20000) { lvl = 8; target = 30000; }
    else if(currentUser.messages >= 15000) { lvl = 7; target = 20000; }
    else if(currentUser.messages >= 10000) { lvl = 6; target = 15000; }
    else if(currentUser.messages >= 5000) { lvl = 5; target = 10000; }
    else if(currentUser.messages >= 1000) { lvl = 2; target = 2500; }
    else if(currentUser.messages >= 100) { lvl = 1; target = 1000; }

    document.getElementById('lvlVal').innerText = lvl;
    document.getElementById('msgCurrent').innerText = currentUser.messages;
    document.getElementById('msgTarget').innerText = target;
    
    // شريط التقدم
    let percent = (currentUser.messages / (target === "MAX" ? 50000 : target)) * 100;
    document.getElementById('lvlBar').style.width = percent + "%";

    // تحديث دخل الساعة المعروض
    if(currentUser.isAdmin) {
         document.getElementById('hourlyIncome').innerText = "غير محدود (عوائد ضريبية)";
    } else {
        document.getElementById('hourlyIncome').innerText = CONFIG.hourlyRewards[currentUser.rank];
    }
}

// 6. التنقل بين الصفحات
function switchView(viewName) {
    // إخفاء الكل
    document.getElementById('viewHome').style.display = 'none';
    document.getElementById('viewRewards').style.display = 'none';
    document.getElementById('viewAdmin').style.display = 'none';
    
    // إظهار المطلوب
    if(viewName === 'home') document.getElementById('viewHome').style.display = 'block';
    if(viewName === 'rewards') document.getElementById('viewRewards').style.display = 'block';
    if(viewName === 'admin') document.getElementById('viewAdmin').style.display = 'block';
    if(viewName === 'shop') alert("🛒 سيتم فتح المتجر قريباً (تصميم قيد التنفيذ)");
}

// زر محاكاة الرسائل للتجربة
function simulateMessages(amount) {
    currentUser.messages += amount;
    updateUI();
}
// --- وظائف التفاعل للأزرار ---

// 1. تفعيل أزرار لوحة الإدارة (its_sofa)
function adminAction(actionType) {
    // التحقق من أن المستخدم هو المشرف فعلاً
    if (currentUser.username !== "its_sofa") {
        alert("⚠️ عذراً، هذه الصلاحية للمشرف فقط.");
        return;
    }

    if (actionType === 'stopChat') {
        alert("🚫 تم إيقاف الشات مؤقتًا لجميع المستخدمين.");
    } else if (actionType === 'deleteGroups') {
        let confirmDel = confirm("هل أنت متأكد من حذف الجروبات المخالفة؟");
        if(confirmDel) alert("✅ تم تنظيف النظام بنجاح.");
    } else if (actionType === 'giveCoins') {
        let amount = prompt("ما هو مقدار الكوينز المراد توزيعه كهدية؟");
        if(amount) alert(`💰 جاري إرسال ${amount} كوينز لكل المستخدمين...`);
    } else if (actionType === 'viewTax') {
        alert("📈 سجل الضرائب: تم تحصيل 15% من جميع التحويلات اليوم بنجاح.");
    }
}

// 2. تفعيل زر الإعدادات (لتغيير الاسم)
// ابحث عن الزر الذي يحمل كلاس .settings-btn أو .btn-small وأضف له هذا الأمر
function openSettings() {
    let newName = prompt("اكتب اسمك الجديد:", currentUser.username);
    if (newName) {
        currentUser.username = newName;
        updateUI(); // لتحديث الاسم فوراً في الواجهة
    }
}

// 3. تفعيل زر المتجر
function openShop() {
    alert("🛒 المتجر مفتوح الآن!\n- شراء رتبة ذهبية (20,000)\n- شراء وسام الأسد (800)\n\n(قريباً سيتم إضافة واجهة الشراء الكاملة)");
}
