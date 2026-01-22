<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>موقع الشات العربي |حواري سوفا</title>
    <link rel="stylesheet" href="style.css">
    <style>
        /* تنسيقات سريعة لضمان عمل الواجهة */
        body { font-family: Arial, sans-serif; background-color: #1a1a1a; color: white; text-align: center; }
        .container { max-width: 600px; margin: auto; padding: 20px; }
        .hidden { display: none !important; }
        input, button { padding: 10px; margin: 5px; border-radius: 5px; border: none; }
        button { background-color: #28a745; color: white; cursor: pointer; }
        button:hover { background-color: #218838; }
        .section { background: #2d2d2d; padding: 15px; border-radius: 10px; margin-top: 20px; }
        #chat-messages { height: 200px; overflow-y: auto; background: #000; padding: 10px; text-align: right; border: 1px solid #444; }
        .user-bar { display: flex; justify-content: space-around; background: #444; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div id="login-screen">
            <h1>موقع الشات العربي</h1>
            <div class="user-login">
                <input type="text" id="username" placeholder="اسم المستخدم">
                <input type="password" id="password" placeholder="كلمة المرور">
                <br>
                <button onclick="login()">دخول</button>
                <button onclick="guestLogin()">حساب زائر</button>
                <button onclick="createAccount()">إنشاء حساب جديد</button>
            </div>
        </div>

        <div id="app-content" class="hidden">
            <div class="user-bar">
                <span id="display-username"></span>
                <span id="coins-display">الكوينز: 0</span>
            </div>
            
            <div class="section">
                <button onclick="openShop()">المتجر 🛒</button>
                <button onclick="openDailyEvents()">الفعاليات 🎁</button>
                <button onclick="editProfile()">تعديل البروفايل 👤</button>
            </div>

            <div class="section">
                <h3>الملف الشخصي</h3>
                <img id="profile-pic" src="" alt="صورة" style="width:60px; height:60px; border-radius:50%; background:#eee;">
                <p>الرتبة: <span id="profile-rank"></span></p>
                <p>الأوسمة: <span id="profile-badges"></span></p>
                <p id="profile-coins"></p>
                <p id="profile-bio"></p>
            </div>

            <div class="section">
                <h3>الجروبات</h3>
                <button onclick="createGroup()">إنشاء جروب جديد</button>
                <ul id="group-list" style="list-style:none; padding:0;"></ul>
            </div>

            <div class="section">
                <h3 id="chat-title">اختر جروب للدردشة</h3>
                <div id="chat-messages"></div>
                <input type="text" id="chat-input" placeholder="اكتب هنا..." style="width:70%;">
                <button onclick="sendMessage()">إرسال</button>
                <div id="group-controls"></div>
            </div>
        </div>
    </div>

    <script>
        // هذا الكود يراقب الدالة startSession في ملفك ويشغل الواجهة فور نجاحها
        window.addEventListener('load', () => {
            const oldStartSession = window.startSession;
            window.startSession = function() {
                if(oldStartSession) oldStartSession();
                document.getElementById('login-screen').classList.add('hidden');
                document.getElementById('app-content').classList.remove('hidden');
                if(document.getElementById('display-username')) {
                    document.getElementById('display-username').innerText = "أهلاً: " + (window.username || "مستخدم");
                }
            };
        });
    </script>
    <script src="script.js"></script>
</body>
</html>

