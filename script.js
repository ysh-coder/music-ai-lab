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

// 🔗 Google Apps Script 雲端數據庫 API 網址
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbw6ks-67_DiwUgci6kTyDeBjOOwWCl07kQR_K0awfEd9o98NhKCJMSLEawqmzB1UTJk/exec";

// =========================================
// 👦👧 10 張卡牌題庫定義
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

// 擴充 10 題所需的狀態變數
let adventureState = { 
    moodTitle: "", moodPrompt: "", 
    tempo: "", meter: "", rhythm: "", tonality: "", harmony: "", 
    register: "", instrument: "", sfx: "", dynamics: "", vocal: "", 
    step: 0, solveScore: 0 
};

// =========================================
// 🎓 10 題動態題庫生成器 (取代原本的 5 題 rpgFlow)
// =========================================
function getRpgFlow(title) {
    const isFast = ["熱血運動會", "闖關遊戲", "快樂動物園", "遊樂園探險", "生日派對"].includes(title);
    
    return [
        { // Step 0: 系統提示
            systemText: "【系統提示】你推開了魔法公會沉重的木門，煙霧瀰漫...",
            getDialogue: () => `翁sir 扶了扶眼鏡，親切地笑道：「歡迎你，小小配樂家！你抽到了『${title}』命運卡！要為這個場景譜寫出完美的音樂，我們準備了 10 道魔法考驗。準備好接受引導了嗎？」`,
            choices: [{ text: "我準備好了，翁sir！", nextStep: 1 }]
        },
        { // Step 1: Tempo
            systemText: "【第一道考驗：音樂心跳 (速度)】",
            getDialogue: () => `「首先，想像『${title}』的畫面，這首配樂的心跳節奏應該有多快？」`,
            choices: [
                { text: "🐢 散步放鬆 (慢板)", value: "slow relaxing tempo", nextStep: 2, key: "tempo", sound: "Slow tempo", action: () => adventureState.solveScore += (isFast ? 0.5 : 1.5) },
                { text: "🚶 熱身漫步 (行板)", value: "moderate steady tempo", nextStep: 2, key: "tempo", sound: "Moderate tempo", action: () => adventureState.solveScore += 1.0 },
                { text: "🏃 活力奔馳 (急板)", value: "fast upbeat tempo", nextStep: 2, key: "tempo", sound: "Fast tempo", action: () => adventureState.solveScore += (isFast ? 1.5 : 0.5) }
            ]
        },
        { // Step 2: Meter
            systemText: "【第二道考驗：身體步伐 (拍號)】",
            getDialogue: () => `「配合『${title}』的場景，哪種拍子最能帶起身體的擺動？」`,
            choices: [
                { text: "🥁 一二、一二 (兩拍子進行曲)", value: "2/4 marching beat", nextStep: 3, key: "meter", sound: "music", action: () => adventureState.solveScore += (isFast ? 1.5 : 0.5) },
                { text: "💃 轉圈圈 (三拍子圓舞曲)", value: "3/4 waltz rhythm", nextStep: 3, key: "meter", sound: "music", action: () => adventureState.solveScore += 1.0 },
                { text: "🚶 穩穩當當 (四拍子)", value: "4/4 steady meter", nextStep: 3, key: "meter", sound: "music", action: () => adventureState.solveScore += (!isFast ? 1.5 : 1.0) }
            ]
        },
        { // Step 3: Rhythm
            systemText: "【第三道考驗：前進動力 (節奏型)】",
            getDialogue: () => `「為了襯托畫面，背景的節奏應該怎麼彈奏？」`,
            choices: [
                { text: "⚡ 連續跳躍的跳音節奏", value: "bouncy staccato rhythm", nextStep: 4, key: "rhythm", sound: "Fast tempo", action: () => adventureState.solveScore += (isFast ? 1.5 : 0.5) },
                { text: "🍃 輕柔緩慢的長音節奏", value: "smooth sustained notes", nextStep: 4, key: "rhythm", sound: "Slow tempo", action: () => adventureState.solveScore += (!isFast ? 1.5 : 0.5) },
                { text: "🤖 規則敲打的平穩節奏", value: "steady rhythmic pulse", nextStep: 4, key: "rhythm", sound: "Moderate tempo", action: () => adventureState.solveScore += 1.0 }
            ]
        },
        { // Step 4: Tonality
            systemText: "【第四道考驗：音樂顏色 (調性)】",
            getDialogue: () => `「要表現出情感色彩，音樂應該使用什麼光影顏色？」`,
            choices: [
                { text: "☀️ 陽光大調 (開心明亮)", value: "bright Major Key", nextStep: 5, key: "tonality", sound: "Major Key", action: () => adventureState.solveScore += (isFast ? 1.5 : 0.5) },
                { text: "🌑 神祕小調 (思念憂傷)", value: "mysterious minor key", nextStep: 5, key: "tonality", sound: "Minor Key", action: () => adventureState.solveScore += (!isFast ? 1.5 : 0.5) },
                { text: "🏮 東方五聲音階 (神奇仙境)", value: "oriental Pentatonic Scale", nextStep: 5, key: "tonality", sound: "Pentatonic", action: () => adventureState.solveScore += (title === "魔法森林" || title === "海底世界" ? 1.5 : 1.0) }
            ]
        },
        { // Step 5: Harmony
            systemText: "【第五道考驗：氣氛營造 (和聲)】",
            getDialogue: () => `「當故事出現特別情節時，背景和弦要呈現什麼感覺？」`,
            choices: [
                { text: "☕ 舒服放鬆的『協和音』", value: "sweet consonant harmony", nextStep: 6, key: "harmony", sound: "Piano", action: () => adventureState.solveScore += 1.5 },
                { text: "🔥 刺激懸疑的『不協和音』", value: "tense dissonant chord progression", nextStep: 6, key: "harmony", sound: "fire", action: () => adventureState.solveScore += (isFast ? 1.5 : 0.5) },
                { text: "💤 輕柔平靜的安心和聲", value: "peaceful ambiance chords", nextStep: 6, key: "harmony", sound: "Piano", action: () => adventureState.solveScore += (!isFast ? 1.5 : 0.5) }
            ]
        },
        { // Step 6: Register
            systemText: "【第六道考驗：天空與大地 (音區)】",
            getDialogue: () => `「主角在場景中登場時，旋律主要在什麼高度響起？」`,
            choices: [
                { text: "🔔 清脆明亮的高音區", value: "sparkling high-register melodies", nextStep: 7, key: "register", sound: "ice", action: () => adventureState.solveScore += (!isFast ? 1.5 : 1.0) },
                { text: "🦁 沉重深沉的低音區", value: "deep low-bass tones", nextStep: 7, key: "register", sound: "fire", action: () => adventureState.solveScore += (title === "闖關遊戲" || title === "宇宙探險" ? 1.5 : 0.5) },
                { text: "🚶 平和穩重的中音區", value: "warm midrange", nextStep: 7, key: "register", sound: "music", action: () => adventureState.solveScore += 1.5 }
            ]
        },
        { // Step 7: Instrument
            systemText: "【第七道考驗：靈魂法器 (主奏)】",
            getDialogue: () => `「為『${title}』選出主角音色，哪一種法器最能代表它？」`,
            choices: [
                { text: "🎺 精神奕奕的銅管 (小號)", value: "heroic brass fanfare", nextStep: 8, key: "instrument", sound: "Brass", action: () => adventureState.solveScore += (isFast ? 1.5 : 0.5) },
                { text: "🎹 溫柔的鍵盤 (鋼琴/音樂盒)", value: "warm piano and celesta", nextStep: 8, key: "instrument", sound: "Piano", action: () => adventureState.solveScore += (!isFast ? 1.5 : 0.5) },
                { text: "🌬️ 空靈清脆的木管 (長笛)", value: "airy woodwinds and flute", nextStep: 8, key: "instrument", sound: "Woodwinds", action: () => adventureState.solveScore += (title === "魔法森林" ? 1.5 : 1.0) }
            ]
        },
        { // Step 8: SFX
            systemText: "【第八道考驗：身歷其境 (特效)】",
            getDialogue: () => `「為了讓聽眾彷彿身臨其境，背景要加入哪種環境聲響？」`,
            choices: [
                { text: "🍃 微風、鳥鳴或雨滴聲", value: "natural soundscape", nextStep: 9, key: "sfx", sound: "music", action: () => adventureState.solveScore += (!isFast ? 1.5 : 0.5) },
                { text: "🗣️ 歡呼、拍手或笑聲", value: "cheerful crowd murmurs", nextStep: 9, key: "sfx", sound: "music", action: () => adventureState.solveScore += (isFast ? 1.5 : 0.5) },
                { text: "📡 魔法閃光或電子嗶嗶聲", value: "magical shimmering sci-fi glimmers", nextStep: 9, key: "sfx", sound: "ice", action: () => adventureState.solveScore += (title === "宇宙探險" || title === "闖關遊戲" ? 1.5 : 1.0) }
            ]
        },
        { // Step 9: Dynamics
            systemText: "【第九道考驗：音量呼吸 (力度)】",
            getDialogue: () => `「配樂在情節變化時，音樂的音量要怎麼變化？」`,
            choices: [
                { text: "📢 突然爆發的強音 (突強！)", value: "sudden explosive dynamics", nextStep: 10, key: "dynamics", sound: "fire", action: () => adventureState.solveScore += (isFast ? 1.5 : 0.5) },
                { text: "🌊 從小聲變大聲 (漸強)", value: "gradual swelling crescendo", nextStep: 10, key: "dynamics", sound: "fire", action: () => adventureState.solveScore += 1.5 },
                { text: "🤫 一直保持溫柔細膩 (弱音)", value: "whisper soft gentle dynamics", nextStep: 10, key: "dynamics", sound: "Slow tempo", action: () => adventureState.solveScore += (!isFast ? 1.5 : 0.5) }
            ]
        },
        { // Step 10: Vocal
            systemText: "【第十道考驗：歌聲精靈 (人聲)】",
            getDialogue: () => `「最後一道咒語！這段配樂要不要加入人聲？」`,
            choices: [
                { text: "🎻 純樂器演奏 (無歌詞干擾)", value: "pure instrumental soundtrack, no vocals", nextStep: 11, key: "vocal", sound: "Piano", action: () => adventureState.solveScore += 1.5 },
                { text: "✨ 輕輕的無歌詞哼唱 (哼鳴)", value: "ethereal wordless vocalise hums", nextStep: 11, key: "vocal", sound: "Strings", action: () => adventureState.solveScore += (!isFast ? 1.5 : 1.0) },
                { text: "🗣️ 齊聲大喊或熱鬧的合唱", value: "joyful choral chants and singing", nextStep: 11, key: "vocal", sound: "music", action: () => adventureState.solveScore += (isFast ? 1.5 : 0.5) }
            ]
        }
    ];
}

// 🌟 學校評分制：將滿分 15 分轉換為 1 到 5 分 (整數)
function calculateFinalGrade(rawScore) {
    if (rawScore >= 12.5) return 5; // 卓越
    if (rawScore >= 10.0) return 4; // 優良
    if (rawScore >= 7.5)  return 3; // 滿意
    if (rawScore >= 5.0)  return 2; // 基本
    return 1;                       // 需努力
}

// =========================================
// 導航與交互邏輯 (完全保留初代寫法不變)
// =========================================
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
        adventureState.solveScore = 0; // 重置分數
        
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

        // 🌟 上傳到試算表的也確保是 1 到 5 分的整數
        const finalSolveScore = calculateFinalGrade(adventureState.solveScore).toString();
        
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
        // 將 10 題選擇的音樂元素整合成完美的 Suno Prompt
        const promptText = `A high quality music track for ${adventureState.moodTitle}. Atmosphere: ${adventureState.moodPrompt}. ${adventureState.tempo}, ${adventureState.meter}, ${adventureState.rhythm}, ${adventureState.tonality}, ${adventureState.harmony}, ${adventureState.register}, ${adventureState.instrument}, ${adventureState.sfx}, ${adventureState.dynamics}, ${adventureState.vocal}.`;
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
// 📜 打字機引擎與 10 題渲染系統
// =========================================
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
    
    // 動態獲取 10 題題庫
    const currentThemeFlow = getRpgFlow(adventureState.moodTitle);
    const currentStep = currentThemeFlow[stepIndex];
    
    const choicesContainer = document.getElementById('adventureChoices');
    const systemBox = document.getElementById('systemBox');
    const tutorTextElement = document.getElementById('tutorText');
    
    if (choicesContainer) { choicesContainer.style.display = 'none'; choicesContainer.innerHTML = ''; }
    if (tutorTextElement) tutorTextElement.innerHTML = '';
    
    const showChoices = () => {
        if (!choicesContainer) return;
        currentStep.choices.forEach(choice => {
            const btn = document.createElement('button'); 
            btn.className = 'retro-choice-btn'; 
            btn.innerHTML = choice.text;
            
            btn.addEventListener('click', () => {
                // 執行計分與記錄魔法選項
                if (choice.action) choice.action();
                if (choice.key) adventureState[choice.key] = choice.value;
                if (choice.sound) playSpellSound(choice.sound);
                
                // 判斷是否到達第 11 步 (索引 11, 代表全 10 題答完)
                choice.nextStep === 11 ? triggerEvaluationReveal() : renderRPGStep(choice.nextStep);
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
    
    // 🌟 呼叫換算函數，產生 1 到 5 分整數
    const finalScore = calculateFinalGrade(adventureState.solveScore);
    const scoreEl = document.getElementById('problemSolvingScore');
    if (scoreEl) scoreEl.innerText = `${finalScore} / 5 分`;
    
    showPage(page3); 
    
    // 🌟 加入專屬的 1 到 5 分鼓勵對白
    let evalDialogue = "";
    if (finalScore === 5) {
        evalDialogue = `「太不可思議了！你獲得了滿分【5分】！你精準地掌控了所有的音樂元素，簡直是天才！」`;
    } else if (finalScore === 4) {
        evalDialogue = `「非常好！你獲得了【4分】。你對音樂元素有非常出色的理解，翁 sir 為你感到驕傲！」`;
    } else if (finalScore === 3) {
        evalDialogue = `「恭喜通關！你獲得了【3分】。你基本掌握了這首配樂的關鍵要素，快去生成你的歌曲吧！」`;
    } else if (finalScore === 2) {
        evalDialogue = `「加油！你獲得了【2分】。你完成了挑戰，如果多留意音樂的對比，魔法能量會更強喔！」`;
    } else {
        evalDialogue = `「別氣餒！你獲得了【1分】。這是一段很好的探究旅程，鼓勵你再挑戰一次！」`;
    }

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
    adventureState = { 
        moodTitle: "", moodPrompt: "", 
        tempo: "", meter: "", rhythm: "", tonality: "", harmony: "", 
        register: "", instrument: "", sfx: "", dynamics: "", vocal: "", 
        step: 0, solveScore: 0 
    };
    
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
