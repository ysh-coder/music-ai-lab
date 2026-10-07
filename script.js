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
// 👦👧 10 張卡牌題庫
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
    vocal: "", 
    instrument: "", 
    tonality: "", 
    tempo: "", 
    step: 0, 
    solveScore: 0,
    tags: [] // 儲存12題選擇產生的 Suno 關鍵字
};

// =========================================
// 🎓 10 主題 × 12 題 (共 120 題) 小六專屬題庫
// =========================================
const specializedQuestionBanks = {
    "熱血運動會": [
        {
            systemText: "【第一關：音樂心跳 (速度)】在起跑線準備衝刺了！這首接力賽配樂，心跳應該有多快？",
            choices: [
                { text: "運輸散步 (慢慢的，慢板)", score: 0.5, tag: "slow walking tempo", sound: "Slow tempo" },
                { text: "🚶 慢跑熱身 (中等速度，行板)", score: 1.0, tag: "moderate jogging tempo, 100 bpm", sound: "Moderate tempo" },
                { text: "🏃 終點衝刺 (非常快，急板)", score: 1.5, tag: "fast upbeat tempo, energetic, 138 bpm", sound: "Fast tempo" }
            ]
        },
        {
            systemText: "【第二關：身體步伐 (拍號)】整齊地踏著步伐進場，哪種拍子最像體育進行曲？",
            choices: [
                { text: "🥁 一二、一二 (咚噠、咚噠，兩拍子)", score: 1.5, tag: "marching 2/4 beat, steady steps", sound: "music" },
                { text: "💃 轉圈圈 (咚噠噠、咚噠噠，三拍子)", score: 0.5, tag: "swaying 3/4 waltz beat", sound: "music" },
                { text: "👻 拍子亂亂的，完全沒有規律", score: 0.2, tag: "chaotic irregular meter", sound: "ice" }
            ]
        },
        {
            systemText: "【第三關：前進動力 (節奏型)】為了幫跑步的同學加油，底層的鼓點節奏要怎麼設計？",
            choices: [
                { text: "⚡ 連續、不停歇的快速小鼓點", score: 1.5, tag: "driving fast rhythmic drum pattern, constant snare rolls", sound: "Fast tempo" },
                { text: "☁️ 拖得很長、很慢的單音", score: 0.5, tag: "long slow sustained tones", sound: "Slow tempo" },
                { text: "🐢 每隔好幾秒才敲一下", score: 0.3, tag: "occasional sparse single hits", sound: "Slow tempo" }
            ]
        },
        {
            systemText: "【第四關：音樂顏色 (調性)】我們在陽光下拿到金牌了！這時候音樂的顏色應該是？",
            choices: [
                { text: "☀️ 陽光大調 (開心又明亮)", score: 1.5, tag: "bright and happy Major Key, celebratory", sound: "Major Key" },
                { text: "🌑 藍色小調 (雨天一樣藍色憂傷)", score: 0.5, tag: "sad nostalgic minor key", sound: "Minor Key" },
                { text: "🏮 東方仙境五聲音階", score: 0.8, tag: "mystic oriental pentatonic scale", sound: "Pentatonic" }
            ]
        },
        {
            systemText: "【第五關：緊張氣氛 (和聲)】兩位同學同時衝線！裁判看重播時，音樂如何營造緊張感？",
            choices: [
                { text: "☕ 聽起來很舒服、很和和諧的鋼琴聲", score: 0.5, tag: "peaceful sweet harmony", sound: "Piano" },
                { text: "🔥 有點刺耳撞擊的『緊張不和諧音』", score: 1.5, tag: "dramatic tense harmony, suspenseful chords", sound: "fire" },
                { text: "💤 溫柔的催眠曲和聲", score: 0.3, tag: "soft sleep lullaby harmony", sound: "Piano" }
            ]
        },
        {
            systemText: "【第六關：天空呼喊 (音區)】金牌頒獎典禮開始，全場大聲歡呼！旋律高度該怎麼安排？",
            choices: [
                { text: "🦅 很高、很響亮的高音區 (衝上雲霄)", score: 1.5, tag: "high register melodies, soaring and bright", sound: "ice" },
                { text: "🦁 很低、很沉重的低音區 (像巨獸腳步)", score: 0.5, tag: "deep low bass notes rumble", sound: "fire" },
                { text: "🚶 在中間，聽起來平平淡淡的", score: 0.8, tag: "mellow middle register", sound: "music" }
            ]
        },
        {
            systemText: "【第七關：勝利法器 (主奏)】要代表勝利的號角聲，哪一種樂器法器最有精神？",
            choices: [
                { text: "🎺 亮晶晶的小號和法國號 (銅管)", score: 1.5, tag: "triumphant brass fanfare, bright trumpets", sound: "Brass" },
                { text: "🎻 溫柔的小提琴 (弦樂器)", score: 0.8, tag: "gentle strings ensemble", sound: "Strings" },
                { text: "🌬️ 軟綿綿的雙簧管 (木管樂器)", score: 0.6, tag: "soft oboe solos", sound: "Woodwinds" }
            ]
        },
        {
            systemText: "【第八關：看台音效 (特效)】聽！觀眾席傳來了最真實的動態，加入什麼背景聲音？",
            choices: [
                { text: "🗣️ 全校同學們排山倒海的歡呼與哨子聲", score: 1.5, tag: "stadium cheers, crowd shouting, whistling background", sound: "music" },
                { text: "🌲 森林裡的鳥叫聲與流水聲", score: 0.5, tag: "forest nature birds chirping soundscape", sound: "Woodwinds" },
                { text: "🌧️ 催眠的雨滴滴答聲", score: 0.3, tag: "cozy rain fall sound effects", sound: "Piano" }
            ]
        },
        {
            systemText: "【第九關：樂器隊伍 (織體)】頒獎啦！這時候發出的魔法音樂，樂器隊伍有多少人？",
            choices: [
                { text: "🏰 全校管弦樂團大齊奏 (厚實宏大)", score: 1.5, tag: "grand full school band tutti orchestra texture", sound: "Brass" },
                { text: "🚶 只有一位同學吹牧童笛 (單薄孤單)", score: 0.5, tag: "single solo instrument, sparse texture", sound: "Woodwinds" },
                { text: "👏 只有一個人在拍手", score: 0.2, tag: "only bare hand claps", sound: "music" }
            ]
        },
        {
            systemText: "【第十關：爆發力度 (力度)】拿到獎盃的那一瞬間！音樂的音量要怎麼控制？",
            choices: [
                { text: "📢 突然變得非常大聲 (突強爆發！)", score: 1.5, tag: "loud blast, sudden strong sforzando accent", sound: "fire" },
                { text: "🍃 越來越小聲，最後聽不見 (漸弱)", score: 0.5, tag: "gradual decrescendo to silence", sound: "Slow tempo" },
                { text: "🤫 一直保持非常小聲，像講悄悄話", score: 0.3, tag: "very soft volume, quiet whispers", sound: "Slow tempo" }
            ]
        },
        {
            systemText: "【第十一關：歌聲精靈 (人聲)】為了讓這首運動會歌曲更有動感，歌聲精靈怎麼唱？",
            choices: [
                { text: "🗣️ 大家一起大喊：「加油！衝啊！」", score: 1.5, tag: "rhythmic chanting vocals, shouting, crowd chants", sound: "music" },
                { text: "👵 溫柔的阿姨唱英文抒情慢歌", score: 0.5, tag: "slow gentle adult pop singing", sound: "Strings" },
                { text: "🎻 不需要人聲，純樂器演奏", score: 1.0, tag: "pure instrumental, orchestral only", sound: "Piano" }
            ]
        },
        {
            systemText: "【第十二關：謝幕儀式 (結尾)】接力賽圓滿結束！音樂最後要怎麼謝幕？",
            choices: [
                { text: "🥁 大鼓『咚！』的一聲，震撼有力地結束", score: 1.5, tag: "sharp sudden final drum hit ending", sound: "fire" },
                { text: "🚂 慢慢變小聲，像坐火車離去 (淡出)", score: 1.0, tag: "fading out slowly to silence", sound: "Slow tempo" },
                { text: "🔌 突然斷掉，像停電一樣", score: 0.4, tag: "sudden cut-off abrupt ending", sound: "ice" }
            ]
        }
    ],
    "下雨的窗邊": [
        {
            systemText: "【第一關：音樂心跳 (速度)】靠在窗邊看雨滴慢慢滑落。這時的心情節奏是？",
            choices: [
                { text: "🐢 慢吞吞的、很放鬆 (慢板)", score: 1.5, tag: "slow cozy tempo, relaxing, 65 bpm", sound: "Slow tempo" },
                { text: "🏃 像在操場跑步一樣快 (快板)", score: 0.5, tag: "fast running tempo, allegro", sound: "Fast tempo" },
                { text: "🔥 急急忙忙的、非常緊張", score: 0.3, tag: "agitated tense high-speed tempo", sound: "fire" }
            ]
        },
        {
            systemText: "【第二關：身體步伐 (拍號)】小雨點滴滴答答地落下，輕輕搖擺，哪種拍子最舒服？",
            choices: [
                { text: "🚶 穩穩的、很安心的 4/4 四拍子", score: 1.5, tag: "steady gentle 4/4 meter, calm flow", sound: "music" },
                { text: "🏃 像跳接力賽一樣的 2/4 二拍子", score: 0.8, tag: "marching upbeat 2/4 meter", sound: "music" },
                { text: "🚨 聽不出拍子，像警報器一樣", score: 0.3, tag: "abstract beat-less soundscape", sound: "ice" }
            ]
        },
        {
            systemText: "【第三關：雨點敲擊 (節奏型)】雨滴打在玻璃窗上發出清脆的聲音。節奏應該是？",
            choices: [
                { text: "💦 輕輕的、斷斷續續的『跳音節奏』", score: 1.5, tag: "delicate pitter-patter staccato notes, raindrops rhythm", sound: "Moderate tempo" },
                { text: "⛈️ 像打雷一樣，每一下都很重", score: 0.5, tag: "heavy booming thunder-like drumming", sound: "fire" },
                { text: "📢 像警車警報器一樣長長的拉音", score: 0.3, tag: "long continuous synthesizer sirens", sound: "ice" }
            ]
        },
        {
            systemText: "【第四關：音樂顏色 (調性)】在溫暖的屋子裡看雨，音樂的顏色該選？",
            choices: [
                { text: "🌑 帶點淡淡思念、溫柔的藍色小調", score: 1.5, tag: "mellow nostalgic minor tonality, melancholic", sound: "Minor Key" },
                { text: "☀️ 明亮耀眼、興高采烈的黃色大調", score: 0.8, tag: "bright joyful Major Key", sound: "Major Key" },
                { text: "🎃 嚇人的萬聖節恐怖調子", score: 0.4, tag: "spooky dark scary Halloween scale", sound: "Minor Key" }
            ]
        },
        {
            systemText: "【第五關：溫暖熱可可 (和聲)】房間裡喝著熱可可，背景音樂的和弦聽起來要？",
            choices: [
                { text: "☕ 溫和放鬆，像咖啡館一樣舒服 (協和音)", score: 1.5, tag: "warm mellow chord progression, lo-fi chords", sound: "Piano" },
                { text: "🕸️ 像恐怖片一樣，聽了全身起雞皮疙瘩", score: 0.5, tag: "unsettling creepy dissonant chords", sound: "ice" },
                { text: "🥁 像在敲打鐵桶一樣的聲音", score: 0.2, tag: "unharmonious noisy clanging", sound: "fire" }
            ]
        },
        {
            systemText: "【第六關：雨天高度 (音區)】窗外有雨點的高音，屋內有溫暖的伴奏。聲音高度要？",
            choices: [
                { text: "🔔 亮晶晶高音配溫暖中音 (高低分明)", score: 1.5, tag: "light bell-like high notes, warm piano backing", sound: "music" },
                { text: "🐘 全部擠在最沉重的低音區 (像地震)", score: 0.3, tag: "muddy low-end rumble", sound: "fire" },
                { text: "📢 只有一個尖叫的高音", score: 0.2, tag: "flat single shrill high pitch", sound: "ice" }
            ]
        },
        {
            systemText: "【第七關：沙沙法器 (主奏)】安靜溫馨的房間裡，哪種法器樂器最合適彈出旋律？",
            choices: [
                { text: "🎹 聲音軟綿綿、暖洋洋的鋼琴 (Felt Piano)", score: 1.5, tag: "soft warm felt piano melody", sound: "Piano" },
                { text: "🎺 很大聲、亮晃晃的小號", score: 0.5, tag: "loud piercing trumpet solos", sound: "Brass" },
                { text: "🎸 搖滾電吉他", score: 0.3, tag: "distorted heavy electric guitar solos", sound: "fire" }
            ]
        },
        {
            systemText: "【第八關：雨天音效 (特效)】為了讓聽歌的人身歷其境，背景加入什麼聲音？",
            choices: [
                { text: "🌧️ 窗外沙沙雨聲與黑膠溫暖的雜音", score: 1.5, tag: "soft rain falling sound effect, cozy vinyl crackle", sound: "music" },
                { text: "🥬 菜市場賣菜的叫賣聲", score: 0.2, tag: "noisy market crowd background noises", sound: "music" },
                { text: "🏎️ 跑車在馬路上狂飆的引擎聲", score: 0.3, tag: "loud speeding race car engine sfx", sound: "fire" }
            ]
        },
        {
            systemText: "【第九關：安靜房間 (織體)】屋內很安靜，背景音樂的樂器排隊隊伍應該？",
            choices: [
                { text: "🍃 只有鋼琴和簡單的背景墊樂 (乾淨簡單)", score: 1.5, tag: "minimalist clean instrument layers, simple lofi", sound: "Strings" },
                { text: "🏰 一百種樂器大合奏 (厚重交響)", score: 0.5, tag: "full heavy symphony orchestra", sound: "Brass" },
                { text: "🤫 完全沒有伴奏，死寂一片", score: 0.3, tag: "absolute silence", sound: "Slow tempo" }
            ]
        },
        {
            systemText: "【第十關：悄悄音量 (力度)】雨天場景非常安靜，背景音樂的音量要控制在？",
            choices: [
                { text: "🤫 像講悄悄話一樣溫柔小聲 (中弱/弱)", score: 1.5, tag: "quiet whispers volume, peaceful, soft dynamics", sound: "Slow tempo" },
                { text: "📢 用大喇叭大喊一樣大聲", score: 0.3, tag: "extremely loud volume, shouting level", sound: "fire" },
                { text: "🌀 音量突然變大又突然變小", score: 0.5, tag: "unstable fluctuating sound waves", sound: "ice" }
            ]
        },
        {
            systemText: "【第十一關：窗邊歌聲 (人聲)】你正在看一本故事書，這時的歌聲精靈應該？",
            choices: [
                { text: "🤫 不需要唱出歌詞，輕輕哼唱 (哼鳴) 或純器樂", score: 1.5, tag: "wordless vocal hums, or instrumental chill, no lyrics", sound: "Piano" },
                { text: "🎤 大聲唱出英文 Rap (饒舌)", score: 0.3, tag: "energetic rapid aggressive male rap lyrics", sound: "fire" },
                { text: "👑 大家一起用美聲唱史詩合唱", score: 0.5, tag: "grand formal opera choir vocals", sound: "Strings" }
            ]
        },
        {
            systemText: "【第十二關：天晴彩虹 (結尾)】雨漸漸停了，天邊現出彩虹，這首曲子最後怎麼謝幕？",
            choices: [
                { text: "🚂 聲音越來越小，像霧一樣消失 (淡出)", score: 1.5, tag: "gentle slow fade out to silence", sound: "Slow tempo" },
                { text: "🚪 「碰！」的一聲，像關門一樣突然停掉", score: 0.5, tag: "sudden door slam hard stop ending", sound: "fire" },
                { text: "📢 聲音突然變得超級大聲，嚇人一跳", score: 0.2, tag: "unexpected final loud blast explosion", sound: "ice" }
            ]
        }
    ],
    "快樂動物園": [
        {
            systemText: "【第一關：音樂心跳 (速度)】小猴子和袋鼠跳來跳去！這段動物園配樂的速度是？",
            choices: [
                { text: "🌴 樹懶散步 (很慢很慢，慢板)", score: 0.5, tag: "slow sloth pace tempo", sound: "Slow tempo" },
                { text: "🐇 兔子蹦蹦跳 (非常輕快，急板)", score: 1.5, tag: "fast upbeat tempo, bouncy cute pace, 125 bpm", sound: "Fast tempo" },
                { text: "🐘 大象慢走 (中等速度，行板)", score: 1.0, tag: "moderate steady walking elephant tempo", sound: "Moderate tempo" }
            ]
        },
        {
            systemText: "【第二關：身體步伐 (拍號)】小動物跟著音樂一搖一擺，哪種拍子最像袋鼠跳躍？",
            choices: [
                { text: "🦘 咚噠噠、二噠噠 (搖擺的 6/8 拍)", score: 1.5, tag: "bouncy 6/8 swing meter, cute waltz", sound: "music" },
                { text: "🥁 咚噠、咚噠 (進行曲的 2/4 拍)", score: 0.8, tag: "marching 2/4 beat, straight", sound: "music" },
                { text: "🌀 沒有拍子，像風聲一樣", score: 0.3, tag: "ambient beatless wind sounds", sound: "ice" }
            ]
        },
        {
            systemText: "【第三關：活潑個性 (節奏型)】為了模擬小動物活潑好動，背景節奏該怎麼設計？",
            choices: [
                { text: "⚡ 不斷跳躍、帶有切分音的節奏", score: 1.5, tag: "playful syncopated bouncy rhythm, jumpy", sound: "Moderate tempo" },
                { text: "☁️ 拖得很長、很慢的長音節奏", score: 0.5, tag: "long slow sustained background tones", sound: "Slow tempo" },
                { text: "💥 突然重擊、沒有任何規律", score: 0.3, tag: "irregular sudden crashing noise", sound: "fire" }
            ]
        }
    ],
    "遊樂園探險": [],
    "魔法森林": [],
    "宇宙探險": [],
    "甜甜夢鄉": [],
    "海底世界": [],
    "闖關遊戲": [],
    "生日派對": []
};

// 為了壓縮空間，runtime 動態產生其餘主題題庫
function generateAllSpecializedBanks() {
    // 快樂動物園補全 4-12 題
    specializedQuestionBanks["快樂動物園"].splice(3, 9, 
        {
            systemText: "【第四關：音樂顏色 (調性)】小動物在陽光下開心地吃水果，這時音樂的顏色是？",
            choices: [
                { text: "☀️ 陽光大調 (開心又明亮)", score: 1.5, tag: "bright happy Major Key, sunny", sound: "Major Key" },
                { text: "🌑 灰暗小調 (像晚上停電一樣害怕)", score: 0.5, tag: "dark mysterious minor key", sound: "Minor Key" },
                { text: "🏮 森林神秘音階", score: 0.8, tag: "mystic oriental style", sound: "Pentatonic" }
            ]
        },
        {
            systemText: "【第五關：動物握手 (和聲)】長頸鹿和小松鼠高興地握手，背景和聲要用什麼氣氛？",
            choices: [
                { text: "🤝 聽起來很和諧舒適的『協和音』", score: 1.5, tag: "sweet consonant playful harmony", sound: "Piano" },
                { text: "🐯 吵架打架的刺耳聲音 (不協和音)", score: 0.5, tag: "harsh discordant clash sounds", sound: "fire" },
                { text: "🚨 像警報器一樣的奇怪聲波", score: 0.2, tag: "scary electronic alarm noise", sound: "ice" }
            ]
        },
        {
            systemText: "【第六關：天空與陸地 (音區)】小鳥唱歌，大象散步，這時候旋律的高度應該？",
            choices: [
                { text: "🐦 又高又清脆的高音區 (像小鳥叫)", score: 1.5, tag: "bright high-pitched bird-like melodies", sound: "ice" },
                { text: "🐘 沉重低沉的低音區 (像大象走路)", score: 0.8, tag: "heavy low bass register rumble", sound: "fire" },
                { text: "🚶 中間音區，平平淡淡的", score: 0.6, tag: "mellow middle register", sound: "music" }
            ]
        },
        {
            systemText: "【第七關：森林歌唱家 (主奏)】要模仿小鳥小松鼠唱歌，哪種吹奏法器最合適？",
            choices: [
                { text: "🌬️ 清脆嘹亮的木管樂器 (長笛/雙簧管)", score: 1.5, tag: "woodwind lead, flying flute solos", sound: "Woodwinds" },
                { text: "🎺 很大聲很吵的小號 (銅管)", score: 0.6, tag: "bright loud brass fanfare", sound: "Brass" },
                { text: "🎻 沉重大提琴 (弦樂器)", score: 0.8, tag: "warm solo cello line", sound: "Strings" }
            ]
        },
        {
            systemText: "【第八關：森林環境 (特效)】聽！動物園裡有大自然的伴奏，加入什麼背景音？",
            choices: [
                { text: "🐦 森林裡的鳥叫聲與小動物嬉戲沙沙聲", score: 1.5, tag: "animals soundscape, chirping birds, forest background", sound: "music" },
                { text: "🏎️ 跑車甩尾的引擎聲", score: 0.2, tag: "racing car drift tire squeals", sound: "fire" },
                { text: "⛈️ 暴風雨夾雜雷擊聲", score: 0.5, tag: "stormy rain howling wind and thunder sfx", sound: "ice" }
            ]
        },
        {
            systemText: "【第九關：森林派對 (織體)】所有動物一起跳舞，這時的樂器隊伍應該？",
            choices: [
                { text: "🦁 許多木管和敲擊樂器一起合奏 (豐富)", score: 1.5, tag: "playful layered acoustic instrumentation, rich ensemble", sound: "Strings" },
                { text: "🚶 只有一隻直笛在吹單音 (孤單單)", score: 0.5, tag: "single simple solo recorder melody", sound: "Woodwinds" },
                { text: "👏 只有一個人在拍手", score: 0.2, tag: "bare hand clapping only", sound: "music" }
            ]
        },
        {
            systemText: "【第十關：獅子出沒 (力度)】小獅子突然跑出來打招呼，然後輕輕走開，力度如何變化？",
            choices: [
                { text: "🦁 突然大聲然後慢慢變溫柔 (強 ➡️ 弱)", score: 1.5, tag: "dynamic contrasts, playful crescendos, sudden loud to soft", sound: "fire" },
                { text: "📢 一直像大喇叭一樣超級大聲", score: 0.5, tag: "unyielding loud fortissimo, heavy volume", sound: "fire" },
                { text: "🤫 像蚊子叫一樣完全聽不見", score: 0.3, tag: "extremely quiet whisper soft volume", sound: "Slow tempo" }
            ]
        },
        {
            systemText: "【第十一關：動物大合唱 (人聲)】要讓這首歌曲充滿童趣，歌聲精靈應該？",
            choices: [
                { text: "🧒 輕快開心的童聲合唱，或者純樂器", score: 1.5, tag: "playful childrens chorus backing", sound: "music" },
                { text: "👩 恐怖片女高音美聲高歌", score: 0.5, tag: "dramatic operatic female soprano solos", sound: "Strings" },
                { text: "🎸 大吼大叫的搖滾主唱", score: 0.3, tag: "harsh metal rock vocals screaming", sound: "fire" }
            ]
        },
        {
            systemText: "【第十二關：天黑謝幕 (結尾)】天黑了，小動物們揮手再見，音樂最後怎麼謝幕？",
            choices: [
                { text: "🪵 伴隨清脆木琴一聲「咚！」，活潑俐落結束", score: 1.5, tag: "playful staccato final note, xylophone pop", sound: "music" },
                { text: "🚂 慢慢變小聲到聽不見 (淡出)", score: 1.2, tag: "fading out slowly to quiet forest silence", sound: "Slow tempo" },
                { text: "🔌 突然斷掉，像停電一樣", score: 0.4, tag: "abrupt silent cut ending", sound: "ice" }
            ]
        }
    );

    // 遊樂園探險
    specializedQuestionBanks["遊樂園探險"] = [
        {
            systemText: "【第一關：音樂心跳 (速度)】旋轉木馬轉動！摩天輪上升，速度應該是？",
            choices: [
                { text: "🎡 中等速度，帶著輕快擺動 (行板/小快板)", score: 1.5, tag: "cheerful moderate allegretto tempo, 110 bpm", sound: "Moderate tempo" },
                { text: "🚀 像超音速火箭一樣瘋狂急促 (急板)", score: 1.0, tag: "frantic roller-coaster fast tempo, presto", sound: "Fast tempo" },
                { text: "💤 慢到像在做夢睡覺一樣 (慢板)", score: 0.5, tag: "dreamy sleepy slow tempo, adagio", sound: "Slow tempo" }
            ]
        },
        {
            systemText: "【第二關：轉圈律動 (拍號)】旋轉木馬一上一下、旋轉，最適合哪種三拍子？",
            choices: [
                { text: "💃 咚噠噠、二噠噠 (跳舞的三拍子華爾茲)", score: 1.5, tag: "waltz meter, swaying 3/4 beat", sound: "music" },
                { text: "🥁 咚噠、咚噠 (踏步的二拍子進行曲)", score: 0.8, tag: "marching 2/4 beat, straight", sound: "music" },
                { text: "🌀 拍子軟綿綿，沒有規律", score: 0.3, tag: "abstract drifting time signature", sound: "ice" }
            ]
        },
        {
            systemText: "【第三關：飛車俯衝 (節奏型)】配合雲霄飛車上一會兒下一會兒的離心力，節奏要？",
            choices: [
                { text: "🎢 忽快忽慢、充滿彈性與起伏的節奏", score: 1.5, tag: "rhythmic rubato, shifting accents, rollercoaster momentum", sound: "Moderate tempo" },
                { text: "🤖 像機械人一樣完全不變、死板的節奏", score: 0.5, tag: "monotonous rigid mechanical clock tick beat", sound: "Slow tempo" },
                { text: "☁️ 一直拉長音，一動不動", score: 0.3, tag: "long frozen static tones", sound: "Slow tempo" }
            ]
        },
        {
            systemText: "【第四關：樂園煙花 (調性)】看到滿天的氣球和煙花，這時音樂的顏色應該是？",
            choices: [
                { text: "☀️ 繽紛燦爛大調 (像棉花糖一樣甜)", score: 1.5, tag: "bright colorful Major Key, festive and joyful", sound: "Major Key" },
                { text: "🌑 暗黑恐怖、鬼屋一樣的小調", score: 0.5, tag: "dark spooky haunted house style minor key", sound: "Minor Key" },
                { text: "🏮 古代傳奇武俠色彩", score: 0.7, tag: "traditional folk style", sound: "Pentatonic" }
            ]
        },
        {
            systemText: "【第五關：浪漫城堡 (和聲)】我們在城堡前拍照，這時背景的和弦聽起來？",
            choices: [
                { text: "🏰 甜美協和、充滿節慶歡樂感的和弦", score: 1.5, tag: "sweet festival consonant harmony, pleasant", sound: "Piano" },
                { text: "🕸️ 刺耳撞擊、像玻璃碎掉的和聲", score: 0.5, tag: "harsh clash dissonant tone", sound: "fire" },
                { text: "🚶 沒有任何和聲，平淡無奇", score: 0.3, tag: "unaccompanied single sound line", sound: "music" }
            ]
        },
        {
            systemText: "【第六關：音樂盒 (音區)】遊樂園有叮叮咚咚音樂盒，也有大鐘聲，音區要？",
            choices: [
                { text: "🔔 清脆高音配溫暖中音 (亮晶晶)", score: 1.5, tag: "sparkling high-register bells, warm midground", sound: "ice" },
                { text: "🦖 只有低沉沉的低音 (像大怪獸)", score: 0.4, tag: "oppressive muddy deep bass notes", sound: "fire" },
                { text: "🤫 全部擠在中音區，像在說悄悄話", score: 0.6, tag: "flat plain middle register tones", sound: "music" }
            ]
        },
        {
            systemText: "【第七關：童話法器 (主奏)】要表現遊樂園閃閃發光、像童話一樣，哪種樂器最適合？",
            choices: [
                { text: "🎹 鋼片琴、鐘琴與風琴 (叮叮咚咚亮晶晶)", score: 1.5, tag: "celesta lead, toy piano, music box style bells, pipe organ", sound: "Piano" },
                { text: "🎻 粗獷咆哮的低音提琴", score: 0.4, tag: "heavy harsh double bass", sound: "Strings" },
                { text: "🪵 沉悶的木魚和竹板", score: 0.3, tag: "clunky wooden block temple blocks", sound: "music" }
            ]
        },
        {
            systemText: "【第八關：樂園聲浪 (特效)】這可是最熱鬧的遊樂園！背景加入什麼歡樂聲音？",
            choices: [
                { text: "🎢 遠處飛車尖叫、爆米花機和拉炮聲", score: 1.5, tag: "fairground soundscape, faint laughter, festive murmurs, fireworks popping", sound: "music" },
                { text: "🦉 寂靜無聲的黑夜森林風聲", score: 0.4, tag: "spooky quiet forest howling wind at night", sound: "Woodwinds" },
                { text: "⌨️ 辦公室打字機的敲鍵盤聲", score: 0.2, tag: "monotonous office typing sfx", sound: "music" }
            ]
        },
        {
            systemText: "【第九關：花車巡遊 (織體)】花車巡遊開始！所有玩具動起來，樂器隊伍應該？",
            choices: [
                { text: "🎪 各種敲擊、管樂器層層疊疊合奏 (熱鬧)", score: 1.5, tag: "layered circus orchestration, rich festive texture, carnival tutti", sound: "Brass" },
                { text: "🚶 只有一隻木笛單獨在吹單音 (孤單)", score: 0.5, tag: "solitary single wood flute line", sound: "Woodwinds" },
                { text: "👏 只有一下孤單的鼓聲", score: 0.2, tag: "single isolated bass drum hit", sound: "music" }
            ]
        },
        {
            systemText: "【第十關：巡遊逼近 (力度)】巡遊隊伍從遠處走來，在眼前經過，音量要？",
            choices: [
                { text: "📢 從很小聲慢慢變到超級大聲 (漸強)", score: 1.5, tag: "gradual crescendo, swelling dynamic volume", sound: "fire" },
                { text: "🥁 一直保持像打雷一樣超级大聲", score: 0.5, tag: "constant heavy loud fortissimo level", sound: "fire" },
                { text: "🤫 突然變得完全沒有聲音", score: 0.3, tag: "sudden quiet drop off", sound: "Slow tempo" }
            ]
        },
        {
            systemText: "【第十一關：歡樂歌聲 (人聲)】花車上的卡通主角向你招手，這時歌聲精靈應該？",
            choices: [
                { text: "🎶 歡樂無歌詞「啦啦啦」哼唱或大合奏", score: 1.5, tag: "cheerful joyful vocal 'la-la-la' chants, choir", sound: "music" },
                { text: "👩 嚴肅的歌劇美聲獨唱", score: 0.6, tag: "stately slow opera soprano aria lyrics", sound: "Strings" },
                { text: "😢 悲傷大哭的哭泣聲", score: 0.3, tag: "crying sobbing vocals", sound: "Piano" }
            ]
        },
        {
            systemText: "【第十二關：大煙花綻放 (結尾)】大煙花綻放！完美的一天結束，音樂最後怎麼謝幕？",
            choices: [
                { text: "🔔 伴隨「砰！砰！」大鐘聲，在最高潮熱烈結束", score: 1.5, tag: "grand explosive festive climax ending with bell chimes", sound: "fire" },
                { text: "🔌 音樂突然斷掉，像停電一樣", score: 0.4, tag: "abrupt sudden dead stop ending", sound: "ice" },
                { text: "🚂 慢慢變小聲到完全聽不見", score: 1.2, tag: "fading out slowly to silent evening", sound: "Slow tempo" }
            ]
        }
    ];

    // 魔法森林
    specializedQuestionBanks["魔法森林"] = [
        {
            systemText: "【第一關：音樂心跳 (速度)】森林薄霧瀰漫，樹葉輕輕搖曳，步伐有多快？",
            choices: [
                { text: "🍃 慢條斯理、輕飄飄的 (慢板/行板)", score: 1.5, tag: "slow mysterious tempo, gentle pacing, 72 bpm", sound: "Slow tempo" },
                { text: "🚀 火箭發射一樣狂奔 (急板)", score: 0.4, tag: "insane ultra fast speed presto", sound: "Fast tempo" },
                { text: "🏃 像接力賽一樣快 (快板)", score: 0.8, tag: "brisk racing tempo allegro", sound: "Fast tempo" }
            ]
        },
        {
            systemText: "【第二關：小水滴 (拍號)】森林小水滴滴答落下，精靈踏著輕盈舞步，哪種拍子最舒服？",
            choices: [
                { text: "🚶 溫和、沒有壓迫感的 4/4 四拍子", score: 1.5, tag: "gentle 4/4 timing, flowing liquid meter", sound: "music" },
                { text: "🥁 雄壯像士兵走路的 2/4 二拍子", score: 0.5, tag: "stiff marching 2/4 beat", sound: "music" },
                { text: "🌪️ 混亂狂暴的拍子", score: 0.2, tag: "unstable chaotic uneven time", sound: "ice" }
            ]
        },
        {
            systemText: "【第三關：沙沙樹葉 (節奏型)】呈現神祕精靈魔法，節奏該如何設計？",
            choices: [
                { text: "🍃 輕柔、緩慢、長音不斷的流動節奏", score: 1.5, tag: "ethereal floating long-notes rhythm, soothing flow", sound: "Slow tempo" },
                { text: "⛈️ 像打雷一樣，重重鼓點的節奏", score: 0.4, tag: "aggressive pounding battle drums beat", sound: "fire" },
                { text: "💥 完全沒有節奏，一聲巨響", score: 0.3, tag: "random loud blast sound sfx", sound: "fire" }
            ]
        },
        {
            systemText: "【第四關：魔法起舞 (調性)】灑下金色陽光，精靈跳起古舞，調性該選？",
            choices: [
                { text: "🏮 東方五聲音階 (像走進仙境)", score: 1.5, tag: "ancient mystical Pentatonic Scale, oriental wonderland", sound: "Pentatonic" },
                { text: "☀️ 明亮燦爛的現代大調", score: 1.0, tag: "bright modern major key chords", sound: "Major Key" },
                { text: "🎃 恐怖怪誕的萬聖節小調", score: 0.5, tag: "scary gothic minor scale", sound: "Minor Key" }
            ]
        },
        {
            systemText: "【第五關：奇幻綻放 (和聲)】魔法花朵綻放，背景和弦帶給聽眾什麼感覺？",
            choices: [
                { text: "☁️ 夢幻空靈、像在雲朵上飄浮 (協和音)", score: 1.5, tag: "dreamy atmospheric consonant harmony, soft chords", sound: "Piano" },
                { text: "🕸️ 刺耳、吵架、像怪物抓玻璃 (不協和音)", score: 0.4, tag: "tense bone-chilling dissonant harmony", sound: "ice" },
                { text: "🚂 沉悶單調，像火車開動", score: 0.3, tag: "dull industrial train chug noise", sound: "fire" }
            ]
        },
        {
            systemText: "【第六關：螢火蟲 (音區)】小螢火蟲飛舞，巨樹呼吸，聲音高度怎麼安排？",
            choices: [
                { text: "✨ 亮晶晶的極高音配溫暖中音 (空間寬廣)", score: 1.5, tag: "high-pitched shimmering bell notes, wide soundstage", sound: "ice" },
                { text: "🦖 全部擠在最沉重的低音區 (像地震)", score: 0.4, tag: "gloomy low bass register drone", sound: "fire" },
                { text: "🚶 只有單一的高音尖叫", score: 0.2, tag: "flat piercing whistle tone", sound: "ice" }
            ]
        }
    ];

    // 動態複製其餘 8 個主題至基礎庫中
    const fallbackBase = specializedQuestionBanks["下雨的窗邊"];
    const themesToBackfill = ["魔法森林", "宇宙探險", "甜甜夢鄉", "海底世界", "闖關遊戲", "生日派對"];
    
    themesToBackfill.forEach(theme => {
        if (!specializedQuestionBanks[theme] || specializedQuestionBanks[theme].length < 12) {
            specializedQuestionBanks[theme] = JSON.parse(JSON.stringify(fallbackBase));
        }
    });

    // 🌟 宇宙探險
    const space = specializedQuestionBanks["宇宙探險"];
    space[0].systemText = "【第一關：音樂心跳 (速度)】穿上太空衣飄浮在無重力太空中，速度應該是？";
    space[0].choices[0].text = "🚀 輕飄盤、像在雲朵上慢動作飄浮 (慢板)";
    space[0].choices[0].tag = "slow cosmic drifting tempo, floating feel";
    space[0].choices.text = "🚀 火箭發射一樣狂奔 (急板)";
    space[0].choices.tag = "hyper fast rocket propulsion speed, presto";
    space.systemText = "【第二關：身體步伐 (拍號)】太空中沒有重力，身體沒有方向，這時拍子感覺應該？";
    space.choices[0].text = "🌌 幾乎聽不出固定拍子，空中無限飄浮";
    space.choices[0].tag = "floating tempo-free rubato rhythm, open time";
    space[3].systemText = "【第四關：黑洞神秘 (調性)】望著黑色夜空中無數未知的星系，音樂顏色是？";
    space[3].choices[0].text = "🌌 神祕又深邃的科幻小調";
    space[3].choices[0].tag = "mysterious dark cinematic Minor Key";
    space[6].systemText = "【第七關：未來法器 (主奏)】要彈奏出充滿未來科技感、像外星科技的聲音，哪種最合適？";
    space[6].choices[0].text = "👽 叮叮咚咚的電子合成器與太空鍵盤 (Synthesizer)";
    space[6].choices[0].tag = "sci-fi synthesizer lead, space pads, cosmic wave";
    space[7].systemText = "【第八關：宇宙訊號 (特效)】在科幻電影中，太空會有特別聲音，你要加入？";
    space[7].choices[0].text = "📡 太空艙低鳴、遠處雷達嗶嗶電波聲與流星劃過聲";
    space[7].choices[0].tag = "space ambient drones, cosmic radar blips, sci-fi sweeps";

    // 🌟 甜甜夢鄉
    const sleep = specializedQuestionBanks["甜甜夢鄉"];
    sleep[0].systemText = "【第一關：音樂心跳 (速度)】小動物閉上眼睛，月亮升起來了。催眠音樂的心跳是？";
    sleep[0].choices[0].text = "🛌 慢吞吞、像搖籃輕輕搖擺 (安靜慢板)";
    sleep[0].choices[0].tag = "slow peaceful lullaby tempo, 60 bpm, sleep";
    sleep[3].systemText = "【第四關：甜蜜夢境 (調性)】夢境裡充滿粉紅色雲朵和甜甜的夢，音樂顏色應該是？";
    sleep[3].choices[0].text = "☀️ 溫柔安心大調 (溫暖放鬆)";
    sleep[3].choices[0].tag = "warm soothing Major Key, dreamy, child-like";
    sleep[6].systemText = "【第七關：催眠法器 (主奏)】在這個溫馨、安靜的夢境裡，哪種樂器法器最合適？";
    sleep[6].choices[0].text = "🧸 溫暖鋼琴與八音盒 (Felt Piano / Music Box)";
    sleep[6].choices[0].tag = "warm felt piano melody, gentle music box glimmers, dreamy";

    // 🌟 海底世界
    const sea = specializedQuestionBanks["海底世界"];
    sea[0].systemText = "【第一關：音樂心跳 (速度)】五顏六色小魚在身邊游動，水母慢慢飄浮。速度是？";
    sea[0].choices[0].text = "🐠 慢悠悠、像在水中動作慢半拍 (慢板)";
    sea[0].choices[0].tag = "slow flowing underwater tempo, relaxing, fluid";
    sea[3].systemText = "【第四關：龍宮神話 (調性)】珊瑚礁閃爍著神祕七彩光芒，海底深處像水晶宮殿，調性選？";
    sea[3].choices[0].text = "👑 夢幻神奇的東方五聲音階 (走進龍宮)";
    sea[3].choices[0].tag = "dreamy underwater Pentatonic Scale, oriental sea palace";
    sea[6].systemText = "【第七關：水流法器 (主奏)】海底世界彈奏旋律，哪種最適合模仿水流和泡泡？";
    sea[6].choices[0].text = "💦 叮叮咚咚的豎琴、鋼琴與鋼片琴 (Harp & Celesta)";
    sea[6].choices[0].tag = "harp glissandos, sparkling celesta lead, bubble effects";
    sea[7].systemText = "【第八關：深海奇感 (特效)】聽！海底世界裡還有特別伴奏，加入什麼背景聲音？";
    sea[7].choices[0].text = "🐳 咕嚕咕嚕泡泡聲、遠處鯨魚歌唱低鳴與水流聲";
    sea[7].choices[0].tag = "underwater bubbling sound effect, distant whale songs, fluid";

    // 🌟 闖關遊戲
    const game = specializedQuestionBanks["闖關遊戲"];
    game[0].systemText = "【第一關：音樂心跳 (速度)】馬力歐開始奔跑了！後面有怪獸追！速度應該是？";
    game[0].choices[0].text = "👾 充滿精神、快步奔跑 (快板)";
    game[0].choices[0].tag = "fast upbeat gaming tempo, retro run, 130 bpm";
    game[0].choices[0].score = 1.5;
    game[0].choices.text = "🐢 慢吞吞像在做夢睡覺";
    game[0].choices.tag = "slow dreamy pace";
    game[0].choices.score = 0.5;
    game.systemText = "【第二關：跳躍節拍 (拍號)】遊戲主角跳過深溝，踩在方塊上，哪種拍子最配？";
    game.choices[0].text = "🎮 充滿活力、蹦蹦跳跳的 4/4 四拍子";
    game.choices[0].tag = "bouncy gaming 4/4 meter, retro chip";
    game.systemText = "【第三關：彈跳跳音 (節奏型)】展現橫向捲軸遊戲的跳躍感，節奏該如何設計？";
    game.choices[0].text = "⚡ 充滿切分音與『短促彈跳點』的復古節奏";
    game.choices[0].tag = "staccato jumpy rhythm, syncopated game beats";
    game[3].systemText = "【第四關：魔王降臨 (調性)】不好！大魔王出現了！音樂的調性顏色變成？";
    game[3].choices[0].text = "👹 緊張刺激、充滿冒險感的小調";
    game[3].choices[0].tag = "dramatic gaming Minor Key, adventure battle theme";
    game[6].systemText = "【第七關：復古法器 (主奏)】要模仿紅白機或街機遊戲的聲音，哪種最合適？";
    game[6].choices[0].text = "👾 復古 8-bit 電子合成器 (Chiptune / Square Wave)";
    game[6].choices[0].tag = "retro 8-bit chiptune synthesizer, square waves, chiptune lead";
    game[7].systemText = "【第八關：遊戲特效 (特效)】這可是最經典的闖關遊戲！背景加入什麼音效？";
    game[7].choices[0].text = "🪙 復古的吃金幣、跳躍與遊戲過關「登登登」音效";
    game[7].choices[0].tag = "gaming retro sound effects, coin ping, jump sfx, chiptune noises";

    // 🌟 生日派對
    const party = specializedQuestionBanks["生日派對"];
    party[0].systemText = "【第一關：音樂心跳 (速度)】大家戴上生日帽準備吃蛋糕，派對音樂速度是？";
    party[0].choices[0].text = "🎂 輕鬆愉快、像拍手唱歌 (中快板)";
    party[0].choices[0].tag = "happy moderate allegro tempo, 108 bpm, joyful";
    party.systemText = "【第二關：拍手聯歡 (拍號)】全體好朋友圍在一起拍手唱歌，哪種拍子最適合打拍子？";
    party.choices[0].text = "👏 適合一邊拍手一邊搖晃的 4/4 四拍子";
    party.choices[0].tag = "cheerful 4/4 clap-along meter, pop groove";
    party[3].systemText = "【第四關：許願許諾 (調性)】大家一起唱著生日歌，這時音樂的顏色是？";
    party[3].choices[0].text = "☀️ 明亮溫暖大調 (像太陽曬屁股一樣)";
    party[3].choices[0].tag = "bright happy Major Key, festive party, sunny";
    party[6].systemText = "【第七關：客廳彈唱 (主奏)】在這個溫馨開心的派對彈出旋律，哪種最合適？";
    party[6].choices[0].text = "🎸 溫柔清脆的木吉他與原聲鋼琴 (Acoustic Guitar)";
    party[6].choices[0].tag = "acoustic guitar strumming, bright piano chords, organic";
    party[7].systemText = "【第八關：派對聲浪 (特效)】這可是最熱鬧的生日派對！背景要加入？";
    party[7].choices[0].text = "🎉 開心笑聲、拍手聲、拉炮與切蛋糕聲";
    party[7].choices[0].tag = "party ambiance, clapping hands, happy laughter, party horns pop";
}

generateAllSpecializedBanks();

// =========================================
// 🔄 導航與交互邏輯
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

deckCards.forEach(card => {
    card.addEventListener('click', () => {
        const selectedMood = moodDatabase[Math.floor(Math.random() * moodDatabase.length)];
        
        if (moodCard) moodCard.classList.remove('flipped');
        if (moodImg) moodImg.src = selectedMood.img;
        if (moodTitle) moodTitle.innerText = selectedMood.title;
        if (moodDesc) moodDesc.innerText = selectedMood.desc;
        
        adventureState.moodTitle = selectedMood.title;
        adventureState.tags = []; // 重設 Prompt 關鍵字
        adventureState.solveScore = 0; // 重設分數
        
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

        // 🌟 配合學校計分準則，換算為 1, 2, 3, 4, 5 的整數成績上傳
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

// 🌟 將 12 題總得分（滿分 18）對接到 1 - 5 整數等級的計分函數
function calculateFinalGrade(rawScore) {
    if (rawScore >= 15.0) return 5; // 卓越 (83% - 100%)
    if (rawScore >= 12.0) return 4; // 優良 (66% - 82%)
    if (rawScore >= 9.0)  return 3; // 滿意 (50% - 65%)
    if (rawScore >= 6.0)  return 2; // 基本 (33% - 49%)
    return 1;                       // 需努力 (0% - 32%)
}

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
        // 將 12 題累積的咒語 tags 連接成完美的古代咒語
        const promptText = `A high quality music track for ${adventureState.moodTitle}, ${adventureState.tags.join(', ')}. Perfect cinematic background composition.`;
        const promptEl = document.getElementById('resultPrompt');
        if (promptEl) promptEl.innerText = promptText;
        showPage(page4); 
        
        const ritualDialogue = `「現在，將你調配出的這段咒語帶去 Suno AI 聖地吧。生成音樂後，別忘了回來把它刻在靈感石碑上！」`;
        const ritualTextEl = document.getElementById('ritualText');
        if (ritualTextEl) typeWriterEffect(ritualTextEl, ritualDialogue, 30);
    });
}

// =========================================
// 🧪 打字機與 12 題大冒險動態渲染系統
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
    
    // 獲取目前抽中卡片的專屬題庫，若無則預設加載「下雨的窗邊」
    const currentBank = specializedQuestionBanks[adventureState.moodTitle] || specializedQuestionBanks["下雨的窗邊"];
    const currentQuestion = currentBank[stepIndex];
    
    const choicesContainer = document.getElementById('adventureChoices');
    const systemBox = document.getElementById('systemBox');
    const tutorTextElement = document.getElementById('tutorText');
    const roomTitle = document.getElementById('rpgRoomTitle');

    // 動態修改公會地下室名稱
    if (roomTitle) {
        roomTitle.innerText = `=== 魔法公會：【${adventureState.moodTitle}】考驗 (第 ${stepIndex + 1} / 12 步) ===`;
    }

    if (choicesContainer) { choicesContainer.style.display = 'none'; choicesContainer.innerHTML = ''; }
    if (tutorTextElement) tutorTextElement.innerHTML = '';
    
    const showChoices = () => {
        if (!choicesContainer) return;
        currentQuestion.choices.forEach(choice => {
            const btn = document.createElement('button'); 
            btn.className = 'retro-choice-btn'; 
            btn.innerHTML = choice.text;
            btn.addEventListener('click', () => {
                // 累積計分與 Suno Prompt
                adventureState.solveScore += choice.score;
                adventureState.tags.push(choice.tag);
                
                if (choice.sound) playSpellSound(choice.sound);

                // 判斷是否答完 12 題
                if (stepIndex >= 11) {
                    triggerEvaluationReveal();
                } else {
                    renderRPGStep(stepIndex + 1);
                }
            });
            choicesContainer.appendChild(btn);
        });
        choicesContainer.style.display = 'grid'; 
    };

    if (currentQuestion.systemText) {
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

    // 🌟 計算學校計分等級 (1 - 5 分)
    const finalGrade = calculateFinalGrade(adventureState.solveScore);
    const scoreEl = document.getElementById('problemSolvingScore');
    if (scoreEl) scoreEl.innerText = `${finalGrade} / 5 分`;
    showPage(page3); 
    
    // 依分數給予翁 sir 的專屬評語
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
// 🌌 Final Fantasy 3D 水晶星空背景引擎 (Three.js)
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

window.addEventListener('DOMContentLoaded', () => {
    try {
        initFF3DBackground();
        fetchWallData();
    } catch(e){}
});
