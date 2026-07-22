const QUESTIONS = [
  {
    number: 1,
    question: "쉬고 싶은데 쉬기 싫다.\n진짜 내 마음은 뭘까?",
    image: "images/q1.png",
    answers: [
      {
        text: "어디로 가야 할지 몰라서 멈춰 있다.",
        type: "path"
      },
      {
        text: "아직 준비가 부족한 것 같아서 더 챙기고 싶다.",
        type: "seed"
      },
      {
        text: "몸도 마음도 지쳐서 일단 쉬고 싶다.",
        type: "pause"
      },
      {
        text: "열심히 하고 싶은데 날 불러주는 곳이 없다.",
        type: "jump"
      }
    ]
  },
  {
    number: 2,
    question: "오늘 뭐하지?",
    image: "images/q2.png",
    answers: [
      {
        text: "폰으로 이것저것 찾아보다가 하루가 끝난다.",
        type: "explore"
      },
      {
        text: "공부해야지… 하며 책상 앞에 앉는다.",
        type: "seed"
      },
      {
        text: "침대와 한 몸이 되어 푹 쉰다.",
        type: "pause"
      },
      {
        text: "채용 공고부터 슬쩍 확인해본다.",
        type: "jump"
      }
    ]
  },
  {
    number: 3,
    question: "문득 해야 할 일이 떠오를 때\n나는?",
    image: "images/q3.png",
    answers: [
      {
        text: "머릿속으로만 여러 방향을 상상한다.",
        type: "path"
      },
      {
        text: "완벽하게 준비될 때까지 조금 더 미룬다.",
        type: "seed"
      },
      {
        text: "누가 옆에서 같이 해줬으면 좋겠다고 생각한다.",
        type: "together"
      },
      {
        text: "일단 아주 작은 것 하나만 해본다.",
        type: "step"
      }
    ]
  },
  {
    number: 4,
    question: "힘들고 지친다...\n내가 자꾸 쉬고 싶은 이유는?",
    image: "images/q4.png",
    answers: [
      {
        text: "무엇부터 해야 할지 하나도 모르겠다.",
        type: "path"
      },
      {
        text: "아직 나는 부족한 것 같아서 더 준비해야 할 것 같다.",
        type: "seed"
      },
      {
        text: "그냥 너무 피곤하고 힘이 없다.",
        type: "pause"
      },
      {
        text: "또 실패하면 어쩌나 무섭다.",
        type: "spark"
      }
    ]
  },
  {
    number: 5,
    question: "책상 위에 작은 세잎클로버 메모가 놓여 있다.\n“다시 시작한다면,\n무엇부터 해볼래?”",
    image: "images/q5.png",
    answers: [
      {
        text: "나에게 맞는 길부터 다시 찾아보고 싶다.",
        type: "explore"
      },
      {
        text: "지원할 곳부터 정해보고 싶다.",
        type: "jump"
      },
      {
        text: "주변 사람에게 조언을 구하고 싶다.",
        type: "together"
      },
      {
        text: "일단 수면패턴이나 생활리듬부터 바꿔보고 싶다.",
        type: "step"
      }
    ]
  },
  {
    number: 6,
    question: "혼자 있는 시간이 길어질 때\n나는 어떤 모습에 가까울까?",
    image: "images/q6.png",
    answers: [
      {
        text: "머릿속에서 미래 시나리오를 계속 그린다.",
        type: "path"
      },
      {
        text: "다시 시작하고 싶은데, 또 실패할까 봐 망설인다.",
        type: "spark"
      },
      {
        text: "아무것도 하기 싫어서 계속 누워 있는다.",
        type: "pause"
      },
      {
        text: "누군가 만나고 싶어진다. 혼자는 좀 싫다.",
        type: "together"
      }
    ]
  },
  {
    number: 7,
    question: "지금 내가 제일 듣고 싶은 말은?",
    image: "images/q7.png",
    answers: [
      {
        text: "하고 싶은 걸 해도 괜찮아.",
        type: "explore"
      },
      {
        text: "아직 늦지 않았어. 다시 해볼까?",
        type: "spark"
      },
      {
        text: "너는 혼자가 아니야.",
        type: "together"
      },
      {
        text: "오늘은 한 걸음이면 충분해.",
        type: "step"
      }
    ]
  },
  {
    number: 8,
    question: "방문 앞에 섰다.\n나가도 되고, 조금 더 있어도 된다.\n나는 다시 시작할 수 있을까?",
    image: "images/q8.png",
    answers: [
      {
        text: "지금 나갈래!",
        type: "jump"
      },
      {
        text: "문밖에 뭐가 있는지 먼저 확인해볼래.",
        type: "explore"
      },
      {
        text: "무서워도 열어보자.",
        type: "spark"
      },
      {
        text: "문을 열고 한 발자국만 나가본다.",
        type: "step"
      }
    ]
  }
];