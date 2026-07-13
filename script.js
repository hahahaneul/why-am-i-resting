/* =========================
   메인 동작 코드
   - 화면 전환
   - 질문 진행
   - 결과 계산
   - Firebase 참여자수
   - 공유 기능
========================= */

/* =========================
   Firebase 설정
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyBU1IOowyXl6-OchDJuJbwYnTH8s_pZtio",
  authDomain: "why-am-i-resting.firebaseapp.com",
  databaseURL: "https://why-am-i-resting-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "why-am-i-resting",
  storageBucket: "why-am-i-resting.firebasestorage.app",
  messagingSenderId: "658860370015",
  appId: "1:658860370015:web:566643d4228a56b19953ea"
};

let participantRef = null;
let latestParticipantCount = 0;

try {
  firebase.initializeApp(firebaseConfig);
  participantRef = firebase.database().ref("stats/participants");
} catch (error) {
  console.warn("Firebase 연결에 실패했습니다.", error);
}

/* =========================
   기본 변수
========================= */

const TEST_SHARE_URL = "https://hahahaneul.github.io/why-am-i-resting/";

let userName = "";
let currentQuestionIndex = 0;
let selectedAnswers = [];
let currentResultType = null;

/* =========================
   DOM 가져오기
========================= */

const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const loadingScreen = document.getElementById("loading-screen");
const resultScreen = document.getElementById("result-screen");

const participantCountEl = document.getElementById("participant-count");

const nameInput = document.getElementById("name-input");
const nameError = document.getElementById("name-error");
const startButton = document.getElementById("start-button");

const progressText = document.getElementById("progress-text");
const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");

const questionImage = document.getElementById("question-image");
const questionNumber = document.getElementById("question-number");
const questionTitle = document.getElementById("question-title");
const answerList = document.getElementById("answer-list");

const loadingFill = document.getElementById("loading-fill");
const loadingPercent = document.getElementById("loading-percent");

const resultCard = document.querySelector(".result-card");
const resultKicker = document.querySelector(".result-kicker");
const resultLabel = document.querySelector(".result-label");
const resultTitle = document.getElementById("result-title");
const resultSubtitle = document.getElementById("result-subtitle");
const resultImage = document.getElementById("result-image");

const similarTypeCard = document.getElementById("similar-type-card");
const differentTypeCard = document.getElementById("different-type-card");
const similarTypeName = document.getElementById("similar-type-name");
const differentTypeName = document.getElementById("different-type-name");

const resultOneLine = document.getElementById("result-one-line");
const resultSummary = document.getElementById("result-summary");
const resultTraits = document.getElementById("result-traits");
const resultStrengths = document.getElementById("result-strengths");
const policyList = document.getElementById("policy-list");

const youthLink = document.getElementById("youth-link");

const shareToggleButton = document.getElementById("share-toggle-button");
const shareMenu = document.getElementById("share-menu");
const nativeShareButton = document.getElementById("native-share-button");
const xShareButton = document.getElementById("x-share-button");
const copyLinkButton = document.getElementById("copy-link-button");
const restartButton = document.getElementById("restart-button");

/* =========================
   시작
========================= */

init();

function init() {
  connectParticipantCount();
  bindEvents();
  showScreen("start");
}

/* =========================
   이벤트 연결
========================= */

function bindEvents() {
  startButton.addEventListener("click", handleStart);

  nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      handleStart();
    }
  });

  nameInput.addEventListener("input", function () {
    nameError.textContent = "";
    nameInput.classList.remove("shake");
  });

  similarTypeCard.addEventListener("click", function () {
    const type = similarTypeCard.dataset.type;
    if (type) {
      renderResult(type);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  differentTypeCard.addEventListener("click", function () {
    const type = differentTypeCard.dataset.type;
    if (type) {
      renderResult(type);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  shareToggleButton.addEventListener("click", function () {
    shareMenu.classList.toggle("open");
  });

  nativeShareButton.addEventListener("click", shareNative);
  xShareButton.addEventListener("click", shareToX);
  copyLinkButton.addEventListener("click", copyShareLink);

  restartButton.addEventListener("click", restartTest);

  document.addEventListener("click", function (event) {
    const isShareArea = event.target.closest(".share-area");

    if (!isShareArea) {
      shareMenu.classList.remove("open");
    }
  });
}

/* =========================
   Firebase 참여자수
========================= */

function connectParticipantCount() {
  if (!participantRef) {
    updateParticipantCount(0);
    return;
  }

  participantRef.on(
    "value",
    function (snapshot) {
      const count = Number(snapshot.val() || 0);
      latestParticipantCount = count;
      updateParticipantCount(count);
    },
    function (error) {
      console.warn("참여자수 불러오기 실패", error);
      updateParticipantCount(0);
    }
  );
}

function increaseParticipantCount() {
  if (!participantRef) {
    latestParticipantCount += 1;
    updateParticipantCount(latestParticipantCount);
    return;
  }

  participantRef.transaction(function (currentValue) {
    return Number(currentValue || 0) + 1;
  });
}

function updateParticipantCount(count) {
  if (!participantCountEl) return;

  const safeCount = Number(count || 0);

  if (safeCount < 10) {
    participantCountEl.textContent = `0${safeCount}`;
    return;
  }

  participantCountEl.textContent = safeCount.toLocaleString("ko-KR");
}

/* =========================
   화면 전환
========================= */

function showScreen(screenName) {
  startScreen.classList.remove("active");
  questionScreen.classList.remove("active");
  loadingScreen.classList.remove("active");
  resultScreen.classList.remove("active");

  if (screenName === "start") {
    startScreen.classList.add("active");
  }

  if (screenName === "question") {
    questionScreen.classList.add("active");
  }

  if (screenName === "loading") {
    loadingScreen.classList.add("active");
  }

  if (screenName === "result") {
    resultScreen.classList.add("active");
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}

/* =========================
   테스트 시작
========================= */

function handleStart() {
  const typedName = nameInput.value.trim();

  if (!typedName) {
    nameError.textContent = "이름을 입력한 뒤 시작해주세요.";
    nameInput.classList.remove("shake");

    void nameInput.offsetWidth;

    nameInput.classList.add("shake");
    nameInput.focus();
    return;
  }

  userName = typedName;
  currentQuestionIndex = 0;
  selectedAnswers = [];

  increaseParticipantCount();

  showScreen("question");
  renderQuestion();
}

/* =========================
   질문 렌더링
========================= */

function renderQuestion() {
  const question = QUESTIONS[currentQuestionIndex];
  const total = QUESTIONS.length;
  const currentNumber = currentQuestionIndex + 1;
  const percent = Math.round((currentNumber / total) * 100);

  progressText.textContent = `${currentNumber} / ${total}`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

  questionNumber.textContent = `Q${question.number}`;
  questionTitle.textContent = question.question;

  questionImage.src = question.image;
  questionImage.alt = `질문 ${question.number}번 이미지`;

  answerList.innerHTML = "";

  question.answers.forEach(function (answer) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-button";
    button.textContent = answer.text;

    button.addEventListener("click", function () {
      selectAnswer(answer.type, button);
    });

    answerList.appendChild(button);
  });
}

function selectAnswer(type, selectedButton) {
  const allButtons = document.querySelectorAll(".answer-button");

  allButtons.forEach(function (button) {
    button.disabled = true;
    button.classList.remove("selected");
  });

  selectedButton.classList.add("selected");

  selectedAnswers[currentQuestionIndex] = type;

  setTimeout(function () {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      currentQuestionIndex += 1;
      renderQuestion();
      return;
    }

    showLoading();
  }, 220);
}

/* =========================
   로딩
========================= */

function showLoading() {
  showScreen("loading");

  let percent = 0;

  loadingFill.style.width = "0%";
  loadingPercent.textContent = "0%";

  const loadingTimer = setInterval(function () {
    percent += 4;

    if (percent >= 100) {
      percent = 100;
      clearInterval(loadingTimer);

      loadingFill.style.width = "100%";
      loadingPercent.textContent = "100%";

      setTimeout(function () {
        const resultType = calculateResult();
        renderResult(resultType);
        showScreen("result");
      }, 300);

      return;
    }

    loadingFill.style.width = `${percent}%`;
    loadingPercent.textContent = `${percent}%`;
  }, 45);
}

/* =========================
   결과 계산
========================= */

function calculateResult() {
  const scores = {};

  TYPE_ORDER.forEach(function (type) {
    scores[type] = 0;
  });

  selectedAnswers.forEach(function (type) {
    if (scores[type] !== undefined) {
      scores[type] += 1;
    }
  });

  const highestScore = Math.max(...Object.values(scores));

  const tiedTypes = TYPE_ORDER.filter(function (type) {
    return scores[type] === highestScore;
  });

  if (tiedTypes.length === 1) {
    return tiedTypes[0];
  }

  return resolveTie(tiedTypes);
}

function resolveTie(tiedTypes) {
  const priorityQuestionIndexes = [4, 6, 7, 2, 5, 3, 1, 0];

  for (const questionIndex of priorityQuestionIndexes) {
    const selectedType = selectedAnswers[questionIndex];

    if (tiedTypes.includes(selectedType)) {
      return selectedType;
    }
  }

  return tiedTypes[0] || "seed";
}

/* =========================
   결과 렌더링
========================= */

function renderResult(typeKey) {
  const result = RESULTS[typeKey];
  const typeInfo = TYPE_INFO[typeKey];

  if (!result || !typeInfo) {
    return;
  }

  currentResultType = typeKey;

  applyResultTheme(typeInfo);
  renderResultHeader(result, typeInfo);
  renderRelatedTypes(typeInfo);
  renderResultText(result);
  renderPolicies(typeKey);

  youthLink.href = YOUTH_LOUNGE_URL;
}

function applyResultTheme(typeInfo) {
  TYPE_ORDER.forEach(function (type) {
    resultCard.classList.remove(`type-${type}`);
  });

  resultCard.classList.add(typeInfo.className);
}

function renderResultHeader(result, typeInfo) {
  resultKicker.textContent = `${userName}님의 결과가 나왔어요!`;
  resultLabel.textContent = `${userName}님은`;
  resultTitle.textContent = `${result.title}입니다`;
  resultSubtitle.textContent = result.subtitle;

  resultImage.src = typeInfo.image;
  resultImage.alt = `${result.title} 결과 이미지`;
}

function renderRelatedTypes(typeInfo) {
  const similarType = TYPE_INFO[typeInfo.similar];
  const differentType = TYPE_INFO[typeInfo.different];

  similarTypeName.textContent = similarType.name;
  differentTypeName.textContent = differentType.name;

  similarTypeCard.dataset.type = similarType.key;
  differentTypeCard.dataset.type = differentType.key;
}

function renderResultText(result) {
  resultOneLine.textContent = result.oneLine;
  resultSummary.textContent = result.summary;

  resultTraits.innerHTML = "";
  resultStrengths.innerHTML = "";

  result.traits.forEach(function (text) {
    const li = document.createElement("li");
    li.textContent = text;
    resultTraits.appendChild(li);
  });

  result.strengths.forEach(function (text) {
    const li = document.createElement("li");
    li.textContent = text;
    resultStrengths.appendChild(li);
  });
}

function renderPolicies(typeKey) {
  const policies = POLICY_RECOMMENDATIONS[typeKey] || [];

  policyList.innerHTML = "";

  policies.forEach(function (policy) {
    const item = document.createElement("div");
    item.className = "policy-item";

    const title = document.createElement("strong");
    title.textContent = policy.title;

    const description = document.createElement("span");
    description.textContent = policy.description;

    item.appendChild(title);
    item.appendChild(description);

    policyList.appendChild(item);
  });
}

/* =========================
   공유 기능
========================= */

function getShareText() {
  const result = RESULTS[currentResultType];

  if (!result) {
    return "나는 왜 쉬고 있을까? 지금의 나를 알아보는 쉬었음 유형 테스트";
  }

  return `${userName}님의 쉬었음 유형은 ${result.title}!`;
}

function shareNative() {
  const shareData = {
    title: "나는 왜 쉬고 있을까?",
    text: getShareText(),
    url: TEST_SHARE_URL
  };

  if (navigator.share) {
    navigator
      .share(shareData)
      .catch(function (error) {
        console.warn("공유가 취소되었거나 실패했습니다.", error);
      });

    return;
  }

  copyShareLink();
}

function shareToX() {
  const text = encodeURIComponent(getShareText());
  const url = encodeURIComponent(TEST_SHARE_URL);
  const xUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;

  window.open(xUrl, "_blank", "noopener,noreferrer");
}

function copyShareLink() {
  const textToCopy = TEST_SHARE_URL;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(function () {
        showCopyComplete();
      })
      .catch(function () {
        fallbackCopy(textToCopy);
      });

    return;
  }

  fallbackCopy(textToCopy);
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    showCopyComplete();
  } catch (error) {
    alert("링크 복사에 실패했어요. 주소창의 링크를 직접 복사해주세요.");
  }

  document.body.removeChild(textarea);
}

function showCopyComplete() {
  const originalText = copyLinkButton.textContent;

  copyLinkButton.textContent = "복사 완료!";
  shareMenu.classList.add("open");

  setTimeout(function () {
    copyLinkButton.textContent = originalText;
  }, 1300);
}

/* =========================
   다시 하기
========================= */

function restartTest() {
  currentQuestionIndex = 0;
  selectedAnswers = [];
  currentResultType = null;

  shareMenu.classList.remove("open");

  showScreen("start");
}