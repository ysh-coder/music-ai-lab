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
    { title: "快樂動物園", img: "快樂動物園.jfif", desc: "充滿動物叫聲與輕快跳躍的節奏。" },
    { title: "遊樂園探險", img: "旋轉木馬.jfif", desc: "像旋轉木馬一樣，充滿歡笑聲的音樂。" },
    { title: "魔法森林", img: "魔法森林.jfif", desc: "閃閃發光、有小精靈飛舞的神奇感覺。" },
    { title: "宇宙探險", img: "宇宙探險.jfif", desc: "穿上太空衣飛向星星！神祕的宇宙飛行。" },
    { title: "甜甜夢鄉", img: "甜甜夢鄉.jfif", desc: "溫柔、安靜，像搖籃曲一樣哄你睡覺。" },
    { title: "熱血運動會", img: "熱血運動會.jfif", desc: "充滿活力、大家一起加油的開心節奏！" },
    { title: "下雨的窗邊", img: "下雨的窗邊.jfif", desc: "滴滴答答的雨聲，適合安靜畫畫的放鬆音樂。" },
    { title: "海底世界", img: "海底世界.jfif", desc: "像小魚游來游去、泡泡咕嚕咕嚕的聲音。" },
    { title: "闖關遊戲", img: "闖關遊戲.jfif", desc: "像超級瑪利歐一樣，充滿挑戰與趣味的過關音樂。" },
    { title: "生日派對", img: "生日派對.jfif", desc: "開心、熱鬧，準備吹蠟燭吃蛋糕的慶祝時光。" }
];

// 本地備用數據
let inspirationWall = [
    { name: "魔法學徒小華", mood: "魔法森林", url: "https://suno.com/song/demo-1", solveScore: "5" }
];

let adventureState = { 
    moodTitle: "", 
    solveScore: 0,
    tags: [],
    step: 0
};

// =========================================
// 🎓 10 主題 × 12 關專屬題庫數據 (修正拼寫錯誤，保證不崩潰)
// =========================================
function getThemeQuestions(title) {
    const isFast = (title === "熱血運動會" || title === "闖關遊戲" || title === "快樂動物園");
    const isPlayful = (title === "遊樂園探險" || title === "生日派對");
    
    return [
        {
            systemText: `【第一關：音樂心跳 (速度)】閉上眼睛想像『${title}』的畫面，這首配樂的心跳節奏應該有多快？`,
            choices: [
                { text: "運輸散步 (慢慢的，慢板)", score: isFast ? 0.5 : 1.5, tag: "slow relaxing tempo", sound: "Slow tempo" },
                { text: "🚶 熱身漫步 (中等速度，行板)", score: isPlayful ? 1.5 : 1.0, tag: "moderate steady tempo, 90 bpm", sound: "Moderate tempo" },
                { text: "🏃 活力奔馳 (非常輕快，急板)", score: isFast ? 1.5 : 0.6, tag: "upbeat fast tempo, energetic, 130 bpm", sound: "Fast tempo" }
            ]
        },
        {
            systemText: `【第二關：身體步伐 (拍號)】配合『${title}』的場景律動，哪種拍子最能帶起身體的擺動？`,
            choices: [
                { text: "🥁 一二、一二 (咚噠、咚噠，兩拍子進行曲步伐)", score: isFast ? 1.5 : 0.8, tag: "steady 2/4 marching beat", sound: "music" },
                { text: "💃 轉圈圈 (咚噠噠、咚噠噠，三拍子圓舞曲步伐)", score: isPlayful ? 1.5 : 0.8, tag: "swaying 3/4 waltz rhythm", sound: "music" },
                { text: "🚶 穩穩當當、最安心的 4/4 四拍子", score: (!isFast && !isPlayful) ? 1.5 : 1.0, tag: "gentle balanced 4/4 meter", sound: "music" }
            ]
        },
        {
            systemText: `【第三關：前進動力 (節奏型)】為了襯托『${title}』的畫面，背景的節奏應該怎麼彈奏？`,
            choices: [
                { text: "⚡ 連續跳躍、充滿前進動力的跳音節奏", score: isFast ? 1.5 : 0.8, tag: "bouncy syncopated staccato rhythm", sound: "Fast tempo" },
                { text: "🍃 輕柔緩慢、像微風拂過的長音節奏", score: !isFast ? 1.5 : 0.6, tag: "smooth continuous sustained notes", sound: "Slow tempo" },
                { text: "🤖 像機械人一樣規則敲打的節奏", score: 0.5, tag: "steady mechanical pulse", sound: "Moderate tempo" }
            ]
        },
        {
            systemText: `【第四關：音樂顏色 (調性)】要表現出『${title}』的情感色彩，音樂應該使用什麼光影顏色？`,
            choices: [
                { text: "☀️ 陽光大調 (聽起來開心、溫暖又明亮)", score: (title !== "下雨的窗邊" && title !== "宇宙探險") ? 1.5 : 0.8, tag: "bright joyful Major Key", sound: "Major Key" },
                { text: "🌑 神祕小調 (帶點思念、冒險或憂傷)", score: (title === "下雨的窗邊" || title === "宇宙探險" || title === "闖關遊戲") ? 1.5 : 0.6, tag: "mysterious minor key tonality", sound: "Minor Key" },
                { text: "🏮 東方五聲音階 (像走進神奇仙境)", score: (title === "魔法森林" || title === "海底世界") ? 1.5 : 0.9, tag: "dreamy oriental Pentatonic Scale", sound: "Pentatonic" }
            ]
        },
        {
            systemText: `【第五關：氣氛營造 (和聲)】當故事出現特別情節時，背景和弦要呈現什麼感覺？`,
            choices: [
                { text: "☕ 聽起來很舒服、很放鬆的『協和音』", score: 1.5, tag: "warm sweet consonant harmony", sound: "Piano" },
                { text: "🔥 有點撞擊、刺激懸疑的『不協和音』", score: isFast ? 1.5 : 0.6, tag: "dramatic tense chord progression", sound: "fire" },
                { text: "💤 輕柔平靜、讓人安心的和聲", score: 1.0, tag: "soothing peaceful ambiance chords", sound: "Piano" }
            ]
        },
        {
            systemText: `【第六關：天空與大地 (音區)】主角在場景中登場時，旋律主要在什麼高度響起？`,
            choices: [
                { text: "🔔 清脆明亮的高音區 (像精靈與小鳥)", score: (title === "魔法森林" || title === "快樂動物園") ? 1.5 : 1.0, tag: "sparkling high-register melodies", sound: "ice" },
                { text: "🦁 沉重深沉的低音區 (像巨獸與引力)", score: (title === "宇宙探險" || title === "闖關遊戲") ? 1.5 : 0.8, tag: "deep resonant low-bass tones", sound: "fire" },
                { text: "🚶 平和穩重的中音區 (像溫柔說話)", score: (!isFast && !isPlayful) ? 1.5 : 1.0, tag: "warm lyrical midrange", sound: "music" }
            ]
        },
        {
            systemText: `【第七關：靈魂法器 (主奏)】要為『${title}』選出主角音色，哪一種法器最能代表它？`,
            choices: [
                { text: "🎺 精神奕奕的銅管樂器 (小號、法國號)", score: isFast ? 1.5 : 0.7, tag: "heroic bright brass fanfare", sound: "Brass" },
                { text: "🎹 溫柔優雅的鍵盤法器 (鋼琴、音樂盒)", score: (!isFast && !isPlayful) ? 1.5 : 0.8, tag: "intimate warm piano and celesta", sound: "Piano" },
                { text: "🌬️ 空靈清脆的木管樂器 (長笛、豎笛)", score: (title === "魔法森林" || title === "快樂動物園") ? 1.5 : 1.0, tag: "airy woodwinds and enchanting flute", sound: "Woodwinds" },
                { text: "🎻 悠揚深情的弦樂家族 (提琴組)", score: 1.2, tag: "rich soaring strings section", sound: "Strings" }
            ]
        },
        {
            systemText: `【第八關：身歷其境 (特效)】為了讓聽眾彷彿身臨其境，背景要加入哪種環境魔法聲響？`,
            choices: [
                { text: "🍃 大自然微風、鳥鳴或溫暖雨滴聲", score: (!isFast && !isPlayful) ? 1.5 : 0.8, tag: "natural soundscape, birds, rain or wind", sound: "music" },
                { text: "🗣️ 現場開心的歡呼、拍手或笑聲", score: (isPlayful || isFast) ? 1.5 : 0.8, tag: "cheerful crowd whispers, laughter and claps", sound: "music" },
                { text: "📡 神奇的魔法閃光或電子嗶嗶聲", score: (title === "宇宙探險" || title === "闖關遊戲") ? 1.5 : 1.0, tag: "magical shimmering bells and sci-fi glimmers", sound: "ice" }
            ]
        },
        {
            systemText: `【第九關：樂器隊伍 (織體)】這場音樂冒險中，參與演奏的樂器隊伍應該有多大？`,
            choices: [
                { text: "🏰 整個管弦樂隊齊奏的大合奏 (豐富宏大)", score: isFast ? 1.5 : 0.9, tag: "full grand orchestral tutti texture", sound: "Brass" },
                { text: "🍃 只有兩三樣樂器輕聲細語 (乾淨清澈)", score: (!isFast && !isPlayful) ? 1.5 : 0.8, tag: "sparse minimalist delicate chamber layers", sound: "Strings" },
                { text: "🚶 單一樂器獨奏 (專注純樸)", score: 1.0, tag: "intimate solo instrument performance", sound: "Woodwinds" }
            ]
        },
        {
            systemText: `【第十關：音量呼吸 (力度)】配樂在高潮情節時，音樂的音量要怎麼變化？`,
            choices: [
                { text: "📢 突然爆發、非常有力的強音 (突強！)", score: isFast ? 1.5 : 0.7, tag: "sudden explosive sforzando dynamics", sound: "fire" },
                { text: "🌊 從小聲慢慢變得非常宏亮 (漸強)", score: 1.5, tag: "gradual swelling crescendo", sound: "fire" },
                { text: "🤫 一直保持溫柔細膩的小聲 (弱音)", score: (!isFast) ? 1.5 : 0.8, tag: "whisper soft gentle dynamics", sound: "Slow tempo" }
            ]
        },
        {
            systemText: `【第十一關：歌聲精靈 (人聲)】你希望這段配樂如何向聽眾傳遞情感？`,
            choices: [
                { text: "🎻 純樂器演奏 (無歌詞干擾，自由想像)", score: 1.5, tag: "pure instrumental soundtrack, no vocals", sound: "Piano" },
                { text: "✨ 精靈般的無歌詞輕輕哼唱 (哼鳴)", score: (title === "甜甜夢鄉" || title === "海底世界" || title === "魔法森林") ? 1.5 : 1.0, tag: "ethereal wordless vocalise hums", sound: "Strings" },
                { text: "🗣️ 齊聲大喊或熱鬧的童聲合唱", score: (isFast || isPlayful) ? 1.5 : 0.8, tag: "joyful choral chants and singing", sound: "music" }
            ]
        },
        {
            systemText: `【第十二關：圓滿落幕 (結尾)】冒險即將結束，這首專屬配樂要如何謝幕？`,
            choices: [
                { text: "🥁 伴隨定音鼓震撼俐落地結束！", score: isFast ? 1.5 : 0.9, tag: "grand definitive final cadence strike", sound: "fire" },
                { text: "🚂 像火車開遠一樣，慢慢消失在空氣中 (淡出)", score: (!isFast) ? 1.5 : 1.0, tag: "peaceful slow fade-out to silence", sound: "Slow tempo" },
                { text: "✨ 停留在一個晶瑩剔透的和弦餘音上", score: (title === "魔法森林" || title === "宇宙探險" || title === "下雨的窗邊") ? 1.5 : 1.0, tag: "lingering sparkling final sustained chord", sound: "ice" }
            ]
        }
    ];
}

// 學校等級制 (1 至 5 滿分制)
function calculateFinalGrade(rawScore) {
    if (rawScore >= 15.0) return 5;
    if (rawScore >= 12.0) return 4;
    if (rawScore >= 9.0)  return 3;
    if (rawScore >= 6.0)  return 2;
    return 1;
}

// =========================================
// 🔄 頁面導航與事件綁定
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
        requestAnimationFrame(() => {
            setTimeout(() => pageToShow.classList.add('active'), 10);
        });
    }
}

// 🎵 核心安全播放音樂函數 (包含自動恢復機制)
function tryPlayBackgroundMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0.5;
    
    // 強制嘗試在最具有信任度的用戶 gesture 事件中播放
    bgMusic.play()
        .then(() => {
            isMusicPlaying = true;
            if (musicToggle) musicToggle.innerText = "🔊";
            console.log("背景音樂成功解鎖自動播放！");
        })
        .catch((err) => {
            console.log("瀏覽器阻擋了音樂自動播放，已安全掛起，等待用戶點擊任何地方解鎖：", err);
            isMusicPlaying = false;
            if (musicToggle) musicToggle.innerText = "🔇";
            
            // 🌟 註冊全網頁一次性解鎖點擊：當學生點擊網頁任何地方時，自動啟動音樂
            const unlockAudio = () => {
                bgMusic.play().then(() => {
                    isMusicPlaying = true;
                    if (musicToggle) musicToggle.innerText = "🔊";
                    document.removeEventListener('click', unlockAudio);
                }).catch(()=>{});
            };
            document.addEventListener('click', unlockAudio);
        });
}

// 🌟 開始體驗按鈕 (點擊解鎖音訊並進入抽卡)
if (startBtn) {
    startBtn.onclick = function() {
        initAudio(); // 優先激活 Web Audio API 脈搏
        showPage(pageCard);
        tryPlayBackgroundMusic(); // 用最高優先級去嘗試播放音樂
    };
}

// 音樂開關
if (musicToggle) {
    musicToggle.onclick = function() {
        if (!bgMusic) return;
        initAudio();
        if (isMusicPlaying) { 
            bgMusic.pause(); 
            musicToggle.innerText = "🔇"; 
        } else { 
            bgMusic.play().then(() => {
                musicToggle.innerText = "🔊"; 
            }).catch(()=>{}); 
        }
        isMusicPlaying = !isMusicPlaying;
    };
}

// 抽卡點擊
deckCards.forEach(card => {
    card.onclick = function() {
        const selectedMood = moodDatabase[Math.floor(Math.random() * moodDatabase.length)];
        
        if (moodCard) moodCard.classList.remove('flipped');
        if (moodImg) moodImg.src = selectedMood.img;
        if (moodTitle) moodTitle.innerText = selectedMood.title;
        if (moodDesc) moodDesc.innerText = selectedMood.desc;
        
        adventureState.moodTitle = selectedMood.title;
        adventureState.tags = [];
        adventureState.solveScore = 0;
        
        if (deckArea) deckArea.classList.add('hidden-area');
        if (singleCardArea) singleCardArea.classList.remove('hidden-area');
        
        setTimeout(() => {
            if (moodCard) moodCard.classList.add('flipped');
            setTimeout(() => {
                if (reDrawBtn) reDrawBtn.classList.remove('hidden-btn');
                if (startAdventureBtn) startAdventureBtn.classList.remove('hidden-btn'); 
            }, 800);
        }, 250);
    };
});

// 🌟 進入魔法公會按鈕 (修復崩潰衝突)
if (startAdventureBtn) {
    startAdventureBtn.onclick = function() {
        initAudio(); 
        if (ffCanvasContainer) ffCanvasContainer.style.opacity = "0"; 
        showPage(page2); 
        renderRPGStep(0); // 確保執行 100% 正確的題庫
    };
}

const copyPromptBtn = document.getElementById('copyPromptBtn');
if (copyPromptBtn) {
    copyPromptBtn.onclick = function() {
        const promptEl = document.getElementById('resultPrompt');
        if (promptEl) {
            navigator.clipboard.writeText(promptEl.innerText);
            copyPromptBtn.innerText = "✅ 抄寫成功！";
            setTimeout(() => copyPromptBtn.innerText = "📋 抄寫咒語 (複製)", 2000);
        }
    };
}

const quickPasteBtn = document.getElementById('quickPasteBtn');
if (quickPasteBtn) {
    quickPasteBtn.onclick = async function() {
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
    };
}

const uploadWallBtn = document.getElementById('uploadWallBtn');
if (uploadWallBtn) {
    uploadWallBtn.onclick = async function() {
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
    };
}

if (reDrawBtn) {
    reDrawBtn.onclick = function() {
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
    };
}

const viewWallBtn = document.getElementById('viewWallBtn');
if (viewWallBtn) {
    viewWallBtn.onclick = async function() { 
        if (ffCanvasContainer) ffCanvasContainer.style.opacity = "1"; 
        await fetchWallData(); 
        showPage(page5); 
    };
}

const backToHomeBtn = document.getElementById('backToHomeBtn');
if (backToHomeBtn) backToHomeBtn.onclick = resetApp;
const cancelToHomeBtn = document.getElementById('cancelToHomeBtn');
if (cancelToHomeBtn) cancelToHomeBtn.onclick = resetApp;
const cancelToPage3Btn = document.getElementById('cancelToPage3Btn');
if (cancelToPage3Btn) cancelToPage3Btn.onclick = () => showPage(page3);
const restartAdventureBtn = document.getElementById('restartAdventureBtn');
if (restartAdventureBtn) restartAdventureBtn.onclick = resetApp;

if (nextToPage4Btn) {
    nextToPage4Btn.onclick = function() {
        const promptText = `A high quality music track for ${adventureState.moodTitle}, ${adventureState.tags.join(', ')}. Perfect cinematic background composition.`;
        const promptEl = document.getElementById('resultPrompt');
        if (promptEl) promptEl.innerText = promptText;
        showPage(page4); 
        
        const ritualDialogue = `「現在，將你調配出的這段咒語帶去 Suno AI 聖地吧。生成音樂後，別忘了回來把它刻在靈感石碑上！」`;
        const ritualTextEl = document.getElementById('ritualText');
        if (ritualTextEl) typeWriterEffect(ritualTextEl, ritualDialogue, 30);
    };
}

// =========================================
// 🧪 打字機與 12 題大冒險動態渲染系統
// =========================================
let typingInterval;
function renderRPGStep(stepIndex) {
    adventureState.step = stepIndex;
    const currentQuestions = getThemeQuestions(adventureState.moodTitle);
    const currentQuestion = currentQuestions[stepIndex];
    
    const choicesContainer = document.getElementById('adventureChoices');
    const systemBox = document.getElementById('systemBox');
    const tutorTextElement = document.getElementById('tutorText');
    const roomTitle = document.getElementById('rpgRoomTitle');

    if (roomTitle) {
        roomTitle.innerText = `=== 魔法公會：【${adventureState.moodTitle}】考驗 (第 ${stepIndex + 1} / 12 步) ===`;
    }

    if (choicesContainer) { choicesContainer.style.display = 'none'; choicesContainer.innerHTML = ''; }
    if (tutorTextElement) tutorTextElement.innerHTML = '';
    
    const showChoices = () => {
        if (!choicesContainer || !currentQuestion) return;
        currentQuestion.choices.forEach(choice => {
            const btn = document.createElement('button'); 
            btn.className = 'retro-choice-btn'; 
            btn.innerHTML = choice.text;
            btn.onclick = function() {
                adventureState.solveScore += choice.score;
                adventureState.tags.push(choice.tag);
                
                if (choice.sound) playSpellSound(choice.sound);

                if (stepIndex >= 11) {
                    triggerEvaluationReveal();
                } else {
                    renderRPGStep(stepIndex + 1);
                }
            };
            choicesContainer.appendChild(btn);
        });
        choicesContainer.style.display = 'grid'; 
    };

    if (currentQuestion && currentQuestion.systemText) {
        if (systemBox) systemBox.style.display = 'block';
        typeWriterEffect(systemBox, currentQuestion.systemText, 30, () => {
            const dialogueText = `「做得好！選好你的魔法音樂元素後，我們就進行下一步吧！」`;
            setTimeout(() => typeWriterEffect(tutorTextElement, dialogueText, 30, showChoices, false), 300);
        }, true); 
    }
}

function triggerEvaluationReveal() {
    if (ffCanvasContainer) ffCanvasContainer.style.opacity = "0"; 
    
    if (appContainer) {
        appContainer.classList.add('screen-shake');
        setTimeout(() => appContainer.classList.remove('screen-shake'), 600);
    }
    playRitualFanfare();

    const finalGrade = calculateFinalGrade(adventureState.solveScore);
    const scoreEl = document.getElementById('problemSolvingScore');
    if (scoreEl) scoreEl.innerText = `${finalGrade} / 5 分`;
    showPage(page3); 
    
    let evalDialogue = "";
    if (finalGrade === 5) {
        evalDialogue = `「太不可思議了！你的『探究解難能力』獲得了【5分】滿分！你精準地掌控了所有的音樂元素，簡直是百年一遇的配樂天才！」`;
    } else if (finalGrade === 4) {
        evalDialogue = `「非常好！你獲得了【4分】。你對節奏、音色與調性有非常出色的理解，翁 sir 為你感到驕傲！」`;
    } else if (finalGrade === 3) {
        evalDialogue = `「恭喜通關！你獲得了【3分】。你已經基本掌握了這首配樂的關鍵要素，快去生成你的歌曲吧！」`;
    } else if (finalGrade === 2) {
        evalDialogue = `「加油！你獲得了【2分】。你基本完成了挑戰，但如果能多留意一下音量和樂器對比，魔法能量會更強喔！」`;
    } else {
        evalDialogue = `「別氣餒！你獲得了【1分】。這是一段很好的樂理探究旅程，翁 sir 鼓勵你等一下再挑戰一次！」`;
    }

    const evalTextEl = document.getElementById('evalTutorText');
    if (evalTextEl) typeWriterEffect(evalTextEl, evalDialogue, 30);
}

// 🔮 非同步向 Google 試算表拉取最新數據
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
    adventureState = { moodTitle: "", vocal: "", instrument: "", tonality: "", tempo: "", step: 0, solveScore: 0, tags: [] };
    
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
// 🔊 8-bit 合成器音效調用
// =================================================================
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
            g.gain.linearRampToValueAtTime(vol, startTime + duration * 0.1);
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

// =================================================================
// 🌌 Final Fantasy 3D 水晶星空背景引擎 (Three.js)
// =================================================================
let scene, camera, renderer, crystalMesh, outerRingsGroup, starField, waveMesh;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 0;

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
        const crystalMeshGeo = new THREE.OctahedronGeometry(110, 0);
        const crystalMeshMat = new THREE.MeshBasicMaterial({
            color: 0x67e8f9, wireframe: true, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending
        });
        crystalMesh = new THREE.Mesh(crystalMeshGeo, crystalMeshMat);
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
    } catch(e){}
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

// 確保背景與靈感牆能在載入後立即執行
function initApp() {
    try {
        initFF3DBackground();
        fetchWallData();
    } catch(e) {
        console.error("初始化錯誤:", e);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
