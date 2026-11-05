// 기수(시즌)별 설정 — 2611(2기)이 기본, 2607(1기)은 익명 기록 보관용.
window.COHORTS = {
  "2611": {
    label: "2611 · 2기 (2026.11 ~ 2027.02)",
    tag: "트레바리 독서모임 · 2기",
    lead: "책 30분, 실습 2시간. 매달 내 일에 쓸 AI를 하나씩 직접 만듭니다. 이 모임은 AI로 더 많은 일을 해내기가 아니라, <b>어떤 일은 자동화하고 어떤 일은 사람의 손에 남길지</b> 함께 선을 긋는 모임입니다.",
    statsText: "🙋‍♂️ 정원 마감 <span style=\"font-size: 12px; font-weight: 500; color: var(--text-muted);\">(최대 17명)</span>",
    trevariUrl: "https://trevar.ink/BaF1yG",
    keywords: null,
    photo: { src: "images/2607-group.webp", caption: "지난 1기(2607) 첫 모임 · 2026.07.10 (멤버 얼굴은 가렸어요)" },
    goals: [
      ["✅ 내 일에 붙는 AI 4개", "업무용 챗봇, AI 비서, 브라우저 AI, 15초 숏폼까지. 매 회차 하나씩 직접 만들어서 가져갑니다."],
      ["✅ 완주하면 남는 것", "4회 모두 참석하신 분께는 클로드코드 클리커 키링을 드려요. 매 회차 자료가 여기 쌓이니, 한 번 빠지셔도 따라오실 수 있어요."]
    ],
    format: [
      "매달 둘째 주 금요일 19:40 ~ 22:40 · 트레바리 강남 아지트",
      "진행: 책 이야기 30분 + 실습 2시간 (노트북을 꼭 챙겨 주세요)",
      "독후감 마감: 모임 이틀 전 수요일 23:59 (11/11 · 12/9 · 1/6 · 2/10)",
      "모임 전: 그날 준비할 것과 읽을거리를 이 사이트에 올려요",
      "모임 후: 그날 만든 워크플로우와 핵심 정리를 이 사이트에 올려요"
    ],
    modules: [
      { badge: "1회차 · 11/13", title: "n8n으로 업무용 AI 챗봇 만들기", desc: "n8n 기본기를 익히고, 내 업무 자료를 바탕으로 답하는 AI Agent 챗봇을 직접 만듭니다.", read: "이인영·임정, 『n8n이 다 해줌』" },
      { badge: "2회차 · 12/11", title: "24시간 일하는 AI 비서", desc: "여러 AI 비서 도구를 비교해 보고, 나에게 맞는 비서 하나를 직접 세팅합니다.", read: "데니스 뇌르마르크, 『진짜 노동』" },
      { badge: "3회차 · 1/8", title: "브라우저 AI로 웹 일 맡기기", desc: "브라우저에서 반복하던 클릭과 입력을 AI에게 맡기는 법을 실습합니다.", read: "이인영, 「이제 직원 급여도 AI가 보냅니다」", readUrl: "https://datapopcorn.ai/blog/ai-payroll-transfer-hana-adb" },
      { badge: "4회차 · 2/12", title: "AI로 15초 숏폼 영상 만들기", desc: "아낀 시간으로 무엇을 만들지 이야기하고, AI로 15초 숏폼 영상을 하나 완성합니다.", read: "이본 쉬나드, 『파타고니아, 파도가 칠 때는 서핑을』" }
    ],
    benefits: [
      ["🎓 인프런 강의 90% 할인", "데이터팝콘 VOD 강의 할인 쿠폰. 링크는 카톡방 공지에 있어요 (12/31까지 등록, 등록 후 24시간 안에 사용)."],
      ["🧭 1:1 AI·AX 무료 상담 30분", "개인 업무나 회사의 AI 도입 고민을 함께 봐 드려요. 2회차 전까지 받으시면 모임 실습으로 바로 이어갈 수 있어요.", "https://cal.com/data.popcorn/trevari-1on1", "상담 신청하기 →"],
      ["🎁 완주 선물", "4회 모두 출석하신 분께 클로드코드 클리커 키링을 드립니다."]
    ],
    notice: null,
    cta: null,
  },
  "2607": {
    label: "2607 · 1기 (2026.07 ~ 2026.10)",
    tag: "트레바리 독서모임 · 1기 기록",
    lead: "1기는 내 일을 '트리거 → 처리 → 출력 → 검토'로 쪼개 보고, 무엇을 자동화하고 무엇을 사람 손에 남길지 설계하는 데 집중했습니다. 멤버 이름은 익명으로 바꿔 두었어요.",
    statsText: null,
    keywords: [["n8n 워크플로우","huge"],["생산성","large"],["반복 업무","medium"],["API 연동","large"],["환각 현상","small"],["자동화","huge"],["프롬프트 엔지니어링","medium"],["웹훅(Webhook)","small"],["막막함","medium"]],
    photo: { src: "images/2607-group.webp", caption: "1기 첫 모임 · 2026.07.10 (멤버 얼굴은 가렸어요)" },
    goals: [
      ["✅ 하나의 실전 자동화", "적어도 내 일을 괴롭히던 반복 업무 하나가 실제로 돌아가는 자동화로 바뀝니다."],
      ["✅ 나만의 워크플로우", "'나만의 워크플로우 설계안' 한 장을 완성하여 앞으로의 든든한 기준점으로 삼습니다."]
    ],
    format: null,
    modules: [
      { badge: "1회차", title: "자동화의 공통 언어 잡기", desc: "내 일을 '트리거 → 처리 → 출력 → 검토'로 쪼개보고, 자동화에 올릴 후보 업무를 정합니다.", link: ["ch01.html", "01 · 공통 언어 잡기 (7/10)"] },
      { badge: "2회차", title: "'바쁘기만 한 일' 걷어내기", desc: "메일 분류, 단순 입력처럼 바쁘기만 한 가짜 노동을 찾고 자동화로 넘길 대상을 확정합니다.", link: ["ch02.html", "02 · 일 걷어내기 (8/14)"] },
      { badge: "3회차", title: "작고 단단한 시스템 만들기", desc: "무엇을 남기고 넘길지 기준을 정한 후, 작은 버전의 설계도를 그려보고 라이브 시연을 통해 첫 시스템을 완성합니다.", link: ["ch03.html", "03 · 작고 단단한 시스템 (9/11)"] },
      { badge: "4회차", title: "아낀 시간을 어디에 쓸 것인가", desc: "자동화로 되찾은 시간을 어떻게 쓸지 논의하며, 최종 완성된 워크플로우를 서로 시연하고 공유합니다.", link: ["ch04.html", "04 · 시간의 쓰임 (10/9)"] }
    ],
    benefits: null,
    notice: "💡 <strong>노트북 지참 안내 (클럽장 라이브 시연 중심)</strong><br>1기 모임은 클럽장이 대화면으로 핵심 워크플로우를 라이브 시연하고, 토론과 질문 위주로 진행했습니다.",
    cta: ["1기 교안 보기", "01 · 자동화의 공통 언어 잡기", "ch01.html"],
  }
};
window.DEFAULT_COHORT = "2611";
window.getCohortId = function () {
  const p = new URLSearchParams(location.search).get("c");
  if (p && window.COHORTS[p]) { try { localStorage.setItem("trevari_cohort", p); } catch (e) {} return p; }
  let s = null; try { s = localStorage.getItem("trevari_cohort"); } catch (e) {}
  return (s && window.COHORTS[s]) ? s : window.DEFAULT_COHORT;
};
