// =================================================================
// 🛡️ 優先綁定所有 DOM 元素與事件 (確保按鈕 100% 隨時可點擊)
// =================================================================
const page1 = document.getElementById('page1');
const pageCard = document.getElementById('page-card'); 
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3'); 
const page4 = document.getElementById('page4'); 
const page5 = document.getElementById('page5'); 
const appContainer = document.getElementById('appContainer');
const startBtn = document.getElementById('startBtn');
const startAdventureBtn = document.getElementById('startAdventureBtn'); 
const reDrawBtn = document.getElementById('reDrawBtn');
const nextToPage4Btn = document.getElementById('nextToPage4Btn'); 
const deckArea = document.getElementById('deckArea');
const singleCardArea = document.getElementById('singleCardArea');
const deckCards = document.querySelectorAll('.deck-card'); 
const moodCard = document.getElementById('moodCard');
const moodImg = document.getElementById('moodImg'); 
const moodTitle = document.getElementById('moodTitle');
const moodDesc = document.getElementById('moodDesc');
const ffCanvasContainer = document.getElementById('ff-canvas-container'); 
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false; 

// 🔗 您的 Google Apps Script 雲端數據庫 API 網址
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbw6ks-67_DiwUgci6kTyDeBjOOwWCl07kQR_K0awfEd9o98NhKCJMSLEawqmzB1UTJk/exec";

// =========================================
// 👦👧 10 張卡牌題庫
// =========================================
const moodDatabase = [
    { title: "快樂動物園", img: "快樂動物園.jfif", desc: "充滿動物叫聲與輕快跳躍的節奏。", prompt: "happy animals, upbeat and light jumping rhythms, safari, playful vibe" },
    { title: "遊樂園探險", img: "旋轉木馬.jfif", desc: "像旋轉木馬一樣，充滿歡笑聲的音樂。", prompt: "amusement park adventure, carousel, carousel waltz, cheerful brass" },
    { title: "魔法森林", img: "魔法森林.jfif", desc: "閃閃發光、有小精靈飛舞的神奇感覺。", prompt: "mystic magical forest, sparkling lights, flying fairies, mysterious and enchanted woodwinds" },
    { title: "宇宙探險", img: "宇宙探險.jfif", desc: "穿上太空衣飛向星星！神祕的宇宙飛行。", prompt: "cosmic space exploration, floating in zero gravity, starry synth, mystery voyage" },
    { title: "甜甜夢鄉", img: "甜甜夢鄉.jfif", desc: "溫柔、安靜，像搖籃曲一樣哄你睡覺。", prompt: "sweet dreams, gentle lullaby, quiet sleeping theme, soft warm piano" },
    { title: "熱血運動會", img: "熱血運動會.jfif", desc: "充滿活力、大家一起加油的開心節奏！", prompt: "energetic sports day, fast racing beat, cheering crowd, triumphant brass" },
    { title: "下雨的窗邊", img: "下雨的窗邊.jfif", desc: "滴滴答答的雨聲，適合安靜畫畫的放鬆音樂。", prompt: "rainy window, gentle pitter-patter water droplets, cozy lofi chillhop, relaxing piano" },
    { title: "海底世界", img: "海底世界.jfif", desc: "像小魚游來游去、泡泡咕嚕咕嚕的聲音。", prompt: "underwater deep sea, floating colorful fish, bubbling water effects, ethereal harp" },
    { title: "闖關遊戲", img: "闖關遊戲.jfif", desc: "像超級瑪利歐一樣，充滿挑戰與趣味的過關音樂。", prompt: "8-bit gaming arcade, platformer jump sound effects, retro chipmusic, adventurous key" },
    { title: "生日派對", img: "生日派對.jfif", desc: "開心、熱鬧，準備吹蠟燭吃蛋糕的慶祝時光。", prompt: "birthday party, celebration, blowing candles, happy acoustic guitar, festive bells" }
];

// 本地備用數據
let inspirationWall = [
    { name: "魔法學徒小華", mood: "魔法森林", url: "https://suno.com/song/demo-1", solveScore: "5.0" }
];
let adventureState = { moodTitle: "", moodPrompt: "", vocal: "", instrument: "", tonality: "", tempo: "", step: 0, eventChoice: null, solveScore: 0 };

// 導航函數
function showPage(pageToShow) {
    [page1, pageCard, page2, page3, page4, page5].forEach(p => { 
        if (p) { p.classList.remove('active'); p.classList.add('hidden'); }
    });
    if (pageToShow) {
        pageToShow.classList.remove('hidden');
        if (pageToShow === page5 && isMusicPlaying) {
            bgMusic.pause(); musicToggle.innerText = "🔇"; isMusicPlaying = false; 
        }
        requestAnimationFrame(() => setTimeout(() => pageToShow.classList.add('active'), 10));
    }
}

// 點擊「開始體驗」按鈕
if (startBtn) {
    startBtn.addEventListener('click', () => {
        initAudio(); 
        showPage(pageCard);
        if (!isMusicPlaying && bgMusic) { 
            bgMusic.volume = 0.5; 
            bgMusic.play().then(() => { 
                isMusicPlaying = true; 
                if (musicToggle) musicToggle.innerText = "🔊"; 
            }).catch(()=>{}); 
        }
    });
}

if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        if (!bgMusic) return;
        if (isMusicPlaying) { bgMusic.pause(); musicToggle.innerText = "🔇"; } 
        else { bgMusic.play(); musicToggle.innerText = "🔊"; }
        isMusicPlaying = !isMusicPlaying;
    });
}

// 🃏 抽卡點擊
deckCards.forEach(card => {
    card.addEventListener('click', () => {
        const selectedMood = moodDatabase[Math.floor(Math.random() * moodDatabase.length)];
        
        if (moodCard) moodCard.classList.remove('flipped');
        if (moodImg) moodImg.src = selectedMood.img;
        if (moodTitle) moodTitle.innerText = selectedMood.title;
        if (moodDesc) moodDesc.innerText = selectedMood.desc;
        
        adventureState.moodTitle = selectedMood.title;
        adventureState.moodPrompt = selectedMood.prompt;
        if (deckArea) deckArea.classList.add('hidden-area');
        if (singleCardArea) singleCardArea.classList.remove('hidden-area');
        
        setTimeout(() => {
            if (moodCard) moodCard.classList.add('flipped');
            setTimeout(() => {
                if (reDrawBtn) reDrawBtn.classList.remove('hidden-btn');
                if (startAdventureBtn) startAdventureBtn.classList.remove('hidden-btn'); 
            }, 800);
        }, 250);
    });
});

if (startAdventureBtn) {
    startAdventureBtn.addEventListener('click', () => {
        initAudio(); 
        if (ffCanvasContainer) ffCanvasContainer.style.opacity = "0"; 
        showPage(page2); 
        renderRPGStep(0); 
    });
}

const copyPromptBtn = document.getElementById('copyPromptBtn');
if (copyPromptBtn) {
    copyPromptBtn.addEventListener('click', () => {
        const promptEl = document.getElementById('resultPrompt');
        if (promptEl) {
            navigator.clipboard.writeText(promptEl.innerText);
            copyPromptBtn.innerText = "✅ 抄寫成功！";
            setTimeout(() => copyPromptBtn.innerText = "📋 抄寫咒語 (複製)", 2000);
        }
    });
}

// 🔗 快捷載入剪貼簿連結 (介面完全不顯示網址)
const quickPasteBtn = document.getElementById('quickPasteBtn');
if (quickPasteBtn) {
    quickPasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && text.startsWith("http")) {
                document.getElementById('sunoUrlInput').value = text.trim();
                document.getElementById('urlStatusText').style.display = 'block';
                quickPasteBtn.innerText = "✅ 已成功載入音樂連結！";
                quickPasteBtn.style.borderColor = "#4ade80";
                quickPasteBtn.style.color = "#4ade80";
                return;
            }
        } catch(err) {}
        const manualUrl = prompt("請貼上你在 Suno 複製的歌曲分享連結：");
        if (manualUrl && manualUrl.startsWith("http")) {
            document.getElementById('sunoUrlInput').value = manualUrl.trim();
            document.getElementById('urlStatusText').style.display = 'block';
            quickPasteBtn.innerText = "✅ 已成功載入音樂連結！";
            quickPasteBtn.style.borderColor = "#4ade80";
            quickPasteBtn.style.color = "#4ade80";
        }
    });
}

// 🔮 點擊上傳作品至 Google 試算表
const uploadWallBtn = document.getElementById('uploadWallBtn');
if (uploadWallBtn) {
    uploadWallBtn.addEventListener('click', async () => {
        const nameInput = document.getElementById('authorName');
        const urlInput = document.getElementById('sunoUrlInput');
        const name = nameInput ? nameInput.value.trim() : "";
        let sunoUrl = urlInput ? urlInput.value.trim() : "";
        if(name === "") {
            alert("🧙‍♂️ 魔法師翁sir：請確定輸入了你的學徒代號喔！");
            return;
        }
        // 若尚未點擊載入連結，自動嘗試讀取或提示一次
        if(!sunoUrl || !sunoUrl.startsWith("http")) {
            try {
                const clipText = await navigator.clipboard.readText();
                if (clipText && clipText.startsWith("http")) {
                    sunoUrl = clipText.trim();
                    if (urlInput) urlInput.value = sunoUrl;
                }
            } catch(e) {}
        }
        if(!sunoUrl || !sunoUrl.startsWith("http")) {
            const promptUrl = prompt("🧙‍♂️ 魔法師翁sir：請貼上你的 Suno 歌曲分享連結：");
            if (promptUrl && promptUrl.startsWith("http")) {
                sunoUrl = promptUrl.trim();
                if (urlInput) urlInput.value = sunoUrl;
            } else {
                alert("🧙‍♂️ 魔法師翁sir：需要有 Suno 歌曲連結才能生成二維碼與刻入石碑喔！");
                return;
            }
        }
        const finalSolveScore = Math.min(adventureState.solveScore, 5).toFixed(1);
        uploadWallBtn.disabled = true;
        uploadWallBtn.innerText = "⏳ 正在刻入試算表石碑...";
        const payload = {
            name: name,
            mood: adventureState.moodTitle,
            url: sunoUrl,
            solveScore: finalSolveScore
        };
        try {
            await fetch(GAS_API_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(payload)
            });
            setTimeout(async () => {
                if (ffCanvasContainer) ffCanvasContainer.style.opacity = "1";
                playRitualFanfare(); 
                await fetchWallData(); 
                showPage(page5);
                uploadWallBtn.disabled = false;
                uploadWallBtn.innerText = "🔮 刻入魔法石碑 (生成二維碼)";
            }, 800);
        } catch(e) {
            alert("⚡ 魔法傳輸受阻：寫入試算表失敗，請檢查網路連線。");
            uploadWallBtn.disabled = false;
            uploadWallBtn.innerText = "🔮 刻入魔法石碑 (生成二維碼)";
        }
    });
}

// 🃏 重新抽卡
if (reDrawBtn) {
    reDrawBtn.addEventListener('click', () => {
        if (moodCard) moodCard.classList.remove('flipped');
        reDrawBtn.classList.add('hidden-btn');
        if (startAdventureBtn) startAdventureBtn.classList.add('hidden-btn');
        setTimeout(() => {
            if (singleCardArea) singleCardArea.classList.add('hidden-area');
            if (deckArea) deckArea.classList.remove('hidden-area');
            if (moodImg) moodImg.src = "";
            if (moodTitle) moodTitle.innerText = "";
            if (moodDesc) moodDesc.innerText = "";
        }, 400); 
    });
}

const viewWallBtn = document.getElementById('viewWallBtn');
if (viewWallBtn) {
    viewWallBtn.addEventListener('click', async () => { 
        if (ffCanvasContainer) ffCanvasContainer.style.opacity = "1";
        await fetchWallData(); 
        showPage(page5); 
    });
}

const backToHomeBtn = document.getElementById('backToHomeBtn');
if (backToHomeBtn) backToHomeBtn.addEventListener('click', resetApp);
const cancelToHomeBtn = document.getElementById('cancelToHomeBtn');
if (cancelToHomeBtn) cancelToHomeBtn.addEventListener('click', resetApp);
const cancelToPage3Btn = document.getElementById('cancelToPage3Btn');
if (cancelToPage3Btn) cancelToPage3Btn.addEventListener('click', () => showPage(page3));
const restartAdventureBtn = document.getElementById('restartAdventureBtn');
if (restartAdventureBtn) restartAdventureBtn.addEventListener('click', resetApp);

if (nextToPage4Btn) {
    nextToPage4Btn.addEventListener('click', () => {
        const promptText = `A high quality music track for ${adventureState.moodTitle}. ${adventureState.vocal}. Main instruments featuring ${adventureState.instrument}. ${adventureState.tonality}, ${adventureState.tempo}. Atmosphere: ${adventureState.moodPrompt}.`;
        const promptEl = document.getElementById('resultPrompt');
        if (promptEl) promptEl.innerText = promptText;
        showPage(page4); 
        
        const ritualDialogue = `「現在，將你調配出的這段咒語帶去 Suno AI 聖地吧。生成音樂後，別忘了回來把它刻在靈感石碑上！」`;
        const ritualTextEl = document.getElementById('ritualText');
        if (ritualTextEl) typeWriterEffect(ritualTextEl, ritualDialogue, 30);
    });
}

// =========================================
// 🎵 Web Audio API 魔法音效引擎
// =========================================
let audioCtx;
function initAudio() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch(e) {}
}

function playTextBleep(isSystem = false) {
    if (!audioCtx || !isMusicPlaying) return; 
    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'square'; 
        osc.frequency.setValueAtTime(isSystem ? 300 : 600, audioCtx.currentTime); 
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime); 
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03); 
        osc.connect(gainNode); gainNode.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.03); 
    } catch(e){}
}

function playRitualFanfare() {
    if (!audioCtx || !isMusicPlaying) return;
    try {
        const now = audioCtx.currentTime;
        function playNote(freq, start, duration) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.12, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(start); osc.stop(start + duration);
        }
        playNote(523.25, now, 0.4);
        playNote(659.25, now + 0.15, 0.4);
        playNote(783.99, now + 0.3, 0.4);
        playNote(987.77, now + 0.45, 0.5);
        playNote(1046.50, now + 0.65, 1.2);
    } catch(e){}
}

function playSpellSound(type) {
    if (!audioCtx || !isMusicPlaying) return;
    try {
        const now = audioCtx.currentTime;
        function playTone(freq, waveType, startTime, duration, vol=0.1) {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.type = waveType;
            o.frequency.value = freq;
            g.gain.setValueAtTime(0, startTime);
            g.gain.linearRampToValueAtTime(vol, startTime + duration*0.1);
            g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            o.connect(g); g.connect(audioCtx.destination);
            o.start(startTime); o.stop(startTime + duration);
        }
        switch (type) {
            case 'Strings': playTone(440, 'sawtooth', now, 1.2, 0.05); playTone(659.25, 'sawtooth', now, 1.2, 0.05); break;
            case 'Woodwinds': playTone(1046.50, 'sine', now, 0.8, 0.1); break;
            case 'Brass': playTone(466.16, 'square', now, 0.6, 0.03); playTone(698.46, 'square', now+0.15, 0.6, 0.03); break;
            case 'Piano': 
                playTone(523.25, 'triangle', now, 0.4, 0.1); playTone(659.25, 'triangle', now+0.1, 0.4, 0.1);
                playTone(783.99, 'triangle', now+0.2, 0.4, 0.1); playTone(1046.50, 'triangle', now+0.3, 0.8, 0.1);
                break;
            case 'Major Key': playTone(523.25, 'triangle', now, 0.8, 0.1); playTone(659.25, 'triangle', now, 0.8, 0.1); playTone(783.99, 'triangle', now, 0.8, 0.1); break;
            case 'Minor Key': playTone(440, 'triangle', now, 0.8, 0.1); playTone(523.25, 'triangle', now, 0.8, 0.1); playTone(659.25, 'triangle', now, 0.8, 0.1); break;
            case 'Pentatonic': [523.25, 587.33, 659.25, 783.99, 880].forEach((f, i) => playTone(f, 'sine', now + i*0.12, 0.4, 0.08)); break;
            case 'Slow tempo': playTone(800, 'square', now, 0.08, 0.02); playTone(800, 'square', now+0.5, 0.08, 0.02); break;
            case 'Moderate tempo': playTone(800, 'square', now, 0.08, 0.02); playTone(800, 'square', now+0.25, 0.08, 0.02); break;
            case 'Fast tempo': playTone(800, 'square', now, 0.08, 0.02); playTone(800, 'square', now+0.12, 0.08, 0.02); break;
            case 'fire': playTone(150, 'sawtooth', now, 0.8, 0.1); break;
            case 'ice': playTone(1200, 'sine', now, 0.4, 0.1); break;
            case 'music': playTone(659.25, 'triangle', now, 0.8, 0.1); break;
        }
    } catch(e){}
}

// =========================================
// 📜 主題情境配樂引導劇本
// =========================================
const rpgFlow = [
    {
        systemText: "【系統提示】你推開了魔法公會沉重的木門，煙霧瀰漫...",
        getDialogue: () => `翁sir 扶了扶眼鏡，親切地笑道：「歡迎你，小小配樂家！你抽到了『${adventureState.moodTitle}』命運卡！要為這個場景譜寫出完美的音樂，我們必須像真正的作曲家一樣，思考節奏、音色與調性。準備好接受我的配樂引導了嗎？」`,
        choices: [{ text: "我準備好了，翁sir！", nextStep: 1 }]
    },
    {
        systemText: "【第一道配樂考驗：場景步伐與節奏】",
        getDialogue: () => `翁sir 問道：「首先，閉上眼睛想像『${adventureState.moodTitle}』的畫面。如果這是一部電影，裡面的主角步伐與場景流動應該是怎樣的速度？」`,
        choices: [
            { text: "🐢 沉靜緩慢 (慢板 Adagio)", value: "Slow tempo (Adagio), 60 BPM", nextStep: 2, key: "tempo", sound: "Slow tempo", 
              action: () => evaluateStep('tempo', 'Slow tempo (Adagio), 60 BPM') },
            { text: "🚶 悠閒漫步 (行板 Andante)", value: "Moderate tempo (Andante), 85 BPM", nextStep: 2, key: "tempo", sound: "Moderate tempo", 
              action: () => evaluateStep('tempo', 'Moderate tempo (Andante), 85 BPM') },
            { text: "🏃 歡樂奔馳 (快板 Allegro)", value: "Fast tempo (Allegro), 130 BPM", nextStep: 2, key: "tempo", sound: "Fast tempo", 
              action: () => evaluateStep('tempo', 'Fast tempo (Allegro), 130 BPM') }
        ]
    },
    {
        systemText: "【第二道配樂考驗：場景靈魂樂器】",
        getDialogue: () => {
            return `翁sir 讚許道：「很好的節奏設定！聽聽這節拍，『${adventureState.moodTitle}』的律動感立刻出來了！<br><br>接下來是【音色法器】。要描繪這個故事，哪一種樂器家族最能代表你的主角音色？」`;
        },
        choices: [
            { text: "🎻 弦樂家族 (提琴)", value: "Strings", nextStep: 3, key: "instrument", sound: "Strings", action: () => evaluateStep('instrument', 'Strings') },
            { text: "🌬️ 木管家族 (長笛)", value: "Woodwinds", nextStep: 3, key: "instrument", sound: "Woodwinds", action: () => evaluateStep('instrument', 'Woodwinds') },
            { text: "🎺 銅管家族 (小號)", value: "Brass", nextStep: 3, key: "instrument", sound: "Brass", action: () => evaluateStep('instrument', 'Brass') },
            { text: "🎹 鍵盤法器 (鋼琴)", value: "Piano", nextStep: 3, key: "instrument", sound: "Piano", action: () => evaluateStep('instrument', 'Piano') }
        ]
    },
    {
        systemText: "【突發事件！】魔法大釜劇烈抖動！",
        getDialogue: () => `「不好！法器注入的魔力與『${adventureState.moodTitle}』產生了強烈共鳴，法陣快要失控了！快幫我選擇應對魔法！」`,
        choices: [
            { text: "🔥 施放火球術", nextStep: 4, action: () => { adventureState.eventChoice = "fire"; playSpellSound("fire"); } },
            { text: "❄️ 施放冰凍術", nextStep: 4, action: () => { adventureState.eventChoice = "ice"; playSpellSound("ice"); } },
            { text: "🎵 演奏舒緩音階", nextStep: 4, action: () => { adventureState.eventChoice = "music"; playSpellSound("music"); } }
        ]
    },
    {
        systemText: "【第三道配樂考驗：故事的光影色彩】",
        getDialogue: () => {
            let ev = adventureState.eventChoice === "fire" ? "「哇啊！差點把鬍子燒焦了，但總算穩定了！」" :
                     adventureState.eventChoice === "ice" ? "「呼... 結了一層霜，魔力終於冷靜下來了！」" : "「精采！溫和的音階讓暴躁的魔力瞬間安靜了！」";
            return `${ev}<br><br>「化險為夷！第三道咒語是【光影色彩】。你希望『${adventureState.moodTitle}』帶給聽眾什麼樣的情緒色彩？聽聽看這些和弦的聲音！」`;
        },
        choices: [
            { text: "☀️ 光明大調 (Major Key)", value: "composed in Major Key", nextStep: 5, key: "tonality", sound: "Major Key", action: () => evaluateStep('tonality', 'composed in Major Key') },
            { text: "🌑 暗影小調 (Minor Key)", value: "composed in Minor Key", nextStep: 5, key: "tonality", sound: "Minor Key", action: () => evaluateStep('tonality', 'composed in Minor Key') },
            { text: "🌟 星光音階 (Pentatonic)", value: "composed in Pentatonic Scale", nextStep: 5, key: "tonality", sound: "Pentatonic", action: () => evaluateStep('tonality', 'composed in Pentatonic Scale') }
        ]
    },
    {
        systemText: "【第四道配樂考驗：聲音精靈與敘事】",
        getDialogue: () => {
            return `翁sir 瞇起眼睛：「這個調性太貼切了！完美烘托出『${adventureState.moodTitle}』的情感深淺！<br><br>最後一道咒語是【靈魂之聲】。這部配樂需要人類精靈唱出歌詞，還是純樂器電影原聲帶？」`;
        },
        choices: [
            { text: "純樂器魔法", value: "Instrumental only, no vocals", nextStep: 6, key: "vocal", action: () => adventureState.solveScore += 0.5 },
            { text: "男聲精靈 (男聲)", value: "Featuring a male lead vocalist", nextStep: 6, key: "vocal", action: () => adventureState.solveScore += 0.5 },
            { text: "女聲精靈 (女聲)", value: "Featuring a female lead vocalist", nextStep: 6, key: "vocal", action: () => adventureState.solveScore += 0.5 }
        ]
    }
];

function evaluateStep(type, selectedValue) {
    const title = adventureState.moodTitle;
    let score = 0.5;
    if (type === 'tempo') {
        if (["快樂動物園", "遊樂園探險", "熱血運動會", "闖關遊戲", "生日派對"].includes(title)) {
            if (selectedValue.includes("Fast")) score = 1.5;
            else if (selectedValue.includes("Moderate")) score = 1.0;
        } else if (["甜甜夢鄉", "下雨的窗邊", "海底世界"].includes(title)) {
            if (selectedValue.includes("Slow")) score = 1.5;
            else if (selectedValue.includes("Moderate")) score = 1.0;
        } else {
            if (selectedValue.includes("Moderate")) score = 1.5;
            else score = 1.0;
        }
    } else if (type === 'instrument') {
        if (title === "下雨的窗邊" || title === "甜甜夢鄉") {
            if (selectedValue === "Piano" || selectedValue === "Strings") score = 1.5;
        } else if (title === "熱血運動會" || title === "遊樂園探險") {
            if (selectedValue === "Brass") score = 1.5;
        } else if (title === "快樂動物園" || title === "海底世界" || title === "魔法森林") {
            if (selectedValue === "Woodwinds") score = 1.5;
        } else {
            score = 1.0;
        }
    } else if (type === 'tonality') {
        if (["快樂動物園", "遊樂園探險", "生日派對", "熱血運動會"].includes(title)) {
            if (selectedValue.includes("Major")) score = 1.5;
        } else if (["下雨的窗邊", "宇宙探險", "闖關遊戲"].includes(title)) {
            if (selectedValue.includes("Minor")) score = 1.5;
        } else if (["魔法森林", "甜甜夢鄉", "海底世界"].includes(title)) {
            if (selectedValue.includes("Pentatonic")) score = 1.5;
        } else {
            score = 1.0;
        }
    }
    adventureState.solveScore += score;
}

// 打字機引擎
let typingInterval;
function typeWriterEffect(element, htmlString, speed, onComplete, isSystem = false) {
    clearInterval(typingInterval); 
    if (!element) return;
    element.innerHTML = ''; 
    element.classList.add('typing-cursor'); 
    let i = 0;
    typingInterval = setInterval(() => {
        if (i < htmlString.length) {
            if (htmlString.charAt(i) === '<') {
                let tagEnd = htmlString.indexOf('>', i);
                if (tagEnd !== -1) { element.innerHTML += htmlString.substring(i, tagEnd + 1); i = tagEnd + 1; return; }
            }
            const char = htmlString.charAt(i);
            element.innerHTML += char;
            if (char !== ' ' && char !== '　' && char !== '\n') playTextBleep(isSystem);
            i++;
        } else {
            clearInterval(typingInterval); 
            element.classList.remove('typing-cursor'); 
            if (onComplete) onComplete();
        }
    }, speed);
}

function renderRPGStep(stepIndex) {
    adventureState.step = stepIndex;
    const currentStep = rpgFlow[stepIndex];
    const choicesContainer = document.getElementById('adventureChoices');
    const systemBox = document.getElementById('systemBox');
    const tutorTextElement = document.getElementById('tutorText');
    
    if (choicesContainer) { choicesContainer.style.display = 'none'; choicesContainer.innerHTML = ''; }
    if (tutorTextElement) tutorTextElement.innerHTML = '';
    
    const showChoices = () => {
        if (!choicesContainer) return;
        currentStep.choices.forEach(choice => {
            const btn = document.createElement('button'); btn.className = 'retro-choice-btn'; btn.innerHTML = choice.text;
            btn.addEventListener('click', () => {
                if (choice.action) choice.action();
                if (choice.key) adventureState[choice.key] = choice.value;
                if (choice.sound) playSpellSound(choice.sound);
                
                choice.nextStep === 6 ? triggerEvaluationReveal() : renderRPGStep(choice.nextStep);
            });
            choicesContainer.appendChild(btn);
        });
        choicesContainer.style.display = 'grid'; 
    };
    if (currentStep.systemText) {
        if (systemBox) systemBox.style.display = 'block';
        typeWriterEffect(systemBox, currentStep.systemText, 30, () => {
            setTimeout(() => typeWriterEffect(tutorTextElement, currentStep.getDialogue(), 30, showChoices, false), 300);
        }, true); 
    } else {
        if (systemBox) systemBox.style.display = 'none';
        typeWriterEffect(tutorTextElement, currentStep.getDialogue(), 30, showChoices, false);
    }
}

function triggerEvaluationReveal() {
    if (ffCanvasContainer) ffCanvasContainer.style.opacity = "0"; 
    
    if (appContainer) {
        appContainer.classList.add('screen-shake');
        setTimeout(() => appContainer.classList.remove('screen-shake'), 600);
    }
    playRitualFanfare();
    const finalScore = Math.min(adventureState.solveScore, 5).toFixed(1);
    const scoreEl = document.getElementById('problemSolvingScore');
    if (scoreEl) scoreEl.innerText = `${finalScore} / 5 分`;
    showPage(page3); 
    
    const evalDialogue = `「太棒了！你的樂理探究旅程已經完成，我們來看看你獲得了幾分音樂法力吧！」`;
    const evalTextEl = document.getElementById('evalTutorText');
    if (evalTextEl) typeWriterEffect(evalTextEl, evalDialogue, 30);
}

// 🔮 異步向 Google 試算表拉取最新數據
async function fetchWallData() {
    const wall = document.getElementById('wallContainer');
    if (!wall) return;
    wall.innerHTML = "<p style='color:#38bdf8; grid-column: 1/-1;'>正在感應靈感石碑的共鳴...</p>";
    try {
        const res = await fetch(GAS_API_URL);
        const data = await res.json();
        inspirationWall = data;
        renderWall();
    } catch(err) {
        wall.innerHTML = "<p style='color:#f87171; grid-column: 1/-1;'>未能與雲端同步，改為讀取備用數據中...</p>";
        setTimeout(() => {
            renderWall();
        }, 1000);
    }
}

// 🎨 渲染靈感牆：網址已隱藏，點擊文字直接聽歌
function renderWall() {
    const wall = document.getElementById('wallContainer');
    if (!wall) return;
    wall.innerHTML = "";
    
    if (inspirationWall.length === 0) {
        wall.innerHTML = "<p style='color:#94a3b8; grid-column: 1/-1;'>石碑上尚未刻入任何咒語，成為第一位魔法音樂學徒吧！</p>";
        return;
    }
    [...inspirationWall].reverse().forEach((item, index) => {
        const card = document.createElement('div');
        card.className = "wall-item";
        card.innerHTML = `
            <h4>${item.name} 的作品</h4>
            <p class="wall-mood">🔮主題：${item.mood}</p>
            <div style="font-size: 0.8rem; background: rgba(0,0,0,0.4); padding: 8px; border-radius: 6px; margin-bottom: 12px; text-align: left; border-left: 3px solid #00ffff;">
                <p style="margin-bottom:0; color: #e0f2fe;">🔍 探究解難能力: ${item.solveScore} / 5 分</p>
            </div>
            <div class="qr-wrapper"><canvas id="qr-${index}" class="qr-canvas"></canvas></div>
            
            <p style="font-size: 0.8rem; margin-top: 5px;">
                <a href="${item.url}" target="_blank" style="color: #a855f7; text-decoration: underline; font-weight: bold;">
                    📱 點擊或掃描聽音樂
                </a>
            </p>
        `;
        wall.appendChild(card);
        setTimeout(() => {
            try {
                new QRious({ element: document.getElementById(`qr-${index}`), value: item.url, size: 250, background: '#ffffff', foreground: '#000000', level: 'M' });
            } catch(e){}
        }, 10);
    });
}

function resetApp() {
    if (ffCanvasContainer) ffCanvasContainer.style.opacity = "1"; 
    adventureState = { moodTitle: "", moodPrompt: "", vocal: "", instrument: "", tonality: "", tempo: "", step: 0, eventChoice: null, solveScore: 0 };
    
    if (moodCard) moodCard.classList.remove('flipped');
    if (reDrawBtn) reDrawBtn.classList.add('hidden-btn');
    if (startAdventureBtn) startAdventureBtn.classList.add('hidden-btn');
    if (singleCardArea) singleCardArea.classList.add('hidden-area');
    if (deckArea) deckArea.classList.remove('hidden-area');
    
    clearInterval(typingInterval);
    if (!isMusicPlaying && bgMusic) { 
        bgMusic.volume = 0.5; 
        bgMusic.play().then(() => { 
            isMusicPlaying = true; 
            if (musicToggle) musicToggle.innerText = "🔊"; 
        }).catch(()=>{}); 
    }
    showPage(page1);
}

let idleTime = 0;
setInterval(() => { idleTime++; if (idleTime >= 120 && page1 && page1.classList.contains('hidden')) resetApp(); }, 1000);
['mousemove', 'mousedown', 'keypress', 'touchstart'].forEach(evt => document.addEventListener(evt, () => idleTime = 0, false));

// =================================================================
// 🌌 Final Fantasy 3D 水晶星空背景引擎
// =================================================================
let scene, camera, renderer, crystalMesh, outerRingsGroup, starField, waveMesh;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 0;

function createGlowPointTexture() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(147, 197, 253, 0.9)');
        gradient.addColorStop(0.7, 'rgba(168, 85, 247, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
    } catch(e) { return null; }
}

function initFF3DBackground() {
    try {
        if (typeof THREE === 'undefined') return;
        const container = document.getElementById('ff-canvas-container');
        if (!container || renderer) return;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 3000);
        camera.position.set(0, 0, 680);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        const crystalGeo = new THREE.OctahedronGeometry(110, 0);
        const crystalMat = new THREE.MeshBasicMaterial({
            color: 0x67e8f9, wireframe: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending
        });
        crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
        scene.add(crystalMesh);
        const innerGeo = new THREE.OctahedronGeometry(75, 0);
        const innerMat = new THREE.MeshBasicMaterial({
            color: 0xd946ef, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending
        });
        const innerCrystal = new THREE.Mesh(innerGeo, innerMat);
        crystalMesh.add(innerCrystal);
        outerRingsGroup = new THREE.Group();
        const ringConfigs = [
            { radius: 210, width: 12, color: 0x38bdf8, rx: 1.1, ry: 0.3 },
            { radius: 290, width: 15, color: 0xc084fc, rx: 0.8, ry: -0.4 },
            { radius: 370, width: 10, color: 0xf472b6, rx: 1.4, ry: 0.6 }
        ];
        ringConfigs.forEach(cfg => {
            const ringGeo = new THREE.RingGeometry(cfg.radius, cfg.radius + cfg.width, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: cfg.color, side: THREE.DoubleSide, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = cfg.rx;
            ring.rotation.y = cfg.ry;
            outerRingsGroup.add(ring);
        });
        scene.add(outerRingsGroup);
        const starCount = 1200;
        const starGeo = new THREE.BufferGeometry();
        const starPos = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        const palette = [new THREE.Color(0x93c5fd), new THREE.Color(0xd8b4fe), new THREE.Color(0x67e8f9), new THREE.Color(0xfbcfe8)];
        for (let i = 0; i < starCount; i++) {
            starPos[i * 3] = (Math.random() - 0.5) * 1600;
            starPos[i * 3 + 1] = (Math.random() - 0.5) * 1600;
            starPos[i * 3 + 2] = (Math.random() - 0.5) * 1200;
            const c = palette[Math.floor(Math.random() * palette.length)];
            starColors[i * 3] = c.r; starColors[i * 3 + 1] = c.g; starColors[i * 3 + 2] = c.b;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        const tex = createGlowPointTexture();
        const starMat = new THREE.PointsMaterial({
            size: 14, map: tex, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false
        });
        starField = new THREE.Points(starGeo, starMat);
        scene.add(starField);
        const waveGeo = new THREE.PlaneGeometry(1600, 1000, 32, 24);
        const waveMat = new THREE.MeshBasicMaterial({
            color: 0x1e3a8a, wireframe: true, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending
        });
        waveMesh = new THREE.Mesh(waveGeo, waveMat);
        waveMesh.rotation.x = -Math.PI / 2.3;
        waveMesh.position.y = -260;
        scene.add(waveMesh);
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.2;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.2;
        });
        window.addEventListener('resize', onWindowResize);
        animateFFBackground();
    } catch(err){}
}

function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

let waveTimer = 0;
function animateFFBackground() {
    requestAnimationFrame(animateFFBackground);
    try {
        if (crystalMesh) { crystalMesh.rotation.y += 0.005; crystalMesh.rotation.x += 0.003; }
        if (outerRingsGroup) {
            outerRingsGroup.rotation.z += 0.0015;
            outerRingsGroup.children.forEach((ring, idx) => ring.rotation.z -= 0.001 * (idx + 1));
        }
        if (starField) starField.rotation.y += 0.0004;
        if (waveMesh) {
            waveTimer += 0.03;
            const pos = waveMesh.geometry.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const u = i % 33; const v = Math.floor(i / 33);
                const z = Math.sin(u * 0.5 + waveTimer) * 18 + Math.cos(v * 0.4 + waveTimer) * 18;
                pos.setZ(i, z);
            }
            pos.needsUpdate = true;
        }
        if (camera) {
            targetCameraX += (mouseX - targetCameraX) * 0.04;
            targetCameraY += (-mouseY - targetCameraY) * 0.04;
            camera.position.x = targetCameraX;
            camera.position.y = targetCameraY;
            camera.lookAt(0, 0, 0);
        }
        if (renderer && scene && camera) renderer.render(scene, camera);
    } catch(e){}
}

window.addEventListener('DOMContentLoaded', () => {
    try {
        initFF3DBackground();
        fetchWallData();
    } catch(e){}
});
