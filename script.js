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

// 🆕 新增：答對解鎖卡牌的 3D 彈出層綁定
const cardUnlockOverlay = document.getElementById('cardUnlockOverlay');
const unlockTarotCard = document.getElementById('unlockTarotCard');
const unlockCardIcon = document.getElementById('unlockCardIcon');
const unlockCardName = document.getElementById('unlockCardName');
const unlockCardTag = document.getElementById('unlockCardTag');
const unlockCardDesc = document.getElementById('unlockCardDesc');
const confirmUnlockBtn = document.getElementById('confirmUnlockBtn');

// 用於解鎖流程的下一個 RPG 關卡快照
let nextStepIndexAfterUnlock = null;

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
    { name: "魔法學徒小華", mood: "魔法森林", url: "https://suno.com/song/demo-1", solveScore: "5" }
];

// 冒險狀態機
let adventureState = { 
    moodTitle: "", moodPrompt: "", 
    tempo: "", time_signature: "", instrument: "", sfx: "", tonality: "", 
    dynamics: "", texture: "", form: "", vocal: "", climax: "", 
    step: 0, eventChoice: null, solveScore: 0, finalIntegerScore: 1,
    collectedCards: [], // 收集到的像素音樂卡牌
    placedCards: []     // 已注入魔法陣的卡牌
};

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

// 🔗 快捷載入剪貼簿連結
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

        uploadWallBtn.disabled = true;
        uploadWallBtn.innerText = "⏳ 正在刻入試算表石碑...";

        const payload = {
            name: name,
            mood: adventureState.moodTitle,
            url: sunoUrl,
            solveScore: adventureState.finalIntegerScore.toString()
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

// 進入召喚殿堂 (Page 4)
if (nextToPage4Btn) {
    nextToPage4Btn.addEventListener('click', () => {
        showPage(page4);
        initCardAssemblyPage();
        
        const ritualDialogue = `「小小配樂家，你一共收集到了 ${adventureState.collectedCards.length} 張像素音樂卡牌！請將卡牌一一放入咒語插槽中，激活專屬的音樂元素吧！」`;
        const ritualTextEl = document.getElementById('ritualText');
        if (ritualTextEl) typeWriterEffect(ritualTextEl, ritualDialogue, 25);
    });
}

// =========================================
// 🎴 卡牌收集與插槽召喚系統核心
// =========================================
function initCardAssemblyPage() {
    adventureState.placedCards = [];
    const deckContainer = document.getElementById('collectedCardsDeck');
    const slotsContainer = document.getElementById('spellSlotsArea');
    const promptEl = document.getElementById('resultPrompt');
    const copyBtn = document.getElementById('copyPromptBtn');
    const placedCountEl = document.getElementById('placedCardCount');
    const totalCountEl = document.getElementById('totalCardCount');

    if (promptEl) promptEl.innerText = "等待注入卡牌解鎖音樂元素...";
    if (copyBtn) copyBtn.disabled = true;

    // 若未獲取任何卡牌的容錯保護
    if (adventureState.collectedCards.length === 0) {
        adventureState.collectedCards.push({
            id: 'mood',
            name: '主題基石卡',
            icon: '🔮',
            tag: '主題',
            promptSnippet: `A high quality music track for ${adventureState.moodTitle}. Atmosphere: ${adventureState.moodPrompt}.`
        });
    }

    if (totalCountEl) totalCountEl.innerText = adventureState.collectedCards.length;
    if (placedCountEl) placedCountEl.innerText = "0";

    renderAssemblyUI();
}

function renderAssemblyUI() {
    const deckContainer = document.getElementById('collectedCardsDeck');
    const slotsContainer = document.getElementById('spellSlotsArea');
    const placedCountEl = document.getElementById('placedCardCount');

    if (!deckContainer || !slotsContainer) return;

    deckContainer.innerHTML = '';
    slotsContainer.innerHTML = '';

    const remainingCards = adventureState.collectedCards.filter(c => !adventureState.placedCards.includes(c));

    if (placedCountEl) placedCountEl.innerText = adventureState.placedCards.length;

    // 渲染背包內可點選的卡牌
    if (remainingCards.length === 0) {
        deckContainer.innerHTML = "<p style='color:#4ade80; font-size:0.8rem; margin:auto;'>✨ 所有音樂卡牌已全部注入魔法陣！</p>";
    } else {
        remainingCards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'pixel-card-chip';
            cardEl.innerHTML = `
                <div class="pixel-chip-icon">${card.icon}</div>
                <div class="pixel-chip-name">${card.name}</div>
                <div class="pixel-chip-tag">${card.tag}</div>
            `;
            cardEl.addEventListener('click', () => placeCardIntoAltar(card));
            deckContainer.appendChild(cardEl);
        });
    }

    // 渲染插槽
    adventureState.collectedCards.forEach((card, idx) => {
        const slotEl = document.createElement('div');
        const isFilled = adventureState.placedCards.includes(card);
        slotEl.className = `spell-slot ${isFilled ? 'active-filled' : ''}`;
        slotEl.innerHTML = isFilled 
            ? `<span>${card.icon} ${card.name}</span>`
            : `<span>插槽 ${idx + 1}</span>`;
        slotsContainer.appendChild(slotEl);
    });
}

function placeCardIntoAltar(card) {
    if (adventureState.placedCards.includes(card)) return;

    playSpellSound('Piano');
    adventureState.placedCards.push(card);
    renderAssemblyUI();
    updateSpellScroll(false);

    // 全部卡牌注入完成
    if (adventureState.placedCards.length === adventureState.collectedCards.length) {
        triggerSummonCompletion();
    }
}

// 一鍵全部注入按鈕
const injectAllCardsBtn = document.getElementById('injectAllCardsBtn');
if (injectAllCardsBtn) {
    injectAllCardsBtn.addEventListener('click', () => {
        adventureState.placedCards = [...adventureState.collectedCards];
        playRitualFanfare();
        renderAssemblyUI();
        updateSpellScroll(true);
        triggerSummonCompletion();
    });
}

// 動態更新咒語文本
function updateSpellScroll(isComplete = false) {
    const promptEl = document.getElementById('resultPrompt');
    if (!promptEl) return;

    if (adventureState.placedCards.length === 0) {
        promptEl.innerText = "等待注入卡牌解鎖音樂元素...";
        return;
    }

    // 依序組合當前已放入卡牌所代表的樂理描述
    const baseTheme = `A high quality music track for ${adventureState.moodTitle}. `;
    const elementsText = adventureState.placedCards.map(c => c.promptSnippet).join(" ");
    
    promptEl.innerText = baseTheme + elementsText;
}

// 召喚成功儀式觸發
function triggerSummonCompletion() {
    const copyBtn = document.getElementById('copyPromptBtn');
    if (copyBtn) copyBtn.disabled = false;

    playRitualFanfare();
    if (appContainer) {
        appContainer.classList.add('screen-shake');
        setTimeout(() => appContainer.classList.remove('screen-shake'), 600);
    }

    // 生成最終嚴謹的完整 Prompt
    const fullFinalPrompt = `A high quality music track for ${adventureState.moodTitle}. ${adventureState.vocal || "Instrumental"}. Main instruments featuring ${adventureState.instrument || "Orchestra"}. ${adventureState.tonality || "Major key"}, ${adventureState.tempo || "Moderate tempo"}, ${adventureState.time_signature || "4/4 time"}. Dynamics: ${adventureState.dynamics || "Balanced"}. Texture: ${adventureState.texture || "Homophonic"}. Form: ${adventureState.form || "Theme and variation"}. Climax: ${adventureState.climax || "Grand ending"}. Atmosphere: ${adventureState.moodPrompt}. Additional SFX: ${adventureState.sfx || "Ambient nature sounds"}.`;

    const promptEl = document.getElementById('resultPrompt');
    if (promptEl) promptEl.innerText = fullFinalPrompt;

    const ritualTextEl = document.getElementById('ritualText');
    if (ritualTextEl) {
        typeWriterEffect(ritualTextEl, "「古代音樂魔導咒語已完全具現化！快點擊下方抄寫咒語，並開啟次元裂縫前往 Suno 聖地吧！」", 25);
    }
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
            case 'Minor Key': playTone(440, 'triangle', now, 0.8, 0.1); playTone(523.25, 'triangle', now, 0.8, 0.1); break;
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
        getDialogue: () => `翁sir 扶了扶眼鏡，親切地笑道：「歡迎你，小小配樂家！你抽到了『${adventureState.moodTitle}』命運卡！進行 10 道魔法考驗，每達成契合即可收集一張『像素音樂卡牌』，準備好了嗎？」`,
        choices: [{ text: "我準備好了，翁sir！", nextStep: 1 }]
    },
    { // Q1
        systemText: "【第一道配樂考驗：速度 (Tempo)】",
        getDialogue: () => `翁sir 問道：「首先，想像『${adventureState.moodTitle}』的畫面。主角的步伐與場景流動應該是怎樣的速度？」`,
        choices: [
            { text: "🐢 沉靜緩慢 (慢板 Adagio)", value: "Slow tempo (Adagio), 60 BPM", nextStep: 2, key: "tempo", sound: "Slow tempo", action: () => evaluateAndAwardCard('tempo', 'Slow tempo', '🐢 速度之石', '🐢', '速度', 'Slow tempo (Adagio), 60 BPM', '主角步伐沉靜安詳，如涓涓細流緩步流動') },
            { text: "🚶 悠閒漫步 (行板 Andante)", value: "Moderate tempo (Andante), 85 BPM", nextStep: 2, key: "tempo", sound: "Moderate tempo", action: () => evaluateAndAwardCard('tempo', 'Moderate tempo', '🚶 步調符文', '🚶', '速度', 'Moderate tempo (Andante), 85 BPM', '悠閒隨和的行進律動，適合日常漫步') },
            { text: "🏃 歡樂奔馳 (快板 Allegro)", value: "Fast tempo (Allegro), 130 BPM", nextStep: 2, key: "tempo", sound: "Fast tempo", action: () => evaluateAndAwardCard('tempo', 'Fast tempo', '🏃 奔馳徽章', '🏃', '速度', 'Fast tempo (Allegro), 130 BPM', '歡樂而雀躍的步伐，樂曲充滿熱情速度感') }
        ]
    },
    { // Q2
        systemText: "【第二道配樂考驗：拍號 (Time Signature)】",
        getDialogue: () => `翁sir 點點頭：「節拍決定了律動的感覺。你覺得這個故事的舞步是哪種節拍？」`,
        choices: [
            { text: "⚖️ 穩定行進 (4/4拍)", value: "4/4 time signature", nextStep: 3, key: "time_signature", action: () => evaluateAndAwardCard('time_signature', '4/4', '⚖️ 衡律節奏卡', '⚖️', '拍號', '4/4 time signature', '穩定有力量的四分拍，萬物和諧共鳴') },
            { text: "💃 旋轉圓舞曲 (3/4拍)", value: "3/4 time signature (Waltz)", nextStep: 3, key: "time_signature", action: () => evaluateAndAwardCard('time_signature', '3/4', '💃 圓舞符文卡', '💃', '拍號', '3/4 time signature (Waltz)', '輕盈飄逸的華爾滋圓舞律動') },
            { text: "🪖 活潑進行曲 (2/4拍)", value: "2/4 time signature (March)", nextStep: 3, key: "time_signature", action: () => evaluateAndAwardCard('time_signature', '2/4', '🪖 進行曲徽章', '🪖', '拍號', '2/4 time signature (March)', '左右交替、精神抖擻的進行曲節奏') }
        ]
    },
    { // Q3
        systemText: "【第三道配樂考驗：樂器家族 (Instrument)】",
        getDialogue: () => `「很好！接下來是【音色法器】。要描繪這個故事，哪一種樂器家族最能代表你的主角音色？」`,
        choices: [
            { text: "🎻 弦樂家族 (溫暖連綿)", value: "Strings", nextStep: 4, key: "instrument", sound: "Strings", action: () => evaluateAndAwardCard('instrument', 'Strings', '🎻 弦音魔琴卡', '🎻', '樂器', 'Featuring rich Strings ensemble', '溫柔如絲綢般的弓弦齊奏') },
            { text: "🌬️ 木管家族 (空靈清脆)", value: "Woodwinds", nextStep: 4, key: "instrument", sound: "Woodwinds", action: () => evaluateAndAwardCard('instrument', 'Woodwinds', '🌬️ 風語長笛卡', '🌬️', '樂器', 'Featuring enchanted Woodwinds', '空靈而充滿自然精靈氣息的木管') },
            { text: "🎺 銅管家族 (輝煌宏大)", value: "Brass", nextStep: 4, key: "instrument", sound: "Brass", action: () => evaluateAndAwardCard('instrument', 'Brass', '🎺 榮耀號角卡', '🎺', '樂器', 'Featuring triumphant Brass', '充滿神聖皇家光輝的金色號角') },
            { text: "🎹 鍵盤法器 (靈動敲擊)", value: "Piano", nextStep: 4, key: "instrument", sound: "Piano", action: () => evaluateAndAwardCard('instrument', 'Piano', '🎹 靈動黑白卡', '🎹', '樂器', 'Featuring expressive Piano melody', '流暢優美、輕敲靈魂的鋼琴旋律') }
        ]
    },
    { // 突發事件 (Step 4)
        systemText: "【突發事件！】魔法大釜劇烈抖動！",
        getDialogue: () => `「不好！法器注入的魔力與『${adventureState.moodTitle}』產生了強烈共鳴，法陣快要失控了！快幫我選擇應對魔法！」`,
        choices: [
            { text: "🔥 施放火球術", nextStep: 5, action: () => { adventureState.eventChoice = "fire"; playSpellSound("fire"); } },
            { text: "❄️ 施放冰凍術", nextStep: 5, action: () => { adventureState.eventChoice = "ice"; playSpellSound("ice"); } },
            { text: "🎵 演奏舒緩音階", nextStep: 5, action: () => { adventureState.eventChoice = "music"; playSpellSound("music"); } }
        ]
    },
    { // Q4
        systemText: "【第四道配樂考驗：環境音效 (SFX)】",
        getDialogue: () => {
            let ev = adventureState.eventChoice === "fire" ? "「哇啊！差點把鬍子燒焦了，但總算穩定了！」" :
                     adventureState.eventChoice === "ice" ? "「呼... 結了一層霜，魔力終於冷靜下來了！」" : "「精采！溫和的音階讓暴躁的魔力瞬間安靜了！」";
            return `${ev}<br><br>「化險為夷！現在，你想在背景中加入什麼聲音來增添環境魔法？」`;
        },
        choices: [
            { text: "🍃 微風與樹葉沙沙聲", value: "Nature sounds, gentle wind and rustling leaves", nextStep: 6, key: "sfx", action: () => evaluateAndAwardCard('sfx', 'Nature', '🍃 自然之風卡', '🍃', '環境音', 'with nature wind and rustling leaves', '林間微風拂過，發出陣陣沙沙聲') },
            { text: "🐦 鳥鳴與森林蟲鳴聲", value: "Ambient bird chirping and forest sounds", nextStep: 6, key: "sfx", action: () => evaluateAndAwardCard('sfx', 'Nature', '🐦 生靈之語卡', '🐦', '環境音', 'with ambient birds chirping', '清晨鳥兒啁啾，大自然生機勃勃') },
            { text: "✨ 閃閃發光的魔法音效", value: "Sparkling magic sound effects, chime sparkles", nextStep: 6, key: "sfx", action: () => evaluateAndAwardCard('sfx', 'Magic', '✨ 璀璨星塵卡', '✨', '環境音', 'with magical sparkling chime sparkles', '星光閃爍，魔法音效環繞四周') }
        ]
    },
    { // Q5
        systemText: "【第五道配樂考驗：調性色彩 (Tonality)】",
        getDialogue: () => `「完美的點綴！接下來是【光影色彩】。你希望這首配樂帶給聽眾什麼樣的情緒色彩？聽聽看這些和弦的聲音！」`,
        choices: [
            { text: "☀️ 光明大調 (Major Key)", value: "composed in Major Key", nextStep: 7, key: "tonality", sound: "Major Key", action: () => evaluateAndAwardCard('tonality', 'Major', '☀️ 曜日大調卡', '☀️', '調性', 'composed in Major Key', '充滿溫暖陽光、正面歡朗的情緒和弦') },
            { text: "🌑 暗影小調 (Minor Key)", value: "composed in Minor Key", nextStep: 7, key: "tonality", sound: "Minor Key", action: () => evaluateAndAwardCard('tonality', 'Minor', '🌑 暗影小調卡', '🌑', '調性', 'composed in Minor Key', '帶有一絲憂傷、神祕與暗影的情緒和弦') },
            { text: "🌟 星光音階 (Pentatonic)", value: "composed in Pentatonic Scale", nextStep: 7, key: "tonality", sound: "Pentatonic", action: () => evaluateAndAwardCard('tonality', 'Pentatonic', '🌟 星河五聲卡', '🌟', '調性', 'composed in Pentatonic Scale', '東方空靈、浩瀚無垠的五聲和聲') }
        ]
    },
    { // Q6
        systemText: "【第六道配樂考驗：力度變化 (Dynamics)】",
        getDialogue: () => `翁sir 滿意地說：「這調性太棒了！那麼，音樂的能量強弱決定了張力，這首曲子的整體力量感應該如何？」`,
        choices: [
            { text: "🤫 輕柔神祕 (Piano, p)", value: "Soft dynamics (Piano)", nextStep: 8, key: "dynamics", action: () => evaluateAndAwardCard('dynamics', 'Piano', '🤫 靜謐輕柔卡', '🤫', '力度', 'Soft dynamics (Piano)', '輕柔的呼吸聲，保留神祕與靜謐') },
            { text: "🗣️ 溫和流暢 (Mezzo-forte, mf)", value: "Moderate dynamics (Mezzo-forte)", nextStep: 8, key: "dynamics", action: () => evaluateAndAwardCard('dynamics', 'Mezzo-forte', '🗣️ 柔和流暢卡', '🗣️', '力度', 'Moderate dynamics (Mezzo-forte)', '舒適適中的音量，溫和且流暢') },
            { text: "📢 強烈震撼 (Forte, f)", value: "Loud and powerful dynamics (Forte)", nextStep: 8, key: "dynamics", action: () => evaluateAndAwardCard('dynamics', 'Forte', '📢 震撼轟鳴卡', '📢', '力度', 'Loud and powerful dynamics (Forte)', '爆發性的宏大能量，震撼聽眾耳膜') }
        ]
    },
    { // Q7
        systemText: "【第七道配樂考驗：織體層次 (Texture)】",
        getDialogue: () => `「力度控制得很好！魔法陣的結構需要確立，你希望音樂的層次是單純還是複雜？」`,
        choices: [
            { text: "🧵 單一旋律 (單音音樂)", value: "Monophonic texture, single clear melody", nextStep: 9, key: "texture", action: () => evaluateAndAwardCard('texture', 'Monophonic', '🧵 純粹單音卡', '🧵', '織體', 'Monophonic texture', '一條純粹優美的主旋律獨奏，樸實無華') },
            { text: "🧶 旋律配和弦 (主音音樂)", value: "Homophonic texture, melody with chordal accompaniment", nextStep: 9, key: "texture", action: () => evaluateAndAwardCard('texture', 'Homophonic', '🧶 和弦主音卡', '🧶', '織體', 'Homophonic texture', '經典豐滿的主旋律，襯著溫潤的和弦伴奏') },
            { text: "🕸️ 多聲部交織 (複音音樂)", value: "Polyphonic texture, complex weaving melodies", nextStep: 9, key: "texture", action: () => evaluateAndAwardCard('texture', 'Polyphonic', '🕸️ 複音交織卡', '🕸️', '織體', 'Polyphonic texture', '多個聲部優美交錯對唱，交織出複雜層次') }
        ]
    },
    { // Q8
        systemText: "【第八道配樂考驗：曲式結構 (Form)】",
        getDialogue: () => `「故事的發展需要藍圖。你想讓這首配樂依照什麼結構進行？」`,
        choices: [
            { text: "🔄 三段體 (ABA 結構)", value: "ABA Ternary form", nextStep: 10, key: "form", action: () => evaluateAndAwardCard('form', 'ABA', '🔄 三段輪迴卡', '🔄', '曲式', 'ABA Ternary form', '呈現-對比-再現的三段論述，結構嚴謹') },
            { text: "📖 主題與變奏 (變奏曲)", value: "Theme and Variation form", nextStep: 10, key: "form", action: () => evaluateAndAwardCard('form', 'Theme', '📖 奇想變奏卡', '📖', '曲式', 'Theme and Variation form', '同一主題不斷演變出全新的魔幻色彩') },
            { text: "🔁 迴旋曲式 (Rondo)", value: "Rondo form", nextStep: 10, key: "form", action: () => evaluateAndAwardCard('form', 'Rondo', '🔁 永恆迴旋卡', '🔁', '曲式', 'Rondo form', '主部旋律不斷迴繞穿插，生生不息') }
        ]
    },
    { // Q9
        systemText: "【第九道配樂考驗：人聲精靈 (Vocal/Inst)】",
        getDialogue: () => `翁sir 瞇起眼睛：「大功告成一大半了！這部配樂需要人類精靈唱出歌詞，還是純粹的樂器原聲帶？」`,
        choices: [
            { text: "純樂器魔法 (無人聲)", value: "Instrumental only, no vocals", nextStep: 11, key: "vocal", action: () => evaluateAndAwardCard('vocal', 'None', '🚫 純淨器樂卡', '🚫', '人聲', 'Instrumental only, no vocals', '排除一切人聲干擾，讓純器樂音色傾訴故事') },
            { text: "男聲精靈吟唱", value: "Featuring a male lead vocalist", nextStep: 11, key: "vocal", action: () => evaluateAndAwardCard('vocal', 'Male', '👦 晨曦男聲卡', '👦', '人聲', 'Featuring a male lead vocalist', '溫暖低沉的雄性精靈磁性吟唱') },
            { text: "女聲精靈吟唱", value: "Featuring a female lead vocalist", nextStep: 11, key: "vocal", action: () => evaluateAndAwardCard('vocal', 'Female', '👧 夜鶯女聲卡', '👧', '人聲', 'Featuring a female lead vocalist', '高亢空靈、宛若夜鶯高歌的聖潔女音') }
        ]
    },
    { // Q10
        systemText: "【第十道配樂考驗：情感高潮 (Climax)】",
        getDialogue: () => `「來到最後一道咒語！在樂曲的結尾，你希望帶給聽眾什麼樣的感受？」`,
        choices: [
            { text: "🌅 漸強後爆發的壯闊結尾", value: "Epic crescendo climax at the end", nextStep: 12, key: "climax", action: () => evaluateAndAwardCard('climax', 'Epic', '🌅 烈日爆發卡', '🌅', '終章', 'Epic crescendo climax', '聲部層層漸強，迎來如宇宙爆裂的宏大終章') },
            { text: "🌫️ 漸弱後消失在迷霧的收尾", value: "Fading out softly (Diminuendo) ending", nextStep: 12, key: "climax", action: () => evaluateAndAwardCard('climax', 'Fade', '🌫️ 幽霧消散卡', '🌫️', '終章', 'Fading out softly ending', '聲響漸漸微弱，最終輕柔地消失在夢境深處') },
            { text: "🎢 突強突弱的驚喜反轉", value: "Sudden dynamic shifts and surprise ending", nextStep: 12, key: "climax", action: () => evaluateAndAwardCard('climax', 'Surprise', '🎢 逆轉命運卡', '🎢', '終章', 'Sudden dynamic shifts', '打破常理的突強突弱，留下令人驚喜的懸念') }
        ]
    }
];

// 核心評核與卡牌獎勵機制（串接塔羅翻牌特效）
function evaluateAndAwardCard(type, selectedValue, cardName, cardIcon, cardTag, promptSnippet, cardDescText) {
    const title = adventureState.moodTitle;
    let isMatched = false;

    if (type === 'tempo') {
        if (["快樂動物園", "遊樂園探險", "熱血運動會", "闖關遊戲", "生日派對"].includes(title) && selectedValue.includes("Fast")) isMatched = true;
        else if (["甜甜夢鄉", "下雨的窗邊", "海底世界"].includes(title) && selectedValue.includes("Slow")) isMatched = true;
        else if (["魔法森林", "宇宙探險"].includes(title) && selectedValue.includes("Moderate")) isMatched = true;
    } else if (type === 'time_signature') {
        if (["遊樂園探險", "甜甜夢鄉", "魔法森林"].includes(title) && selectedValue.includes("3/4")) isMatched = true;
        else if (["熱血運動會", "闖關遊戲", "宇宙探險"].includes(title) && selectedValue.includes("4/4")) isMatched = true;
        else if (selectedValue.includes("2/4") || selectedValue.includes("4/4")) isMatched = true; 
    } else if (type === 'instrument') {
        if (["下雨的窗邊", "甜甜夢鄉"].includes(title) && selectedValue === "Strings") isMatched = true;
        else if (["熱血運動會", "遊樂園探險"].includes(title) && selectedValue === "Brass") isMatched = true;
        else if (["快樂動物園", "海底世界", "魔法森林"].includes(title) && selectedValue === "Woodwinds") isMatched = true;
        else if (["闖關遊戲", "生日派對", "宇宙探險"].includes(title) && selectedValue === "Piano") isMatched = true;
    } else if (type === 'sfx') {
        if (["魔法森林", "快樂動物園", "下雨的窗邊"].includes(title) && selectedValue.includes("Nature")) isMatched = true;
        else if (["宇宙探險", "魔法森林", "海底世界"].includes(title) && selectedValue.includes("Magic")) isMatched = true;
        else isMatched = true; 
    } else if (type === 'tonality') {
        if (["快樂動物園", "遊樂園探險", "生日派對", "熱血運動會"].includes(title) && selectedValue.includes("Major")) isMatched = true;
        else if (["下雨的窗邊", "宇宙探險", "闖關遊戲"].includes(title) && selectedValue.includes("Minor")) isMatched = true;
        else if (["魔法森林", "甜甜夢鄉", "海底世界"].includes(title) && selectedValue.includes("Pentatonic")) isMatched = true;
    } else if (type === 'dynamics') {
        if (["甜甜夢鄉", "下雨的窗邊", "海底世界"].includes(title) && selectedValue.includes("Piano")) isMatched = true;
        else if (["熱血運動會", "闖關遊戲", "宇宙探險"].includes(title) && selectedValue.includes("Forte")) isMatched = true;
        else if (["快樂動物園", "遊樂園探險", "魔法森林", "生日派對"].includes(title) && selectedValue.includes("Mezzo-forte")) isMatched = true;
    } else if (['texture', 'form', 'vocal', 'climax'].includes(type)) {
        isMatched = true; 
    }

    if (isMatched) {
        adventureState.solveScore += 1;
        
        const cardObj = {
            id: type,
            name: cardName,
            icon: cardIcon,
            tag: cardTag,
            promptSnippet: promptSnippet,
            desc: cardDescText
        };
        
        adventureState.collectedCards.push(cardObj);
        
        const counterEl = document.getElementById('rpgCardCounter');
        if (counterEl) counterEl.innerText = adventureState.collectedCards.length;

        // 🎯 暫存並導向 3D 翻牌特效
        triggerTarotPopUp(cardObj);
    } else {
        // 若答錯/不契合，不獲得卡牌，直接推進到下個 RPG 步驟
        setTimeout(() => {
            const currentStep = rpgFlow[adventureState.step];
            // 尋找當前選擇對應的 nextStep 目標
            const chosenOption = currentStep.choices.find(c => c.key === type && c.action);
            const targetNext = chosenOption ? chosenOption.nextStep : (adventureState.step + 1);
            
            targetNext === 12 ? triggerEvaluationReveal() : renderRPGStep(targetNext);
        }, 100);
    }
}

// 🆕 新增：觸發「塔羅翻牌效果」解鎖視窗
function triggerTarotPopUp(card) {
    if (!cardUnlockOverlay || !unlockTarotCard) return;

    // 1. 重設卡牌狀態 (轉回背面)
    unlockTarotCard.classList.remove('flipped');
    
    // 2. 注入解鎖卡牌的內容
    if (unlockCardIcon) unlockCardIcon.innerText = card.icon;
    if (unlockCardName) unlockCardName.innerText = card.name;
    if (unlockCardTag) unlockCardTag.innerText = card.tag;
    if (unlockCardDesc) unlockCardDesc.innerText = card.desc;

    // 3. 彈出滿版覆蓋層 (毛玻璃暗化)
    cardUnlockOverlay.classList.remove('hidden-area');
    playRitualFanfare();

    // 4. 延遲啟動 3D 翻牌動畫 (塔羅牌旋轉翻面)
    setTimeout(() => {
        unlockTarotCard.classList.add('flipped');
    }, 450);

    // 5. 紀錄下一個 RPG 關卡索引
    const currentStep = rpgFlow[adventureState.step];
    const chosenOption = currentStep.choices.find(c => c.key === card.id);
    nextStepIndexAfterUnlock = chosenOption ? chosenOption.nextStep : (adventureState.step + 1);
}

// 🆕 新增：點擊「收下卡牌」按鈕，隱藏並前進
if (confirmUnlockBtn) {
    confirmUnlockBtn.addEventListener('click', () => {
        playSpellSound('Piano');
        if (cardUnlockOverlay) cardUnlockOverlay.classList.add('hidden-area');
        
        // 推進至下個 RPG 步驟
        if (nextStepIndexAfterUnlock !== null) {
            nextStepIndexAfterUnlock === 12 ? triggerEvaluationReveal() : renderRPGStep(nextStepIndexAfterUnlock);
            nextStepIndexAfterUnlock = null;
        }
    });
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
                if (choice.key && choice.value) adventureState[choice.key] = choice.value;
                if (choice.sound) playSpellSound(choice.sound);
                
                // 如果沒有觸發 evaluateAndAwardCard (即 event 步驟或 intro 步驟)，手動推進
                if (!choice.key) {
                    choice.nextStep === 12 ? triggerEvaluationReveal() : renderRPGStep(choice.nextStep);
                }
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

// 結算與 1-5 分整數轉換邏輯
function triggerEvaluationReveal() {
    if (ffCanvasContainer) ffCanvasContainer.style.opacity = "0"; 
    
    if (appContainer) {
        appContainer.classList.add('screen-shake');
        setTimeout(() => appContainer.classList.remove('screen-shake'), 600);
    }
    playRitualFanfare();
    
    const pts = adventureState.solveScore;
    let finalIntScore = 1;
    let titleText = "初心體驗者";
    
    if (pts >= 9) { finalIntScore = 5; titleText = "傳奇配樂神童"; }
    else if (pts >= 7) { finalIntScore = 4; titleText = "高級音效法師"; }
    else if (pts >= 5) { finalIntScore = 3; titleText = "合格配樂學徒"; }
    else if (pts >= 3) { finalIntScore = 2; titleText = "見習魔法生"; }
    else { finalIntScore = 1; titleText = "初心體驗者"; }
    
    adventureState.finalIntegerScore = finalIntScore;

    const scoreEl = document.getElementById('problemSolvingScore');
    if (scoreEl) scoreEl.innerText = `${finalIntScore} / 5 分`;

    const evalCardsCountEl = document.getElementById('evalCardsCount');
    if (evalCardsCountEl) evalCardsCountEl.innerText = `${adventureState.collectedCards.length} 張`;
    
    showPage(page3); 
    
    const evalDialogue = `「太棒了！你在 10 道考驗中一共贏得了 ${adventureState.collectedCards.length} 張像素音樂卡牌，榮獲【${titleText}】階級！現在前往魔法公會將卡牌注入魔法陣，合成終極咒語吧！」`;
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

// 🎨 渲染靈感牆
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
                <p style="margin-bottom:0; color: #e0f2fe;">🔍 能力評核: ${item.solveScore} / 5 分</p>
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
    adventureState = { 
        moodTitle: "", moodPrompt: "", 
        tempo: "", time_signature: "", instrument: "", sfx: "", tonality: "", 
        dynamics: "", texture: "", form: "", vocal: "", climax: "", 
        step: 0, eventChoice: null, solveScore: 0, finalIntegerScore: 1,
        collectedCards: [],
        placedCards: []
    };
    
    const counterEl = document.getElementById('rpgCardCounter');
    if (counterEl) counterEl.innerText = "0";

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
