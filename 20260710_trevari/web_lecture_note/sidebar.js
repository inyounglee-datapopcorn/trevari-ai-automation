// 공용 사이드바 + 푸터 — 한 곳만 고치면 모든 페이지에 반영됨.
// 트레바리 독서모임: 내 일에 바로 써먹는 AI 자동화
(function () {
  const SIDEBAR_HTML = `
    <a class="brand" href="index.html">
      <span class="brand-title">내 일에 쓰는 AI 자동화</span>
    </a>

    <div class="top-nav">
      <a class="top-nav-item" data-nav="instructor" href="instructor.html">
        <span class="ico">🙋‍♂️</span> 클럽장 소개
      </a>
      <a class="top-nav-item" data-nav="resources" href="resources.html">
        <span class="ico">🛠️</span> 모임 참고자료
      </a>

    </div>

    <nav class="ch-nav">
      <div class="mod-group">
        <div class="mod-label">시즌 개요</div>
        <div class="ch-block" data-ch="index">
          <a class="ch-head" href="index.html"><span class="ch-num">🌱</span><span class="ch-name">클럽 소개 및 목표</span></a>
        </div>
      </div>

      <div class="mod-group">
        <div class="mod-label">1회차 (7/10)</div>
        <div class="ch-block" data-ch="ch01">
          <a class="ch-head" href="ch01.html"><span class="ch-num">01</span><span class="ch-name">자동화의 공통 언어 잡기</span></a>
        </div>
      </div>

      <div class="mod-group">
        <div class="mod-label">2회차 (8/14)</div>
        <div class="ch-block" data-ch="ch02">
          <a class="ch-head" href="ch02.html"><span class="ch-num">02</span><span class="ch-name">'바쁘기만 한 일' 걷어내기</span></a>
        </div>
      </div>

      <div class="mod-group">
        <div class="mod-label">3회차 (9/11)</div>
        <div class="ch-block" data-ch="ch03">
          <a class="ch-head" href="ch03.html"><span class="ch-num">03</span><span class="ch-name">첫 자동화 v1 만들기</span></a>
        </div>
      </div>

      <div class="mod-group">
        <div class="mod-label">4회차 (10/9)</div>
        <div class="ch-block" data-ch="ch04">
          <a class="ch-head" href="ch04.html"><span class="ch-num">04</span><span class="ch-name">아낀 시간을 어디에 쓸 것인가</span></a>
        </div>
      </div>
    </nav>
  `;

  const FOOTER_HTML = `
    <footer class="page-footer">
      ⓒ 데이터팝콘(datapopcorn) · <b>트레바리 독서모임 전용 교안</b>입니다.
      무단 외부 반출·복제·재배포를 금합니다.
    </footer>
  `;

  const target = document.getElementById('sidebar');
  if (target) {
    target.innerHTML = SIDEBAR_HTML;
    const cur = location.pathname.split('/').pop().replace('.html', '') || 'index';
    const block = target.querySelector('.ch-block[data-ch="' + cur + '"]');
    if (block) block.classList.add('active');
    const navItem = target.querySelector('.top-nav-item[data-nav="' + cur + '"]');
    if (navItem) navItem.classList.add('active');
    target.querySelectorAll('.ch-nav a').forEach(a => {
      const href = a.getAttribute('href');
      const currentPage = location.pathname.split('/').pop() || 'index.html';
      if (href === currentPage) {
        a.classList.add('current');
      }
    });
    const activeItem = target.querySelector('.ch-block.active, .top-nav-item.active');
    if (activeItem) {
      requestAnimationFrame(() => {
        const top = activeItem.offsetTop - target.clientHeight * 0.45 + activeItem.clientHeight / 2;
        target.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
      });
    }
  }

  const main = document.querySelector('.main');
  if (main && !main.querySelector('.page-footer')) {
    main.insertAdjacentHTML('beforeend', FOOTER_HTML);
  }

  // 발제문 PDF 다운로드 버튼 동적 추가
  const baljeContainer = document.querySelector('.trevari-doc .td-header') || Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.includes('클럽장 발제문') || h2.textContent.includes('발제문'));

  if (baljeContainer) {
    if (baljeContainer.tagName === 'H2') {
      baljeContainer.style.display = 'flex';
      baljeContainer.style.justifyContent = 'space-between';
      baljeContainer.style.alignItems = 'center';
    }
    
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<span class="ico">🖨</span> 발제문 PDF 다운로드';
    printBtn.style.cssText = 'font-size: 13px; font-weight: 600; padding: 6px 12px; background: var(--bg-soft); border: 1px solid var(--border); color: var(--text); border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 4px; margin-left: 16px; margin-bottom: 4px;';
    
    printBtn.onmouseover = () => { printBtn.style.background = 'var(--bg-elev)'; };
    printBtn.onmouseout = () => { printBtn.style.background = 'var(--bg-soft)'; };
    
    printBtn.onclick = () => {
      const container = baljeContainer.closest('.summary') || baljeContainer.parentElement;
      const clone = container.cloneNode(true);
      const btnInClone = clone.querySelector('button');
      if (btnInClone) btnInClone.remove(); // 출력물에서 버튼 제거
      
      const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>클럽장 발제문</title>
  <style>
    :root {
      --text: #111;
      --text-soft: #333;
      --text-muted: #555;
      --border: #ddd;
      --border-strong: #999;
      --bg-elev: #fff;
      --bg-soft: #f4f4f5;
      --accent-strong: #ea580c;
      --accent-bg: #fff7ed;
      --shadow-sm: none;
    }
    @page { margin: 10mm; size: A4 portrait; }
    body { font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; line-height: 1.35; padding: 0; color: var(--text); max-width: 100%; margin: 0; font-size: 11px; background: white; }
    
    /* 여백 꾹꾹 눌러담기: 새 발제문 양식(.trevari-doc) 전용 오버라이드 */
    .trevari-doc { padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important; }
    .td-header { padding: 10px 0 !important; margin-bottom: 16px !important; border-top-width: 3px !important; }
    .td-title { font-size: 20px !important; }
    .td-date { font-size: 12px !important; }
    
    .td-grid { grid-template-columns: 80px 1fr !important; column-gap: 16px !important; }
    .td-label { font-size: 13px !important; padding: 8px 0 !important; }
    .td-value { font-size: 13px !important; padding: 8px 0 !important; }
    
    .td-time-grid { column-gap: 16px !important; }
    .td-time-item { padding: 4px 0 !important; font-size: 12px !important; }
    
    .td-main-label { font-size: 14px !important; padding: 12px 0 !important; }
    .td-main-content { padding: 12px 0 !important; }
    .td-main-content h3 { font-size: 16px !important; margin: 0 0 12px 0 !important; }
    .td-question { font-size: 11.5px !important; margin-bottom: 14px !important; line-height: 1.4 !important; }
    .td-question strong { margin-bottom: 4px !important; font-size: 12px !important; }
    
    .td-accent { display: none !important; }
  </style>
</head>
<body>
  ${clone.innerHTML}
  <div style="margin-top: 16px; text-align: center; color: #888; font-size: 9px; border-top: 1px solid #ddd; padding-top: 8px;">
    ⓒ 데이터팝콘(datapopcorn) · 독서모임 전용 학습 자료입니다. 무단 외부 반출·복제·재배포를 금합니다.
  </div>
  <script>setTimeout(() => { window.print(); }, 500);</script>
</body>
</html>`;
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (!win) alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
    };
    
    baljeContainer.appendChild(printBtn);
  }
})();
