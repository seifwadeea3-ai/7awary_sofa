// المتغيرات الأساسية
let userData = {
    name: "زائر",
    coins: 0,
    messages: 0,
    rank: "None", // None, Bronze, Silver, Gold
    timeLeft: 3600
};

// 1. نظام المستويات الذي حددته
const LEVELS = [
    { lvl: 10, min: 50000 }, { lvl: 9, min: 30000 }, { lvl: 8, min: 20000 },
    { lvl: 7, min: 15000 }, { lvl: 5, min: 10000 }, { lvl: 4, min: 5000 },
    { lvl: 3, min: 2500 }, { lvl: 2, min: 1000 }, { lvl: 1, min: 100 }
];

const REWARDS = { 'None': 1000, 'Bronze': 1000, 'Silver': 2000, 'Gold': 3000 };

// دالة الدخول وتعيين الاسم المختار
function loginUser() {
    const name = document.getElementById('inputName').value;
    const gender = document.getElementById('inputGender').value;
    
    if(!name) return alert("من فضلك ادخل اسمك!");

    userData.name = name;
    document.getElementById('displayUserName').innerText = name;
    document.getElementById('displayHandle').innerText = "@" + name.replace(/\s/g, '');
    document.getElementById('displayGender').innerText = gender;

    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'flex';
    
    startApp();
}

function startApp() {
    setInterval(updateTimer, 1000);
    updateUI();
}

function updateTimer() {
    userData.timeLeft--;
    if(userData.timeLeft <= 0) {
        userData.coins += REWARDS[userData.rank];
        userData.timeLeft = 3600;
        alert("💰 تم استلام مكافأة الساعة!");
    }
    updateUI();
}

function updateUI() {
    // تحديث الكوينز والرتبة
    document.getElementById('coinVal').innerText = userData.coins;
    document.getElementById('rankVal').innerText = userData.rank;
    document.getElementById('rateDisplay').innerText = REWARDS[userData.rank];

    // تحديث الموقت
    let m = Math.floor(userData.timeLeft / 60);
    let s = userData.timeLeft % 60;
    document.getElementById('timerClock').innerText = `${m}:${s < 10 ? '0'+s : s}`;

    // حساب المستوى بناءً على الرسائل
    let currentLvl = 0;
    let nextTarget = 100;
    for (let l of LEVELS) {
        if (userData.messages >= l.min) {
            currentLvl = l.lvl;
            break;
        }
    }
    document.getElementById('lvlNum').innerText = currentLvl;
    document.getElementById('msgCount').innerText = userData.messages;
    document.getElementById('lvlBar').style.width = (userData.messages / 50000 * 100) + "%";
}

function showView(view) {
    document.getElementById('homeView').style.display = (view === 'home' ? 'block' : 'none');
    document.getElementById('rewardsView').style.display = (view === 'rewards' ? 'block' : 'none');
}
