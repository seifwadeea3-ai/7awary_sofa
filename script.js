:root {
    --pink: #e91e63;
    --dark-bg: #0f1619;
    --sidebar: #1a262c;
    --accent: #1abc9c;
    --border: #2d3748;
}

body { margin: 0; font-family: 'Segoe UI', sans-serif; background: var(--dark-bg); color: #cbd5e0; overflow: hidden; }

/* تصميم صفحة الدخول */
.login-screen { display: flex; height: 100vh; }
.login-left-art { flex: 2; background: url('https://w0.peakpx.com/wallpaper/317/998/HD-wallpaper-digital-art.jpg') no-repeat center; background-size: cover; }
.login-right-form { flex: 1; background: #f4f7f6; display: flex; align-items: center; padding: 40px; color: #333; }
.enter-btn { width: 100%; padding: 15px; background: var(--pink); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 18px; }

/* تصميم لوحة التحكم */
.dashboard-wrapper { display: flex; height: 100vh; }
.sidebar-user, .sidebar-actions { width: 300px; background: var(--sidebar); border-left: 1px solid var(--border); padding: 20px; }
.main-content { flex: 1; display: flex; align-items: center; justify-content: center; text-align: center; }

.profile-card { text-align: center; border-bottom: 1px solid var(--border); padding-bottom: 20px; }
.avatar-box img { width: 90px; height: 90px; border-radius: 50%; border: 3px solid var(--accent); }

.progress-container { background: #111; height: 10px; border-radius: 5px; margin: 10px 0; overflow: hidden; }
.progress-bar { background: var(--accent); height: 100%; width: 0%; transition: 0.5s; }

.timer-display { background: rgba(0,0,0,0.2); padding: 20px; border-radius: 10px; border: 1px dashed var(--accent); margin: 20px 0; }
#timerClock { font-size: 40px; color: #e74c3c; font-weight: bold; }

.action-grid { display: grid; gap: 15px; }
.action-item { background: #243139; padding: 25px; border-radius: 10px; text-align: center; cursor: pointer; border: 1px solid var(--border); }
.action-item:hover { border-color: var(--accent); color: var(--accent); }
