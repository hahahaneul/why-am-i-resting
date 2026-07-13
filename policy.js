/* =========================
   청년ON라운지 연결 서비스
   - 결과 유형별로 3개씩 추천
========================= */

const POLICY_RECOMMENDATIONS = {
  seed: [
    {
      title: "1:1 취업 컨설팅",
      description: "준비한 내용을 이력서, 자기소개서, 면접 방향으로 정리할 수 있어요."
    },
    {
      title: "AI면접실",
      description: "혼자 준비한 내용을 실제 면접처럼 연습해보며 자신감을 만들 수 있어요."
    },
    {
      title: "스터디룸 예약",
      description: "조용히 준비를 이어가고 싶을 때 활용할 수 있는 공간이에요."
    }
  ],

  pause: [
    {
      title: "1:1 취업 컨설팅",
      description: "지금 당장 취업을 강요하기보다, 내 상황에 맞는 시작점을 함께 정리할 수 있어요."
    },
    {
      title: "금융/재무설계 상담",
      description: "쉬는 동안 부담되는 돈 문제를 자산·부채 관리 관점에서 상담받을 수 있어요."
    },
    {
      title: "주거복지상담",
      description: "주거가 불안하거나 혼자 생활이 버거울 때 공공임대와 1인가구 서비스를 안내받을 수 있어요."
    }
  ],

  path: [
    {
      title: "커리어 스타트업",
      description: "나에게 맞는 진로를 다시 설계하고 싶은 청년에게 어울리는 프로그램이에요."
    },
    {
      title: "1:1 취업 컨설팅",
      description: "막연한 고민을 직무, 산업, 지원 방향으로 구체화할 수 있어요."
    },
    {
      title: "취업준비콘서트",
      description: "현직자의 직무 이야기를 들으며 선택지를 현실적으로 좁혀볼 수 있어요."
    }
  ],

  step: [
    {
      title: "1:1 취업 컨설팅",
      description: "거창한 계획보다 오늘 할 수 있는 작은 실행부터 정리할 수 있어요."
    },
    {
      title: "모의면접 DAY",
      description: "실전 면접을 작게 경험해보며 다음 한 걸음을 준비할 수 있어요."
    },
    {
      title: "일경험 상담",
      description: "바로 취업이 부담스러울 때, 일경험으로 작게 시작하는 방법을 안내받을 수 있어요."
    }
  ],

  jump: [
    {
      title: "일경험 상담",
      description: "직접 해보며 감을 잡고 싶은 청년에게 미래내일 일경험지원사업을 안내해요."
    },
    {
      title: "모의면접 DAY",
      description: "지원 전 실전 감각을 빠르게 점검해볼 수 있어요."
    },
    {
      title: "취업준비콘서트",
      description: "현직자와 채용 이야기를 통해 바로 움직일 힌트를 얻을 수 있어요."
    }
  ],

  together: [
    {
      title: "1:1 취업 컨설팅",
      description: "혼자 정리하기 어려운 생각을 상담을 통해 말로 풀어볼 수 있어요."
    },
    {
      title: "청년특화 프로그램",
      description: "비슷한 고민을 가진 청년들과 함께 직무를 탐색해볼 수 있어요."
    },
    {
      title: "스터디룸 예약",
      description: "혼자보다 함께 준비할 때 힘이 나는 청년에게 어울리는 공간이에요."
    }
  ],

  spark: [
    {
      title: "모의면접 DAY",
      description: "다시 시작하고 싶은 마음을 실전 연습으로 이어갈 수 있어요."
    },
    {
      title: "1:1 취업 컨설팅",
      description: "이전의 실패 경험을 정리하고 다음 지원 전략을 세울 수 있어요."
    },
    {
      title: "AI면접실",
      description: "부담이 적은 방식으로 다시 면접 감각을 살려볼 수 있어요."
    }
  ],

  explore: [
    {
      title: "취업준비콘서트",
      description: "여러 직무와 산업 이야기를 들어보며 관심 분야를 넓혀볼 수 있어요."
    },
    {
      title: "청년특화 프로그램",
      description: "산업 현장 기반의 직무 탐구를 통해 다양한 가능성을 확인할 수 있어요."
    },
    {
      title: "해외취업 상담",
      description: "국내 취업 외에도 해외취업이라는 다른 선택지를 알아볼 수 있어요."
    }
  ]
};

const YOUTH_LOUNGE_URL = "https://seoulgoyoung.github.io/youth-lounge/";