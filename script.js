// ======== 1. قاعدة البيانات (تخزين في المتصفح) ========
let usersData = JSON.parse(localStorage.getItem('chatUsers')) || {}; 
let currentUser = null;

// ======== 2. وظائف الحسابات ========

function createAccount() {
    // 1. طلب الاسم
    let name = prompt("اكتب اسم المستخدم الجديد:");
    if (!name) return; // لو داس إلغاء
    if (usersData[name]) return alert("الاسم ده محجوز، جرب اسم تاني!");

    // 2. طلب الباسورد
    let pass = prompt("اكتب كلمة المرور:");
    if (!pass) return;

    // 3. حفظ البيانات
    usersData[name] = { 
        password: pass, 
        coins: 1000 // هدية 1000 كوينز
    };
    
    // حفظ في الذاكرة الدائمة
    localStorage.setItem('chatUsers', JSON.stringify(usersData));
    alert("جدع تم إنشاء الحساب يوحش دوس على (دخول) دلوقتي .");
}

function login() {
    // قراءة البيانات من الخانات
    let nameInput = document.getElementById("username-input").value;
    let passInput = document.getElementById("password-input").value;

    // التحقق
    if (!nameInput || !passInput) return alert("اكتب الاسم والباسورد!");
    
    if (!usersData[nameInput]) {
        return alert("الحساب غير موجود! دوس على (إنشاء حساب) الأول.");
    }

    if (usersData[nameInput].password !== passInput) {
        return alert("كلمة المرور غلط!");
    }

    // نجاح الدخول
    currentUser = nameInput;
    startApp();
}

// ======== 3. تشغيل الموقع ========

function startApp() {
    // إخفاء شاشة الدخول
    document.getElementById("login-screen").classList.add("hidden");
    
    // إظهار الشات
    document.getElementById("main-app").classList.remove("hidden");
    
    // عرض البيانات
    document.getElementById("display-name").innerText = currentUser;
    updateCoins();

    // تشغيل عداد الكوينز (بيزيد 100 كل دقيقة)
    setInterval(function() {
        usersData[currentUser].coins += 100;
        localStorage.setItem('chatUsers', JSON.stringify(usersData));
        updateCoins();
    }, 60000);
}

function updateCoins() {
    document.getElementById("coins-display").innerText = usersData[currentUser].coins;
}

function logout() {
    location.reload(); // إعادة تحميل الصفحة للخروج
}

// ======== 4. الشات ========

function sendMessage() {
    let input = document.getElementById("msg-input");
    let text = input.value;
    
    if (text === "") return; // لو فاضي متبعتش حاجة

    let chatBox = document.getElementById("chat-box");
    
    // إنشاء رسالة جديدة
    let newMsg = document.createElement("div");
    newMsg.className = "msg";
    newMsg.innerHTML = `<span class="username">${currentUser}:</span> ${text}`;
    
    chatBox.appendChild(newMsg);
    
    // تنظيف الخانة والنزول لتحت
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}
