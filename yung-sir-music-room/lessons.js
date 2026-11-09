// 工作紙按 Google Drive 的學期、年級及原有編號排列。
const driveFile = (id) => `https://drive.google.com/file/d/${id}/view`;

const musicSemesters = {
  "s1-t1": {
    title: "巴洛克音樂與中西樂器",
    lessons: [
      { title: "韋發第與協奏曲", tag: "聆聽", goal: "認識韋發第的協奏曲、《四季》，以及古提琴和曼陀林的特色。", activity: "聆聽古中提琴協奏曲與雙曼陀林協奏曲選段，再完成有關樂器及作品的題目。", resource: driveFile("15siUSO7b-lnl1gPq-DQhimxS62qNb44Q") },
      { title: "巴哈與古鍵琴", tag: "聆聽", goal: "認識巴哈的作品、古鍵琴的發聲方式及協奏曲的演奏編制。", activity: "聆聽第三管弦樂組曲的序曲及第五勃蘭登堡協奏曲，留意古鍵琴的獨奏和合奏。", resource: driveFile("1pL9-dt9CtRWEPx8SvjuPXelKMCe8XcDH") },
      { title: "中國拉弦樂器", tag: "樂器", goal: "分辨高胡、二胡、京胡、板胡和中胡的音色及外形。", activity: "配對獨奏選段與樂器，並辨認拉弦樂器的部件及發聲方式。", resource: driveFile("1qDrQW2zBaXevtVI6AYp3G-CqYD2TugKK") },
      { title: "中國吹管樂器", tag: "樂器", goal: "認識嗩吶、管、笛、簫和笙，比較它們的發聲和音色。", activity: "聆聽獨奏選段、辨認樂器，並比較笛和簫的音色及標示樂器部件。", resource: driveFile("1l3fz7klXzFsiAZzaz0g0aps6GmrF3rXY") },
      { title: "管弦樂團的樂器分組", tag: "樂器", goal: "辨認管弦樂團的弦樂、木管、銅管和敲擊樂組。", activity: "把工作紙列出的樂器填入所屬的樂組。", resource: driveFile("1T-dHwsSSmbRulIBgnzFOMjYENIfUF-k0") }
    ]
  },
  "s1-t2": { title: "下學期教材", lessons: [] },
  "s2-t1": {
    title: "古典音樂、歌劇與歌曲風格",
    lessons: [
      { title: "海頓與古典時期作品", tag: "聆聽", goal: "認識海頓的代表作品，留意主題與變奏及不同樂器的演奏。", activity: "聆聽工作紙指定選段，包括《皇帝四重奏》第二樂章，再辨認主題及變奏的變化。", resource: driveFile("1jCg9WxnFU4TrFgeBfAJ9oXotL7UzUo14") },
      { title: "歌劇欣賞《杜蘭朵公主》", tag: "歌劇", goal: "認識作品的背景和劇情，辨認民歌旋律與男高音詠嘆調。", activity: "觀看歌劇片段，完成背景、音樂特色及劇情理解題目。", resource: driveFile("1uyS-Oe6Ad29Fv0NRoojq3WPYvIqTdzWk") },
      { title: "中國五聲音階", tag: "樂理", goal: "認識宮、商、角、徵、羽，理解五聲音階與簡譜音級的關係。", activity: "完成音級配對、填空及音程思考題。", resource: driveFile("1fyv5T46EoBWVeaeQGd3u7lZScKj2FuGI") },
      { title: "貝多芬與代表作品", tag: "聆聽", goal: "認識貝多芬的生平、創作風格與交響曲、奏鳴曲等作品。", activity: "閱讀工作紙的作曲家介紹，按原件指示欣賞指定樂段並完成題目。", resource: driveFile("1sxnNxlDCnZRtiwMdZUvcqzS-vwEsd0Lq") },
      { title: "同一首歌的兩個版本", tag: "聆聽", goal: "比較歌曲版本的風格、拍子、速度和樂器編配。", activity: "聽兩個版本，記錄風格及拍子，再辨認兩段音樂使用的樂器。", resource: driveFile("1mdXu568rQyPOP9zxzIKplxjvU6Pv0avv") }
    ]
  },
  "s2-t2": { title: "下學期教材", lessons: [] },
  "s3-t1": {
    title: "印象派、世界音樂與電影音樂",
    lessons: [
      { title: "西方印象派音樂", tag: "音樂史", goal: "認識印象派音樂的時期、音響特色及德布西、拉威爾的作品。", activity: "用《月光》和《波麗露》等例子，完成關於作曲家、作品與音樂特色的選擇題。", resource: driveFile("1VhRRJ5pQEHOVpUT5FXI1lWS7jk3Ir3BX") },
      { title: "世界音樂與印尼甘美朗", tag: "世界音樂", goal: "辨認亞洲傳統樂器，認識中東鼓的基本拍法及甘美朗的編制與文化。", activity: "完成樂器配對、填空及簡答，並探討傳統歌謠與流行歌曲的關係。", resource: driveFile("1jx6K5JguO-LOKEbAR4qPpKPJz1Eg5V8o") },
      { title: "電影音樂與 iMovie 配樂", tag: "配樂", goal: "分辨畫內與畫外音樂，理解主導動機及配樂如何影響敘事和氣氛。", activity: "結合自己的 iMovie 作品與指定電影片段，分析配樂選擇、氣氛及音樂素材的使用。", resource: driveFile("19DGELBhZtRpqXDMwbjVxuS78KG2EaFX1") },
      { title: "《大白鯊》的音樂與氣氛", tag: "配樂", goal: "留意字幕音樂和反覆出現的動機如何預示角色及營造張力。", activity: "觀看《大白鯊》的指定場面，比較音樂如何描寫動作、改變氣氛並暗示危機。", resource: driveFile("1DIXXrXAf3j5KMNcNLO-iRG8VMOt0oVBJ") }
    ]
  },
  "s3-t2": { title: "下學期教材", lessons: [] }
};

const musicNotes = [
  {
    title: "中國樂器",
    entries: [
      ["中國樂器總覽", "1nBLt49zmkfqwNtrYR1IqVLh6SRO6AlPR"],
      ["吹管樂器", "1OHrsPzUs2p-K4pnOZjulYYF-DAVkbMDl"],
      ["彈撥樂器", "1t2YYlluDpsPJuu6O-xeNB3kceLAOLHAh"],
      ["拉弦樂器", "19Qjwz1JkUhcfLtq7HHwnXkr_99MvYnvP"],
      ["打擊樂器", "1QYaP3pmY8vjV-_kZLVwvvF3djD0YZJjT"]
    ]
  },
  {
    title: "西洋樂器",
    entries: [
      ["西洋樂器總覽", "1btXtzlGAfIq8T4Zxmrb01PGVC6bHNLg4"],
      ["弦樂器", "1qMe-xh7vEqhlWRN1QMBTQ57ruhpgrrA6"],
      ["木管樂器", "1oZ3KTp__gTFRdiv2jZvKpmYFxeSd-hmM"],
      ["銅管樂器", "1XBqkJxKJ1UNm-aX5YzwuDeDw5LgUpshD"],
      ["敲擊樂器", "16CGrEU9OdJ5u3pz1sa8CglV5BxJwOzQC"],
      ["鍵盤樂器", "1kPx9o6MlUvrO_KBH3NVotA7vOIo9Bwk7"]
    ]
  }
];
