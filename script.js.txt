// ======== بيانات المستخدمين والجروبات ========
let username = '';
let coins = 0;
let currentGroup = null;
let groups = {};
let loginTime = null;
let isSuperAdmin = false;

// الرتب العامة
const ranksGeneral = {
    'برونزي': {color: 'green', price: 3000, coinsPerHour: 1000},
    'فضي': {color: 'blue', price: 8000, coinsPerHour: 2000},
    'ذهبي': {color: 'gold', price: 20000, coinsPerHour: 3000}
};

// الأوسمة
const badges = ['🦁','🦅','🐅','🐆','🐉','🦅✨','⚡','🌙','☀️','⭐'];
const badgePrice = 800;

// بيانات المستخدمين
let usersData = {}; 
// شكل: {username: {password, rank, badges, coins, bio, profilePic, friends: [], notifications: []}}

// الرسائل لكل جروب
let messages = {};

// ======== تسجيل الدخول / إنشاء حساب ========
function login() {
    const userInput = document.getElementById('username').value.trim();
    const passInput = document.getElementById('password').value.trim();
    if(!userInput || !passInput){ alert('اكتب اسم وكلمة المرور'); return; }
    if(!usersData[userInput]) { alert('الحساب غير موجود'); return; }
    if(usersData[userInput].password !== passInput){ alert('كلمة المرور خطأ'); return; }

    username = userInput;
    coins = usersData[username].coins;
    if(username.toLowerCase() === 'sadmin'){ isSuperAdmin = true; coins = 300000; }
    startSession();
}

function guestLogin() {
    username = 'زائر_' + Date.now();
    usersData[username] = {password:'', rank:null, badges:[], coins:0, bio:'', profilePic:'', friends:[], notifications:[]};
    coins = 0;
    startSession();
}

function createAccount() {
    const userInput = prompt('اكتب اسم المستخدم:');
    if(!userInput) return;
    if(usersData[userInput]) return alert('الاسم مستخدم بالفعل');
    const passInput = prompt('اكتب كلمة المرور:');
    if(!passInput) return;
    usersData[userInput] = {password: passInput, rank:null, badges:[], coins:0, bio:'', profilePic:'', friends:[], notifications:[]};
    alert('تم إنشاء الحساب!');
}

// بدء الجلسة
function startSession() {
    document.getElementById('username').disabled = true;
    document.getElementById('password').disabled = true;
    loginTime = Date.now();
    setInterval(addCoins, 1000*60*60/1000);
    updateCoinsDisplay();
    renderProfile();
}

// ======== الكوينز ========
function addCoins() {
    const rank = usersData[username].rank;
    let perHour = 0;
    if(rank && ranksGeneral[rank]) perHour = ranksGeneral[rank].coinsPerHour;
    coins += perHour;
    usersData[username].coins = coins;
    updateCoinsDisplay();
}

function updateCoinsDisplay() {
    document.getElementById('coins-display').innerText = 'الكوينز: ' + coins;
}

// ======== الجروبات ========
function createGroup() {
    if(coins < 30000) { alert('ليس لديك كوينز كافي'); return; }
    const groupName = prompt('اسم الجروب:');
    if(!groupName) return;
    if(groups[groupName]) return alert('الاسم مستخدم بالفعل');
    groups[groupName] = {owner: username, background:'#121212', image:'', members:{[username]:'Owner'}, allowGuests:true};
    coins -= 30000; usersData[username].coins = coins; updateCoinsDisplay();
    renderGroups(); openGroup(groupName);
}

function renderGroups() {
    const list = document.getElementById('group-list');
    list.innerHTML = '';
    for(let g in groups){
        const li = document.createElement('li'); li.innerText = g; li.onclick = ()=>openGroup(g);
        list.appendChild(li);
    }
}

function openGroup(groupName) {
    currentGroup = groupName;
    document.getElementById('chat-title').innerText = 'الجروب: ' + groupName;
    renderMessages(); renderGroupControls();
}

// إرسال الرسائل
function sendMessage() {
    if(!currentGroup){ alert('اختر جروب'); return; }
    const input = document.getElementById('chat-input');
    if(!messages[currentGroup]) messages[currentGroup]=[];
    messages[currentGroup].push({user:username, text:input.value});
    input.value=''; renderMessages();
}

function renderMessages() {
    const chat = document.getElementById('chat-messages'); chat.innerHTML='';
    if(!currentGroup || !messages[currentGroup]) return;
    messages[currentGroup].forEach(msg=>{
        const userInfo = usersData[msg.user] || {rank:null,badges:[]};
        const rank = userInfo.rank; const badgesList = userInfo.badges.join(' ');
        const color = rank ? ranksGeneral[rank].color : 'white';
        const div = document.createElement('div');
        div.innerHTML=`<strong style="color:${color}">${msg.user} (${groups[currentGroup].members[msg.user]||'Member'})</strong> ${badgesList}: ${msg.text}`;
        chat.appendChild(div);
    });
    chat.scrollTop=chat.scrollHeight;
}

// رندر صلاحيات الجروب
function renderGroupControls() {
    const container = document.getElementById('group-controls'); container.innerHTML='';
    if(!currentGroup) return;
    const rank = groups[currentGroup].members[username];
    if(rank==='Owner' || isSuperAdmin){
        const btnChangeName=document.createElement('button'); btnChangeName.innerText='تغيير اسم الجروب';
        btnChangeName.onclick=()=>{
            const newName=prompt('الاسم الجديد:'); if(newName && !groups[newName]){
                groups[newName]={...groups[currentGroup]}; delete groups[currentGroup]; currentGroup=newName; renderGroups(); openGroup(newName);
            } else alert('الاسم مستخدم أو فارغ!');
        }; container.appendChild(btnChangeName);

        const btnChangeBg=document.createElement('button'); btnChangeBg.innerText='تغيير خلفية الجروب';
        btnChangeBg.onclick=()=>{ const color=prompt('لون/رابط خلفية:', '#121212'); if(color) groups[currentGroup].background=color; alert('تم التغيير'); }; container.appendChild(btnChangeBg);

        const btnChangeImage=document.createElement('button'); btnChangeImage.innerText='تغيير صورة الجروب';
        btnChangeImage.onclick=()=>{ const img=prompt('رابط الصورة:'); if(img) groups[currentGroup].image=img; alert('تم التغيير'); }; container.appendChild(btnChangeImage);
    }

    if(rank==='Owner' || rank==='Admin' || rank==='Moderator' || isSuperAdmin){
        const btnManage=document.createElement('button'); btnManage.innerText='إدارة الأعضاء'; btnManage.onclick=()=>manageMembers();
        container.appendChild(btnManage);
    }
}

// إدارة الأعضاء (حظر وتغيير رتبة)
function manageMembers(){
    const members = groups[currentGroup].members;
    let memberList=''; for(let m in members){ if(m===username && !isSuperAdmin) continue; memberList+=`${m} (${members[m]})\n`; }
    const member = prompt('الأعضاء:\n'+memberList+'\nادخل اسم العضو:'); if(!member||!members[member]) return;
    const myRank = groups[currentGroup].members[username]; const targetRank = members[member];
    if(myRank==='Owner'||isSuperAdmin){
        const action = prompt('اكتب العملية: حظر / رتبة / لا شيء'); 
        if(action==='حظر') delete members[member];
        if(action==='رتبة'){ const newRank=prompt('اختر الرتبة: Member / Moderator / Admin / Owner'); if(newRank) members[member]=newRank; }
    } else if(myRank==='Admin'){ if(targetRank==='Member'){ if(prompt('اكتب العملية: حظر / لا شيء')==='حظر') delete members[member]; } else alert('لا يمكنك التحكم'); }
    else if(myRank==='Moderator'){ alert('المشرف لا يمكن حظر أو جعله صامت'); }
    renderGroupControls();
}

// ======== الملف الشخصي ========
function renderProfile(){
    const profile=document.getElementById('profile-pic'); profile.src=usersData[username].profilePic||'';
    document.getElementById('profile-name').innerText=username;
    const rank=usersData[username].rank;
    document.getElementById('profile-rank').innerText=rank||'بدون رتبة';
    document.getElementById('profile-rank').style.color=rank?ranksGeneral[rank].color:'white';
    document.getElementById('profile-badges').innerText=usersData[username].badges.join(' ');
    document.getElementById('profile-coins').innerText='الكوينز: '+coins;
    document.getElementById('profile-bio').innerText=usersData[username].bio;
}

function editProfile(){
    const bio = prompt('اكتب نبذة عنك:', usersData[username].bio);
    if(bio!==null) usersData[username].bio=bio;
    const pic = prompt('رابط صورة الملف الشخصي:', usersData[username].profilePic);
    if(pic!==null) usersData[username].profilePic=pic;
    renderProfile();
}

// إرسال كوينز
function sendCoinsPrompt(){
    const friend = prompt('اسم المستخدم الذي سترسل له الكوينز:');
    if(!usersData[friend]) return alert('المستخدم غير موجود');
    const amount = parseInt(prompt('ادخل المبلغ:'));
    if(isNaN(amount)||amount>coins) return alert('المبلغ غير صالح');
    const tax = Math.floor(amount*0.15); coins -= amount; usersData[friend].coins += (amount-tax); if(isSuperAdmin) coins+=tax;
    alert('تم الإرسال مع خصم 15%');
    renderProfile();
}

// فتح المتجر (شراء رتبة أو وسام)
function openShop(){
    const choice = prompt('1- شراء رتبة\n2- شراء وسام'); 
    if(choice==='1'){
        const rankName=prompt('اختر الرتبة: برونزي / فضي / ذهبي'); buyRank(rankName);
    } else if(choice==='2'){
        const badgeSymbol=prompt('اختر الوسام: '+badges.join(' ')); buyBadge(badgeSymbol);
    }
}

function buyRank(rankName){
    if(!ranksGeneral[rankName]) return alert('رتبة غير موجودة');
    const price=ranksGeneral[rankName].price; if(coins<price) return alert('ليس لديك كوينز كافي');
    coins-=price; usersData[username].rank=rankName; usersData[username].coins=coins; updateCoinsDisplay(); renderProfile(); alert('تم شراء الرتبة: '+rankName);
}

function buyBadge(badgeSymbol){
    if(!badges.includes(badgeSymbol)) return alert('وسام غير موجود'); if(coins<badgePrice) return alert('ليس لديك كوينز كافي');
    coins-=badgePrice; usersData[username].badges.push(badgeSymbol); usersData[username].coins=coins; updateCoinsDisplay(); renderProfile(); alert('تم شراء الوسام: '+badgeSymbol);
}

// الأحداث اليومية (Daily Events)
function openDailyEvents(){
    alert('مهمات اليوم:\n1- ارسال 10 رسائل: +500 كوينز\n2- استقبال/ارسال طلب صداقة: +300 كوينز\n3- إنشاء جروب: +1000 كوينز');
}
