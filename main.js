const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//幅の定義
const width = canvas.width;
const height = canvas.height;

count = 0; //カウントの初期値
timerID = setInterval('countup()', 1); //1000分の1秒毎にcountup()を呼び出し
function countup() {
    if (gamestate == PLAYING) {
        count++;
        document.form_count.counter.value = count;
    };
};

//キャラクターの位置
let char1 = { x: 10, y: 10, isWarpAllows: true };　　//連想配列を使っている
let char2 = { x: 790, y: 790, isWarpAllows: true };

//音出し
var music = new Audio();
function bgm() {
    music.preload = "auto";
    music.src = "https://yamatomiyoshi.github.io/NeverLaunch/ネバーロンチBGM.m4a";
    music.load();

    music.addEventListener("ended", function () {
      music.currentTime = 0;
      music.play();
    }, false);
  }

  function play() {
    music.loop = true;
    music.play();
  }

  function stop() {
    music.pause();
    music.currentTime = 0;
  }
  
bgm();

var music2 = new Audio();
function gameoverbgm() {
    music2.preload = "auto";
    music2.src = "https://yamatomiyoshi.github.io/NeverLaunch/gameoverSound.m4a";
    music2.load();

    music2.addEventListener("ended", function () {
      music2.currentTime = 0;
      music2.play();
    }, false);
  }

  function gameoverplay() {
    music2.loop = true;
    music2.play();
  }

  function gameoverstop() {
    music2.pause();
    music2.currentTime = 0;
  }
  
gameoverbgm();

var music3 = new Audio();
function itembgm() {
    //music3.preload = "auto";
    music3.src = "https://yamatomiyoshi.github.io/NeverLaunch/itemSound.m4a";
    music3.load();

    // music3.addEventListener("ended", function () {
    //   music3.currentTime = 0;
    //   music3.play();
    // }, false);
  }

  function itemplay() {
    music3.play();
  }

  function itemstop() {
    music3.pause();
    music3.currentTime = 0;
  }
  
itembgm();

var music4 = new Audio();
function warpbgm() {
    // music4.preload = "auto";
    music4.src = "https://yamatomiyoshi.github.io/NeverLaunch/warpSound.m4a";
    music4.load();
  }

  function warpplay() {
    music4.play();
  }

  function warpstop() {
    music4.pause();
    music4.currentTime = 0;
  }
  
warpbgm();

var music5 = new Audio();
function sesshokuSoundbgm() {
    // music4.preload = "auto";
    music5.src = "https://yamatomiyoshi.github.io/NeverLaunch/sesshokuSound.m4a";
    music5.load();
  }

  function sesshokuSoundplay() {
    music5.play();
  }

  function sesshokuSoundstop() {
    music5.pause();
    music5.currentTime = 0;
  }
  
  sesshokuSoundbgm();


var music6 = new Audio();
function homeswitch() {
    // music4.preload = "auto";
    music6.src = "https://yamatomiyoshi.github.io/NeverLaunch/homeswitch.m4a";
    music6.load();
  }

  function homeswitchplay() {
    music6.play();
  }

  function homeswitchstop() {
    music6.pause();
    music6.currentTime = 0;
  }
  
  homeswitch();

//ポイント
let point = 0;

//ゲームステイト
const START = 1
const PLAYING = 2
const GAMEOVER = 3

let gamestate = START;
//x.yの位置
canvas.addEventListener('mousedown', function (e) {
    if (gamestate == START) {
        gamestate = PLAYING
        homeswitchplay();
        // 音を鳴らす
        play();
    }
    else if (gamestate = PLAYING) {
        for (let i = 0; i < items.length; i++) {
            const distance = Math.sqrt(
                (pos(e).x - items[i].x) ** 2,
                (pos(e).y - items[i].y) ** 2
            );
            if (distance < 10) {
                items.splice(i, 1);
                itemplay();
                point = point + 1;
                return
            };
            if (point > 0) {
                point = point - 1;
                warps.push({ x: pos(e).x, y: pos(e).y, created: new Date() });
               
            };
        };
    };
});
function pos(e) {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;
    return { x: x, y: y };
}

//アイテム本体
let items = [];

//ワープホール本体
let warps = [];

//増やす関数
function generateItem() {
    items.push({ x: Math.random() * width, y: Math.random() * height });
}
setInterval(generateItem, 500);

//動かす関数
function updatePosition() {
    if (gamestate == PLAYING) {
        //ちかずいていく
        const speed = 1;

        let char1_move = { x: char2.x - char1.x, y: char2.y - char1.y };
        let char1_move_length = Math.sqrt(char1_move.x ** 2 + char1_move.y ** 2);
        char1_move.x /= char1_move_length;
        char1_move.y /= char1_move_length;

        let char2_move = { x: char1.x - char2.x, y: char1.y - char2.y };
        let char2_move_length = Math.sqrt(char2_move.x ** 2 + char2_move.y ** 2);
        char2_move.x /= char2_move_length;
        char2_move.y /= char2_move_length;

        //たす
        char1.x += char1_move.x;
        char1.y += char1_move.y;
        char2.x += char2_move.x;
        char2.y += char2_move.y;

        //王様がワープホールに触れた時の反応
        if (char1.isWarpAllows == true) {
            for (let a = 0; a < warps.length; a++) {
                const distance = Math.sqrt(
                    (warps[a].x - char1.x) ** 2 +
                    (warps[a].y - char1.y) ** 2
                );
                if (distance < 5) {
                    let index = Math.floor(Math.random() * warps.length)
                    char1.x = warps[index].x;
                    char1.y = warps[index].y;
                    char1.isWarpAllows = false;
                    warpplay();
                    setTimeout(function () { char1.isWarpAllows = true; }, 600);
                    
                };
            };
        };
        //王様がワープホールに触れた時の反応
        if (char2.isWarpAllows == true) {
            for (let a = 0; a < warps.length; a++) {
                const distance = Math.sqrt(
                    (warps[a].x - char2.x) ** 2 +
                    (warps[a].y - char2.y) ** 2
                );
                if (distance < 5) {
                    let index = Math.floor(Math.random() * warps.length)
                    char2.x = warps[index].x;
                    char2.y = warps[index].y;
                    char2.isWarpAllows = false;
                    warpplay();
                    setTimeout(function () { char2.isWarpAllows = true; }, 600);
                };
            };
        };
        //　ワープ消える
        for (let i = 0; i < warps.length; i++) {
            const passedtime = new Date() - warps[i].created;
            console.log(passedtime);
            if (passedtime > 10000) {
                warps.splice(i, 1)
            };
        };
    };
    //ぶつかったらgameover
    const distance = Math.sqrt(
        (char1.x - char2.x) ** 2,
        (char1.y - char2.y) ** 2
    );
    if (distance < 1) {
        console.log("GAME OVER");
        stop();
        sesshokuSoundplay()
        gamestate = GAMEOVER;
        gameoverplay();

        //音を止める
    
    }
};
setInterval(updatePosition, 40);

//描画する関数
function draw() {
    ctx.clearRect(0, 0, 800, 800);
    //スタートボタン
    if (gamestate == START) {
        ctx.fillStyle = "pink"
        ctx.beginPath();
        ctx.fillText("スタート画面だよ　画面をタッチしてね　タッチしたらゲームが始まるよ　赤と青がくっつかない様に緑を取ってからワープホールを配置しよう", 100, 100);
    }
    else if (gamestate == PLAYING) {
        //赤い敵
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(char1.x, char1.y, 4, 0, 3 * Math.PI);
        ctx.fill();

        //青い敵
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(char2.x, char2.y, 4, 0, 3 * Math.PI);
        ctx.fill();

        //var items= [{x: Math.random() * width, y: Math.random() * height},{x: Math.random() * width, y: Math.random() * height}];
        for (let i = 0; i < items.length; i++) {
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.fillRect(items[i].x, items[i].y,8,8);
            ctx.fill();
        }
        //ワープホール
        for (let i = 0; i < warps.length; i++) {
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.fillRect(warps[i].x, warps[i].y,8,8);
            ctx.fill();
        }
    }
    //GameOver
    if (gamestate == GAMEOVER) {
        ctx.fillStyle = "green";
        ctx.fillText("ゲーム オーバー？", 400, 400);
        ctx.font = "40px serif";
    };
};

//定期実行
setInterval(draw, 10);
