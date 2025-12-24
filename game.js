/**
 * Rocket Escape - 게임 로직 (Game Logic)
 *
 * 이 파일은 게임의 핵심 로직을 담당합니다.
 * 로켓의 물리 움직임, 게임 상태 관리, 화면 그리기, 사용자 입력 처리 등이 포함됩니다.
 */

// 캔버스 요소 가져오기 및 2D 렌더링 컨텍스트 설정
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI 요소 참조 (DOM Elements Reference)
const UI = {
    startScreen: document.getElementById('start-screen'), // 시작 화면
    hud: document.getElementById('hud'),                 // 헤드업 디스플레이 (점수, 게이지 등)
    gameOverScreen: document.getElementById('game-over-screen'), // 게임 오버 화면
    altitudeValue: document.getElementById('altitude-value'), // 고도 표시 텍스트
    boostFill: document.getElementById('boost-fill'),     // 부스트 게이지 채움바
    finalAltitude: document.getElementById('final-altitude'), // 최종 고도 표시
    endTitle: document.getElementById('end-title'),       // 게임 오버 타이틀
    startButton: document.getElementById('start-button'), // 시작 버튼
    restartButton: document.getElementById('restart-button'), // 재시작 버튼
    shareButton: document.getElementById('share-button')  // 공유 버튼
};

// 게임 상수 (Game Constants) - 게임 밸런스 조절용
const GRAVITY = 0.15;        // 중력 가속도 (지구로 끌어당기는 힘)
const THRUST_POWER = 0.45;   // 로켓 추진력 (위로 올라가는 힘)
const MAX_HEAT = 100;        // 최대 과열 허용치 (이 값을 넘으면 폭발)
const HEAT_UP_RATE = 1.5;    // 추진 시 과열 상승 속도
const COOL_DOWN_RATE = 0.8;  // 미추진 시 냉각 속도
const MIN_ALTITUDE = 0;      // 최소 고도

// 게임 상태 변수 (Game State)
let gameState = 'START'; // 현재 상태: START(시작전), PLAYING(게임중), EXPLODED(폭발), FINISHED(종료)
let rocket = {
    y: 0,             // 로켓의 화면상 Y 좌표
    vy: 0,            // 수직 속도 (Vertical Velocity)
    altitude: 0,      // 현재 고도 (미터 단위)
    maxAltitude: 0,   // 도달한 최대 고도
    heat: 0,          // 현재 과열 상태 (0~100)
    isBoosting: false,// 추진 중인지 여부
    width: 30,        // 로켓 너비
    height: 60        // 로켓 높이
};

// 파티클 및 배경 요소 배열
let particles = []; // 폭발이나 배기 가스 효과를 위한 입자들
let stars = [];     // 배경 별
let clouds = [];    // 배경 구름

// 캔버스 크기 초기화 (Initialize Canvas)
function resizeCanvas() {
    // 브라우저 창 크기에 맞춰 캔버스 크기 조절
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 게임 시작 전이라면 배경 요소도 재배치하여 꽉 차보이게 함
    if (gameState === 'START') {
        initBackground();
    }
}

// 배경 요소 생성 (Initialize Background)
function initBackground() {
    stars = [];
    // 별 100개 생성
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,         // 별 크기 랜덤
            speed: Math.random() * 0.5 + 0.1 // 별 반짝임/이동 속도 랜덤
        });
    }

    clouds = [];
    // 구름 5개 생성
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 100 + 50, // 구름 크기
            speed: Math.random() * 1 + 0.5  // 구름 이동 속도
        });
    }
}

// 입력 처리 핸들러 (Input Handling)
function handleInputStart(e) {
    if (gameState === 'PLAYING') {
        rocket.isBoosting = true; // 터치/클릭 시 부스트 활성화
    }
    // 기본 터치 동작 방지 (스크롤 등)
    if (e.cancelable && e.target === canvas) e.preventDefault();
}

function handleInputEnd(e) {
    rocket.isBoosting = false; // 터치/클릭 해제 시 부스트 비활성화
    if (e.cancelable && e.target === canvas) e.preventDefault();
}

// 이벤트 리스너 등록 (마우스 및 터치 지원)
window.addEventListener('mousedown', handleInputStart);
window.addEventListener('mouseup', handleInputEnd);
// passive: false는 preventDefault()를 사용하기 위해 필요
window.addEventListener('touchstart', handleInputStart, { passive: false });
window.addEventListener('touchend', handleInputEnd, { passive: false });

UI.startButton.onclick = startGame;
UI.restartButton.onclick = startGame;
UI.shareButton.onclick = shareResult;

// 게임 시작 함수 (Start Game)
function startGame() {
    gameState = 'PLAYING';
    // 로켓 상태 초기화
    rocket = {
        y: canvas.height * 0.8, // 화면 하단에서 시작
        vy: 0,
        altitude: 0,
        maxAltitude: 0,
        heat: 0,
        isBoosting: false,
        width: 30,
        height: 60
    };
    particles = []; // 이전 파티클 제거
    
    // UI 전환
    UI.startScreen.classList.add('hidden');
    UI.gameOverScreen.classList.add('hidden');
    UI.hud.classList.remove('hidden');

    // 안전 장치: 배경이 비어있다면 채워넣기
    if (stars.length === 0) initBackground();
}

// 로켓 폭발 처리 (Explosion)
function explode() {
    gameState = 'EXPLODED';
    UI.endTitle.textContent = "과열 폭발! (OVERHEATED)";
    UI.endTitle.style.color = "#ff3333";
    showGameOver();
    
    // 폭발 이펙트 생성 (파티클 50개)
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: canvas.width / 2, // 화면 중앙 (로켓 위치)
            y: rocket.y,
            vx: (Math.random() - 0.5) * 15, // 사방으로 튀는 속도
            vy: (Math.random() - 0.5) * 15,
            life: 1.0, // 생명력 (1.0에서 시작해 점점 줄어듦)
            size: Math.random() * 10 + 5,
            color: '#FF3D00' // 폭발 색상
        });
    }
}

// 게임 오버 화면 표시 (Show Game Over)
function showGameOver() {
    // 상태를 FINISHED로 변경하지만, 폭발 효과가 있다면 EXPLODED 상태가 유지될 수도 있음
    // 여기서는 UI 표시만 담당
    setTimeout(() => {
        gameState = 'FINISHED';
        UI.finalAltitude.textContent = `${Math.floor(rocket.maxAltitude / 100)} km`;
        UI.hud.classList.add('hidden');
        UI.gameOverScreen.classList.remove('hidden');
    }, 1000); // 1초 딜레이 후 결과 화면 표시
}

// 게임 상태 업데이트 (Update Game Loop)
function update() {
    // 게임 중이거나 폭발 애니메이션 중이 아니면 멈춤
    if (gameState !== 'PLAYING' && gameState !== 'EXPLODED') return;

    try {
        if (gameState === 'PLAYING') {
            // 물리 엔진 처리 (Physics)
            if (rocket.isBoosting) {
                rocket.vy -= THRUST_POWER; // 위로 가속 (화면 좌표계는 아래가 +이므로 뺌)
                rocket.heat += HEAT_UP_RATE; // 온도 상승

                // 배기 가스 파티클 생성
                // 성능 최적화: 파티클이 너무 많으면 생략
                if (particles.length < 200) {
                    particles.push({
                        x: canvas.width / 2 + (Math.random() - 0.5) * 10,
                        y: rocket.y + rocket.height / 2,
                        vx: (Math.random() - 0.5) * 2,
                        vy: 5 + Math.random() * 5, // 아래로 분사
                        life: 1.0,
                        size: Math.random() * 8 + 2,
                        color: rocket.heat > 80 ? '#ffaa00' : '#FF5F1F' // 과열되면 색 변함
                    });
                }
            } else {
                rocket.heat -= COOL_DOWN_RATE; // 냉각
            }

            // 과열 수치 제한 (0 ~ MAX_HEAT)
            rocket.heat = Math.max(0, rocket.heat);

            // 과열 체크
            if (rocket.heat >= MAX_HEAT) {
                explode();
            }

            // 중력 적용
            rocket.vy += GRAVITY;
            rocket.y += rocket.vy;

            // 고도 로직 - 카메라는 로켓을 따라가는 것처럼 연출
            // 실제로는 로켓이 올라가는 속도만큼 고도를 증가시킴
            let relativeMovement = -rocket.vy;
            // 위로 올라갈 때만 고도 누적
            rocket.altitude += Math.max(0, relativeMovement);
            rocket.maxAltitude = Math.max(rocket.maxAltitude, rocket.altitude);

            // 지상 충돌 체크 (우주로 나가기 전)
            if (rocket.y > canvas.height * 0.8) {
                rocket.y = canvas.height * 0.8;
                rocket.vy = 0;
                // 만약 고도가 높은 상태에서 떨어졌다면? (추락 로직)
                // 현재 게임 디자인상 단순히 바닥에 닿으면 멈추게 되어 있음.
            }
        }

        // 파티클 업데이트 (Update Particles)
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02; // 생명력 감소
            // 생명력이 다하거나 화면 밖으로 나가면 제거
            if (p.life <= 0 || p.y > canvas.height + 50) {
                particles.splice(i, 1);
            }
        }

        // 배경 별 이동 (Parallax Effect)
        stars.forEach(s => {
            s.y += rocket.vy * 0.5 + s.speed; // 로켓 속도의 절반만큼 배경 이동 (원근감)
            // 화면 밖으로 나가면 반대편에서 재등장
            if (s.y > canvas.height) { s.y = -10; s.x = Math.random() * canvas.width; }
            if (s.y < -10) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
        });

        // 배경 구름 이동
        clouds.forEach(c => {
            c.y += rocket.vy * 0.8 + c.speed;
            if (c.y > canvas.height) { c.y = -100; c.x = Math.random() * canvas.width; }
        });

        // HUD 업데이트 (Update HUD)
        if (UI.altitudeValue) UI.altitudeValue.textContent = `${Math.floor(rocket.maxAltitude / 100)} km`;

        if (UI.boostFill) {
            UI.boostFill.style.width = `${Math.min(100, rocket.heat)}%`;
            if (rocket.heat > 80) {
                UI.boostFill.style.background = '#ff0000'; // 위험 색상
                UI.boostFill.style.boxShadow = '0 0 10px #ff0000';
            } else {
                UI.boostFill.style.background = 'linear-gradient(to right, var(--accent-color), var(--primary-color))';
                UI.boostFill.style.boxShadow = 'none';
            }
        }
    } catch (error) {
        console.error("Game Loop Error:", error);
        // 에러 발생 시 게임을 멈추지 않고 계속 시도하거나, 안전하게 종료 처리 가능
    }
}

// 화면 그리기 (Render)
function draw() {
    try {
        // 고도에 따른 하늘 배경색 변경 (그라디언트)
        const altFactor = Math.min(1, rocket.maxAltitude / 50000); // 500km 도달 시 우주색(검정)

        // 안전한 색상 보간 함수 사용
        const topColor = safeInterpolateColor('#4F9DCB', '#05070A', altFactor);
        const bottomColor = safeInterpolateColor('#E0F6FF', '#101220', altFactor);

        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, topColor);
        grad.addColorStop(1, bottomColor);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 별 그리기 (고도가 높을수록 선명해짐)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.3, altFactor)})`;
        stars.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // 구름 그리기 (고도가 높을수록 사라짐)
        if (altFactor < 1) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * (1 - altFactor)})`;
            clouds.forEach(c => {
                ctx.beginPath();
                ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // 파티클 그리기
        particles.forEach(p => {
            ctx.globalAlpha = Math.max(0, p.life); // 투명도 조절
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0; // 투명도 초기화

        // 로켓 그리기
        if (gameState !== 'EXPLODED') {
            const rx = canvas.width / 2;
            const ry = rocket.y;

            ctx.save();
            ctx.translate(rx, ry);

            // 속도에 따라 로켓을 약간 기울임 (동적 효과)
            ctx.rotate(rocket.vy * 0.05);

            // 로켓 몸체
            ctx.fillStyle = '#f0f0f0';
            ctx.beginPath();
            ctx.moveTo(0, -rocket.height/2);
            ctx.quadraticCurveTo(rocket.width/2, 0, rocket.width/2, rocket.height/2);
            ctx.lineTo(-rocket.width/2, rocket.height/2);
            ctx.quadraticCurveTo(-rocket.width/2, 0, 0, -rocket.height/2);
            ctx.fill();

            // 로켓 머리 (Tip)
            ctx.fillStyle = '#FF3D00';
            ctx.beginPath();
            ctx.moveTo(0, -rocket.height/2);
            ctx.quadraticCurveTo(rocket.width/2, -rocket.height/4, 0, -rocket.height/4);
            ctx.quadraticCurveTo(-rocket.width/2, -rocket.height/4, 0, -rocket.height/2);
            ctx.fill();

            // 창문 (Window)
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.arc(0, -rocket.height/10, 6, 0, Math.PI * 2);
            ctx.fill();
            // 창문 반사광
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(2, -rocket.height/10 - 2, 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    } catch (error) {
        console.error("Render Error:", error);
    }
}

/**
 * 두 색상 사이를 보간하는 함수 (색상 블렌딩)
 * @param {string} color1 시작 색상 (Hex)
 * @param {string} color2 끝 색상 (Hex)
 * @param {number} factor 비율 (0.0 ~ 1.0)
 * @returns {string} rgb() 색상 문자열
 */
function safeInterpolateColor(color1, color2, factor) {
    // 안전 장치: 색상 형식이 맞지 않으면 기본값 반환
    if (!color1.startsWith('#') || !color2.startsWith('#')) return color1;

    try {
        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);

        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);

        // NaN 체크 (파싱 실패 시)
        if (isNaN(r1) || isNaN(r2)) return color1;

        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));

        return `rgb(${r}, ${g}, ${b})`;
    } catch (e) {
        return color1; // 에러 발생 시 원본 색상 반환
    }
}

// 결과 공유 기능
function shareResult() {
    const alt = Math.floor(rocket.maxAltitude / 100);
    const text = `I reached ${alt} km in Rocket Escape! How far can you go? 🚀 ${window.location.href}`;
    if (navigator.share) {
        navigator.share({
            title: 'Rocket Escape',
            text: text,
            url: window.location.href,
        });
    } else {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    }
}

// 메인 게임 루프 (Game Loop)
function loop() {
    update(); // 상태 업데이트
    draw();   // 화면 그리기
    requestAnimationFrame(loop); // 다음 프레임 요청 (일반적으로 초당 60회)
}

// 창 크기 조절 이벤트 감지
window.addEventListener('resize', resizeCanvas);

// 게임 초기화 및 시작
resizeCanvas();
loop();
