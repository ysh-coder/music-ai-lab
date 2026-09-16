// =========================================
// 🚀 啟動 3D 動態波浪背景
// =========================================
window.addEventListener('DOMContentLoaded', () => {
    VANTA.WAVES({
        el: "#vanta-bg", mouseControls: true, touchControls: true, gyroControls: false,
        minHeight: 200.00, minWidth: 200.00, scale: 1.00, scaleMobile: 1.00,
        color: 0x8b5cf6, shininess: 40.00, waveHeight: 20.00, waveSpeed: 0.80, zoom: 0.85          
    });
    renderWall(); 
});

// UI 元素綁定
const page1 = document.getElementById('page1');
const pageCard = document.getElementById('page-card'); 
const page2 = document.getElementById('page2');
const page3 = document.getElementById('page3');
const page4 = document.getElementById('page4');
const page5 = document.getElementById('page5'); 

const startBtn = document.getElementById('startBtn');
const startAdventureBtn = document.getElementById('startAdventureBtn'); 
const restartAdventureBtn = document.getElementById('restartAdventureBtn'); 
const restartBtn = document.getElementById('restartBtn');
const reDrawBtn = document.getElementById('reDrawBtn');

const deckArea = document.getElementById('deckArea');
const singleCardArea = document.getElementById('singleCardArea');
const deckCards = document.querySelectorAll('.deck-card'); 
const moodCard = document.getElementById('moodCard');
const moodEmoji = document.getElementById('moodEmoji');
const moodTitle = document.getElementById('moodTitle');
const moodDesc = document.getElementById('moodDesc');

const vantaBg = document.getElementById('vanta-bg'); 
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false; 

// =========================================
// 🎵 音效引擎 (Web Audio API)
// =========================================
let audioCtx;
function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}
function playTextBleep(isSystem = false) {
    if (!audioCtx || !isMusicPlaying) return; 
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'square'; 
    osc.frequency.setValueAtTime(isSystem ? 300 : 600, audioCtx.currentTime); 
    gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03); 
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.03); 
}
function playSuccessChime() {
    if (!audioCtx || !isMusicPlaying) return;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.5);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 1);
}

// =========================================
// 👦👧 測試版：5 種氣氛精準綁定 5 首【music/】子資料夾內音樂
// =========================================
const moodDatabase = [
    { emoji: "🦁", title: "快樂動物園", prompt: "Happy zoo, animal sounds, bouncy rhythm, playful, children's music", song: "music/zoo.mp3" },
    { emoji: "🎢", title: "遊樂園探險", prompt: "Amusement park, merry-go-round, joyful, laughing, carnival music for kids", song: "music/park.mp3" },
    { emoji: "🧚", title: "魔法森林", prompt: "Magical forest, fairy tale, sparkling, twinkling, whimsical, kids fantasy", song: "music/forest.mp3" },
    { emoji: "🚀", title: "宇宙探險", prompt: "Space adventure for kids, flying to stars, mysterious, upbeat sci-fi", song: "music/space.mp3" },
    { emoji: "😴", title: "甜甜夢鄉", prompt: "Sweet lullaby, gentle, quiet, bedtime story, soothing music for children", song: "music/sleep.mp3" }
];

// 靈感牆資料庫
let inspirationWall = [
    { name: "魔法師小華", mood: "魔法森林", song: "music/forest.mp3" },
    { name: "勇者阿明", mood: "宇宙探險", song: "music/space.mp3" }
];

let adventureState = { moodTitle: "", moodPrompt: "", vocal: "", instrument: "", tonality: "", tempo: "", step: 0, currentSong: "" };

// =========================================
// 📜 中世紀 RPG 劇本
// =========================================
const rpgFlow = [
    {
        systemText: "【系統提示】你推開了木門，煙霧瀰漫...",
        getDialogue: () => `學徒！你抽到了『${adventureState.moodTitle}』命運卡。我們開始施展魔法吧？`,
        choices: [{ text: "我準備好了，翁sir！", nextStep: 1 }]
    },
    {
        getDialogue: () => `第一道咒語：【靈魂之聲】。需要人類精靈的歌聲，還是純樂器演奏？`,
        choices: [
            { text: "純樂器魔法", value: "Instrumental only", nextStep: 2, key: "vocal" },
            { text: "男聲精靈", value: "Male Vocal", nextStep: 2, key: "vocal" },
            { text: "女聲精靈", value: "Female Vocal", nextStep: 2, key: "vocal" }
        ]
    },
    {
        getDialogue: () => `第二道咒語：【魔力法器】。去武器庫挑選你的主要法器吧！`,
        choices: [
            { text: "弦樂家族 (提琴)", value: "Strings", nextStep: 3, key: "instrument" },
            { text: "木管家族 (長笛)", value: "Woodwinds", nextStep: 3, key: "instrument" },
            { text: "銅管家族 (小號)", value: "Brass", nextStep: 3, key: "instrument" },
            { text: "鍵盤法器 (鋼琴)", value: "Piano", nextStep: 3, key: "instrument" }
        ]
    },
    {
        getDialogue: () => `第三道咒語：【光影結界】。你要召喚哪種色彩？`,
        choices: [
            { text: "大調 (正向歡樂)", value: "Major Key", nextStep: 4, key: "tonality" },
            { text: "小調 (神秘冒險)", value: "Minor Key", nextStep: 4, key: "tonality" },
            { text: "五聲音階 (空靈奇幻)", value: "Pentatonic", nextStep: 4, key: "tonality" }
        ]
    },
    {
        getDialogue: () => `最後一道咒語：【時間齒輪】。你要讓時間多快？`,
        choices: [
            { text: "慢板 (安靜抒情)", value: "Slow tempo", nextStep: 5, key: "tempo" },
            { text: "中板 (舒服自然)", value: "Moderate tempo", nextStep: 5, key: "tempo" },
            { text: "快板 (活力激昂)", value: "Fast tempo", nextStep: 5, key: "tempo" }
        ]
    }
];

// =========================================
// 導航、RPG 與打字機引擎
// =========================================
function showPage(pageToShow) {
    [page1, pageCard, page2, page3, page4, page5].forEach(p => { p.classList.remove('active'); p.classList.add('hidden'); });
    pageToShow.classList.remove('hidden');
    
    if (pageToShow === page5) {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.innerText = "🔇";
            isMusicPlaying = false; 
        }
    }
    requestAnimationFrame(() => setTimeout(() => pageToShow.classList.add('active'), 10));
}

let typingInterval;
function typeWriterEffect(element, htmlString, speed, onComplete, isSystem = false) {
    clearInterval(typingInterval); element.innerHTML = ''; element.classList.add('typing-cursor'); 
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
            clearInterval(typingInterval); element.classList.remove('typing-cursor'); 
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
    
    choicesContainer.style.display = 'none'; choicesContainer.innerHTML = ''; tutorTextElement.innerHTML = '';
    
    const showChoices = () => {
        currentStep.choices.forEach(choice => {
            const btn = document.createElement('button'); btn.className = 'retro-choice-btn'; btn.innerHTML = choice.text;
            btn.addEventListener('click', () => {
                if (choice.key) adventureState[choice.key] = choice.value;
                choice.nextStep === 5 ? finishRPG() : renderRPGStep(choice.nextStep);
            });
            choicesContainer.appendChild(btn);
        });
        choicesContainer.style.display = 'flex';
    };

    if (currentStep.systemText) {
        systemBox.style.display = 'block';
        typeWriterEffect(systemBox, currentStep.systemText, 40, () => {
            setTimeout(() => typeWriterEffect(tutorTextElement, currentStep.getDialogue(), 40, showChoices, false), 400);
        }, true); 
    } else {
        systemBox.style.display = 'none';
        typeWriterEffect(tutorTextElement, currentStep.getDialogue(), 40, showChoices, false);
    }
}

function finishRPG() {
    const promptText = `A track. ${adventureState.vocal}. ${adventureState.instrument}. ${adventureState.tonality}, ${adventureState.tempo}. Atmosphere: ${adventureState.moodPrompt}.`;
    document.getElementById('resultPrompt').innerText = promptText;
    document.getElementById('spellInput').value = ""; 
    
    document.getElementById('vanta-bg').style.opacity = "1"; 
    showPage(page3);
}

// =========================================
// 按鈕事件綁定
// =========================================
document.getElementById('startBtn').addEventListener('click', () => {
    initAudio(); showPage(pageCard);
    if (!isMusicPlaying) { bgMusic.volume = 0.5; bgMusic.play().then(() => { isMusicPlaying = true; musicToggle.innerText = "🔊"; }).catch(()=>{}); }
});

document.getElementById('musicToggle').addEventListener('click', () => {
    if (isMusicPlaying) { bgMusic.pause(); musicToggle.innerText = "🔇"; } 
    else { bgMusic.play(); musicToggle.innerText = "🔊"; }
    isMusicPlaying = !isMusicPlaying;
});

// 抽卡
document.querySelectorAll('.deck-card').forEach(card => {
    card.addEventListener('click', () => {
        const selectedMood = moodDatabase[Math.floor(Math.random() * moodDatabase.length)];
        document.getElementById('moodEmoji').innerText = selectedMood.emoji;
        document.getElementById('moodTitle').innerText = selectedMood.title;
        document.getElementById('moodDesc').innerText = selectedMood.desc;
        
        adventureState.moodTitle = selectedMood.title;
        adventureState.moodPrompt = selectedMood.prompt;
        adventureState.currentSong = selectedMood.song;

        document.getElementById('deckArea').classList.add('hidden-area');
        document.getElementById('singleCardArea').classList.remove('hidden-area');
        setTimeout(() => {
            document.getElementById('moodCard').classList.add('flipped');
            setTimeout(() => {
                document.getElementById('reDrawBtn').classList.remove('hidden-btn');
                document.getElementById('startAdventureBtn').classList.remove('hidden-btn'); 
            }, 800);
        }, 100);
    });
});

document.getElementById('startAdventureBtn').addEventListener('click', () => {
    initAudio(); document.getElementById('vanta-bg').style.opacity = "0"; 
    showPage(page2); renderRPGStep(0); 
});

// 複製咒語
document.getElementById('copyPromptBtn').addEventListener('click', () => {
    const prompt = document.getElementById('resultPrompt').innerText;
    navigator.clipboard.writeText(prompt);
    document.getElementById('copyPromptBtn').innerText = "✅ 複製成功";
    setTimeout(() => document.getElementById('copyPromptBtn').innerText = "📋 複製咒語", 2000);
});

// 施展魔法生成
document.getElementById('castSpellBtn').addEventListener('click', () => {
    const input = document.getElementById('spellInput').value;
    if(input.trim() === "") {
        alert("🧙‍♂️ 魔法師翁sir：你還沒有輸入咒語喔！請複製上方的咒語貼進魔法陣。");
        return;
    }
    
    showPage(page4);
    document.getElementById('loadingArea').classList.remove('hidden-area');
    document.getElementById('resultArea').classList.add('hidden-area');
    
    const progressFill = document.getElementById('progressFill');
    const loadingText = document.getElementById('loadingText');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += 2;
        progressFill.style.width = `${progress}%`;
        loadingText.innerText = progress < 50 ? `正在轉換咒語能量... ${progress}%` : `正在召喚樂器精靈... ${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            finishGeneration();
        }
    }, 80); 
});

function finishGeneration() {
    playSuccessChime();
    
    const audio = document.getElementById('generatedAudio');
    document.getElementById('generatedAudioSrc').src = adventureState.currentSong;
    audio.load();

    if(isMusicPlaying) { bgMusic.pause(); musicToggle.innerText = "🔇"; isMusicPlaying = false; }

    document.getElementById('loadingArea').classList.add('hidden-area');
    document.getElementById('resultArea').classList.remove('hidden-area');
}

// 播放器旋轉特效
const audioEl = document.getElementById('generatedAudio');
const disk = document.getElementById('recordDisk');
audioEl.addEventListener('play', () => disk.classList.add('spinning'));
audioEl.addEventListener('pause', () => disk.classList.remove('spinning'));
audioEl.addEventListener('ended', () => disk.classList.remove('spinning'));

// 上載到靈感牆
document.getElementById('uploadWallBtn').addEventListener('click', () => {
    const name = document.getElementById('authorName').value.trim();
    if(name === "") {
        alert("🧙‍♂️ 魔法師翁sir：請輸入你的名字，讓大家認識你！");
        return;
    }

    inspirationWall.push({
        name: name,
        mood: adventureState.moodTitle,
        song: adventureState.currentSong
    });
    
    audioEl.pause(); 
    renderWall();
    showPage(page5);
});

reDrawBtn.addEventListener('click', () => {
    moodCard.classList.remove('flipped');
    reDrawBtn.classList.add('hidden-btn');
    startAdventureBtn.classList.add('hidden-btn');
    
    setTimeout(() => {
        singleCardArea.classList.remove('active-area');
        singleCardArea.classList.add('hidden-area');
        deckArea.classList.remove('hidden-area');
        deckArea.classList.add('active-area');
    }, 400); 
});

// 導航按鈕
document.getElementById('viewWallBtn').addEventListener('click', () => { showPage(page5); });
document.getElementById('backToHomeBtn').addEventListener('click', resetApp);
document.getElementById('restartBtn').addEventListener('click', resetApp);
document.getElementById('restartFromPage4Btn').addEventListener('click', resetApp);
document.getElementById('restartAdventureBtn').addEventListener('click', resetApp);

function renderWall() {
    const wall = document.getElementById('wallContainer');
    wall.innerHTML = "";
    [...inspirationWall].reverse().forEach((item) => {
        const card = document.createElement('div');
        card.className = "wall-item";
        card.innerHTML = `
            <h4>${item.name} 的作品</h4>
            <p>主題：${item.mood}</p>
            <audio controls style="height: 40px; width: 100%;">
                <source src="${item.song}" type="audio/mpeg">
            </audio>
        `;
        wall.appendChild(card);
    });
}

function resetApp() {
    document.getElementById('vanta-bg').style.opacity = "1"; 
    adventureState = { moodTitle: "", moodPrompt: "", vocal: "", instrument: "", tonality: "", tempo: "", step: 0, currentSong: "" };
    
    moodCard.classList.remove('flipped');
    reDrawBtn.classList.add('hidden-btn');
    startAdventureBtn.classList.add('hidden-btn');
    singleCardArea.classList.add('hidden-area');
    deckArea.classList.remove('hidden-area');
    document.getElementById('authorName').value = "";
    audioEl.pause();
    
    clearInterval(typingInterval);

    if (!isMusicPlaying) { 
        bgMusic.volume = 0.5; 
        bgMusic.play().then(() => { 
            isMusicPlaying = true; 
            musicToggle.innerText = "🔊"; 
        }).catch(()=>{}); 
    }
    showPage(page1);
}

let idleTime = 0;
setInterval(() => { idleTime++; if (idleTime >= 120 && page1.classList.contains('hidden')) resetApp(); }, 1000);
['mousemove', 'mousedown', 'keypress', 'touchstart'].forEach(evt => document.addEventListener(evt, () => idleTime = 0, false));
