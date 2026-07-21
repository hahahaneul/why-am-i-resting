/* =========================
   메인 동작 코드
   - 화면 전환
   - 질문 진행
   - 결과 계산
   - Firebase 참여자수
   - 이미지 사전 로딩
   - 원래 유형 돌아가기
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

let currentQuestionIndex = 0;
let selectedAnswers = [];

let originalResultType = null;
let currentResultType = null;

let isAnswerLocked = false;

const imageCache = {};

/* =========================
   DOM 가져오기
========================= */

const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const loadingScreen = document.getElementById("loading-screen");
const resultScreen = document.getElementById("result-screen");

const participantCountEl = document.getElementById("participant-count");
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

const originalTypeButton = document.getElementById("original-type-button");

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
  preloadAllImages();
  showScreen("start");
}

/* =========================
   이벤트 연결
========================= */

function bindEvents() {
  startButton.addEventListener("click", handleStart);

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

  if (originalTypeButton) {
    originalTypeButton.addEventListener("click", function () {
      if (originalResultType) {
        renderResult(originalResultType);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

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
   이미지 사전 로딩
========================= */

function preloadAllImages() {
  const imagePaths = [
    "images/start-main.png",
    "images/og-image.png",
    ...QUESTIONS.map(function (question) {
      return question.image;
    }),
    ...TYPE_ORDER.map(function (type) {
      return TYPE_INFO[type].image;
    })
  ];

  const uniqueImagePaths = [...new Set(imagePaths)];

  uniqueImagePaths.forEach(function (src) {
    preloadImage(src);
  });
}

function preloadImage(src) {
  if (!src) {
    return Promise.resolve();
  }

  if (imageCache[src]) {
    return imageCache[src].promise;
  }

  const img = new Image();

  const promise = new Promise(function (resolve) {
    img.onload = function () {
      resolve(src);
    };

    img.onerror = function () {
      console.warn("이미지 로딩 실패:", src);
      resolve(src);
    };
  });

  img.src = src;

  imageCache[src] = {
    img: img,
    promise: promise
  };

  return promise;
}

function isImageLoaded(src) {
  return Boolean(
    imageCache[src] &&
      imageCache[src].img &&
      imageCache[src].img.complete &&
      imageCache[src].img.naturalWidth > 0
  );
}

function prepareImageWithLimit(src, maxWaitMs) {
  const imagePromise = preloadImage(src);

  const limitPromise = new Promise(function (resolve) {
    setTimeout(resolve, maxWaitMs);
  });

  return Promise.race([imagePromise, limitPromise]);
}

function preloadNextQuestionImage() {
  const nextIndex = currentQuestionIndex + 1;

  if (QUESTIONS[nextIndex]) {
    preloadImage(QUESTIONS[nextIndex].image);
  }
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
  currentQuestionIndex = 0;
  selectedAnswers = [];
  originalResultType = null;
  currentResultType = null;
  isAnswerLocked = false;

  increaseParticipantCount();

  prepareImageWithLimit(QUESTIONS[0].image, 500).then(function () {
    showScreen("question");
    renderQuestion();
    preloadNextQuestionImage();
  });
}

/* =========================
   질문 렌더링
========================= */

function renderQuestion() {
  const question = QUESTIONS[currentQuestionIndex];
  const total = QUESTIONS.length;
  const currentNumber = currentQuestionIndex + 1;
  const percent = Math.round((currentNumber / total) * 100);

  isAnswerLocked = false;

  progressText.textContent = `${currentNumber} / ${total}`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

  questionNumber.textContent = `Q${question.number}`;
  questionTitle.textContent = question.question;

  renderQuestionImage(question);
  renderAnswerButtons(question);
  preloadNextQuestionImage();
}

function renderQuestionImage(question) {
  const nextSrc = question.image;

  questionImage.alt = `질문 ${question.number}번 이미지`;

  if (questionImage.src.includes(nextSrc) && isImageLoaded(nextSrc)) {
    questionImage.style.opacity = "1";
    return;
  }

  if (isImageLoaded(nextSrc)) {
    questionImage.style.opacity = "1";
    questionImage.src = nextSrc;
    return;
  }

  questionImage.style.opacity = "0.25";
  questionImage.src = nextSrc;

  preloadImage(nextSrc).then(function () {
    if (QUESTIONS[currentQuestionIndex].image === nextSrc) {
      questionImage.style.opacity = "1";
    }
  });
}

function renderAnswerButtons(question) {
  answerList.innerHTML = "";

  question.answers.forEach(function (answer) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-button";
    button.textContent = answer.text;
    button.disabled = false;

    button.addEventListener("click", function () {
      selectAnswer(answer.type, button);
    });

    answerList.appendChild(button);
  });
}

function selectAnswer(type, selectedButton) {
  if (isAnswerLocked) {
    return;
  }

  isAnswerLocked = true;

  const allButtons = document.querySelectorAll(".answer-button");

  allButtons.forEach(function (button) {
    button.classList.remove("selected");
    button.blur();
  });

  selectedButton.classList.add("selected");
  selectedAnswers[currentQuestionIndex] = type;

  allButtons.forEach(function (button) {
    button.disabled = true;
  });

  setTimeout(function () {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      const nextQuestion = QUESTIONS[nextQuestionIndex];

      prepareImageWithLimit(nextQuestion.image, 450).then(function () {
        currentQuestionIndex = nextQuestionIndex;
        renderQuestion();
      });

      return;
    }

    showLoading();
  }, 130);
}

/* =========================
   로딩
========================= */

function showLoading() {
  showScreen("loading");

  let percent = 0;

  loadingFill.style.width = "0%";
  loadingPercent.textContent = "0%";

  const resultType = calculateResult();

  originalResultType = resultType;
  currentResultType = resultType;

  if (TYPE_INFO[resultType]) {
    preloadImage(TYPE_INFO[resultType].image);
  }

  const loadingTimer = setInterval(function () {
    percent += 5;

    if (percent >= 100) {
      percent = 100;
      clearInterval(loadingTimer);

      loadingFill.style.width = "100%";
      loadingPercent.textContent = "100%";

      prepareImageWithLimit(TYPE_INFO[resultType].image, 500).then(function () {
        setTimeout(function () {
          renderResult(resultType);
          showScreen("result");
        }, 180);
      });

      return;
    }

    loadingFill.style.width = `${percent}%`;
    loadingPercent.textContent = `${percent}%`;
  }, 38);
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
  const priorityQuestionIndexes = [7, 4, 6, 5, 3, 2, 1, 0];

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
  renderResultHeader(result, typeInfo, typeKey);
  renderRelatedTypes(typeInfo);
  renderOriginalTypeButton(typeKey);
  renderResultText(result);
  renderPolicies(typeKey);

  if (youthLink) {
    youthLink.href = YOUTH_LOUNGE_URL;
  }
}

function applyResultTheme(typeInfo) {
  TYPE_ORDER.forEach(function (type) {
    resultCard.classList.remove(`type-${type}`);
  });

  resultCard.classList.add(typeInfo.className);
}

function renderResultHeader(result, typeInfo, typeKey) {
  const isOriginalType = typeKey === originalResultType;

  if (isOriginalType) {
    resultKicker.textContent = "결과가 나왔어요!";
    resultLabel.textContent = "당신의 유형은";
  } else {
    resultKicker.textContent = "다른 유형을 보고 있어요";
    resultLabel.textContent = "참고 유형은";
  }

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

function renderOriginalTypeButton(typeKey) {
  if (!originalTypeButton) {
    return;
  }

  if (!originalResultType || typeKey === originalResultType) {
    originalTypeButton.classList.add("hidden");
    originalTypeButton.textContent = "내 원래 유형으로 돌아가기";
    return;
  }

  const originalTypeName = TYPE_INFO[originalResultType].name;

  originalTypeButton.textContent = `내 원래 유형(${originalTypeName})으로 돌아가기`;
  originalTypeButton.classList.remove("hidden");
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
  const result = RESULTS[originalResultType || currentResultType];

  if (!result) {
    return "나는 왜 쉬고 있을까? 지금의 나를 알아보는 쉬었음 유형 테스트";
  }

  return `나의 쉬었음 유형은 ${result.title}!`;
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
  originalResultType = null;
  currentResultType = null;
  isAnswerLocked = false;

  shareMenu.classList.remove("open");

  if (originalTypeButton) {
    originalTypeButton.classList.add("hidden");
  }

  showScreen("start");
}