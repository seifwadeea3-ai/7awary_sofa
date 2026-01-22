<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>موقع الشات العربي</title>
    <link rel="stylesheet" href="style.css">
    <style>
        /* تنسيق بسيط لإظهار وإخفاء الأقسام */
        .hidden { display: none; }
        #main-app { display: flex; flex-direction: column; gap: 20px; padding: 20px; }
        .section { border: 1px solid #ccc; padding: 10px; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <header id="login-screen">
            <h1>موقع الشات العربي</h1>
            <div class="user-login">
                <input type="text" id="username" placeholder="اسم المستخدم">
                <input type="password" id="password" placeholder="كلمة المرور">
                <button onclick="login()">دخول</button>
                <button onclick="guestLogin()">حساب زائر</button>
                <button onclick="createAccount()">إنشاء حساب</button>
            </div>
        </header>

        <div id="app-content" class="hidden">
            <div class="status-bar">
                <span id="coins-display">الكوينز: 0</span>
                <button onclick="openShop()">المتجر 🛒</button>
                <button onclick="openDailyEvents()">الفعاليات 🎁</button>
            </div>

            <div id="main-app">
                <div class="section profile-card">
                    <img id="profile-pic" src="" alt="صورة البروفايل" style="width:50px; height:50px; border-radius:50%;">
                    <h3 id="profile-name"></h3>
                    <p>الرتبة: <span id="profile-rank"></span></p>
                    <p>الأوسمة: <span id="profile-badges"></span></p>
                    <p id="profile-coins"></p>
                    <p id="profile-bio"></p>
                    <button onclick="editProfile()">تعديل البروفايل</button>
                    <button onclick="sendCoinsPrompt()">إرسال كوينز</button>
                </div>

                <div class="section groups-section">
                    <h3>الجروبات</h3>
                    <button onclick="createGroup()">إنشاء جروب (30,000 كوينز)</button>
                    <ul id="group-list"></ul>
                </div>

                <div class="section chat-area">
                    <h3 id="chat-title">اختر جروب للبدء</h3>
                    <div id="chat-messages" style="height: 200px; overflow-y: auto; background: #f9f9f9; border: 1px solid #ddd; margin-bottom: 10px; padding: 10px; color: black;"></div>
                    <input type="text" id="chat-input" placeholder="اكتب رسالتك...">
                    <button onclick="sendMessage()">إرسال</button>
                    <div id="group-controls"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // دالة مساعدة لإظهار واجهة الشات بعد الدخول
        function showApp() {
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app-content').classList.remove('hidden');
        }
        
        // تعديل بسيط على دالة startSession الأصلية لتشغيل الانتقال
        const originalStartSession = startSession;
        startSession = function() {
            originalStartSession();
            showApp();
        };
    </script>
    <script src="script.js"></script>
</body>
</html>

