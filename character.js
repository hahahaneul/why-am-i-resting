/* =========================
   유형 기본 정보
   - 결과 이미지 경로
   - 유형명
   - 비슷한 유형 / 다른 유형
========================= */

const TYPE_ORDER = [
  "seed",
  "pause",
  "path",
  "step",
  "jump",
  "together",
  "spark",
  "explore"
];

const TYPE_INFO = {
  seed: {
    key: "seed",
    name: "씨앗형",
    image: "images/result-seed.png",
    className: "type-seed",
    similar: "step",
    different: "jump"
  },

  pause: {
    key: "pause",
    name: "숨고르기형",
    image: "images/result-pause.png",
    className: "type-pause",
    similar: "together",
    different: "jump"
  },

  path: {
    key: "path",
    name: "길찾기형",
    image: "images/result-path.png",
    className: "type-path",
    similar: "explore",
    different: "jump"
  },

  step: {
    key: "step",
    name: "한걸음형",
    image: "images/result-step.png",
    className: "type-step",
    similar: "seed",
    different: "explore"
  },

  jump: {
    key: "jump",
    name: "도약형",
    image: "images/result-jump.png",
    className: "type-jump",
    similar: "spark",
    different: "pause"
  },

  together: {
    key: "together",
    name: "함께형",
    image: "images/result-together.png",
    className: "type-together",
    similar: "pause",
    different: "path"
  },

  spark: {
    key: "spark",
    name: "재점화형",
    image: "images/result-spark.png",
    className: "type-spark",
    similar: "jump",
    different: "pause"
  },

  explore: {
    key: "explore",
    name: "탐험형",
    image: "images/result-explore.png",
    className: "type-explore",
    similar: "path",
    different: "step"
  }
};