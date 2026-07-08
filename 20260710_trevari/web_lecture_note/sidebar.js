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
      <div class="dl-caption">전체 강의 자료 저장</div>
      <div class="dl-row">
        <button class="dl-btn" id="dl-all-html" type="button" title="HTML 문서로 저장">
          <span class="ico">⬇</span> HTML
        </button>
        <button class="dl-btn" id="dl-all-pdf" type="button" title="PDF로 인쇄/저장">
          <span class="ico">🖨</span> PDF
        </button>
        <button class="dl-btn" id="dl-all-md" type="button" title="마크다운 텍스트로 저장">
          <span class="ico">📝</span> MD
        </button>
      </div>
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

  function collectPages() {
    const seen = new Set(['index.html']);
    const chapters = [];
    const aux = [];
    document.querySelectorAll('.top-nav a[data-nav][href$=".html"]').forEach(a => {
      const url = a.getAttribute('href');
      if (!url || seen.has(url)) return;
      seen.add(url);
      aux.push(url);
    });
    document.querySelectorAll('.ch-nav a[href$=".html"]').forEach(a => {
      const url = a.getAttribute('href');
      if (!url || seen.has(url)) return;
      seen.add(url);
      const block = a.closest('.ch-block');
      const ch = block ? block.getAttribute('data-ch') : '';
      (ch === 'index' || ch === 'resources') ? aux.push(url) : chapters.push(url);
    });
    return ['index.html'].concat(chapters, aux);
  }

  function buildCombinedMarkdown(onProgress) {
    return new Promise(async (resolve) => {
      const urls = collectPages();
      const parser = new DOMParser();
      let combinedMd = '# 내 일에 바로 써먹는 AI 자동화 - 전체 교안\n\n';

      function parseNode(node, pageUrl) {
        if (node.nodeType === 3) {
          return node.textContent.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ');
        }
        if (node.nodeType !== 1) return '';
        const tag = node.tagName.toLowerCase();
        
        if (tag === 'script' || tag === 'style' || tag === 'nav' || tag === 'button' || node.classList.contains('page-footer') || node.classList.contains('chapter-tag')) return '';
        
        let inner = '';
        for (const child of Array.from(node.childNodes)) {
          inner += parseNode(child, pageUrl);
        }
        
        if (tag === 'h1') return '\n\n# ' + inner.trim() + '\n\n';
        if (tag === 'h2') return '\n\n## ' + inner.trim() + '\n\n';
        if (tag === 'h3') return '\n\n### ' + inner.trim() + '\n\n';
        if (tag === 'h4') return '\n\n#### ' + inner.trim() + '\n\n';
        if (tag === 'p') return '\n\n' + inner.trim() + '\n\n';
        if (tag === 'li') return '\n- ' + inner.trim();
        if (tag === 'ul' || tag === 'ol') return '\n' + inner + '\n';
        if (tag === 'strong' || tag === 'b') return '**' + inner.trim() + '**';
        if (tag === 'em' || tag === 'i') return '*' + inner.trim() + '*';
        if (tag === 'a') {
          let href = node.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('http')) {
            href = new URL(href, pageUrl).href;
          }
          if (href) return '[' + inner.trim() + '](' + href + ')';
          return inner;
        }
        if (tag === 'img') {
          let src = node.getAttribute('src');
          if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            src = new URL(src, pageUrl).href;
          }
          const alt = node.getAttribute('alt') || 'image';
          return '\n![' + alt + '](' + src + ')\n';
        }
        if (tag === 'br') return '\n';
        if (tag === 'hr') return '\n\n---\n\n';
        
        if (tag === 'div' || tag === 'section' || tag === 'article' || tag === 'main') {
          return '\n' + inner + '\n';
        }
        
        return inner;
      }

      for (let i = 0; i < urls.length; i += 1) {
        if (onProgress) onProgress(i + 1, urls.length);
        try {
          const pageUrl = new URL(urls[i], location.href).href;
          const html = await (await fetch(urls[i])).text();
          const doc = parser.parseFromString(html, 'text/html');
          const main = doc.querySelector('.main');
          if (main) {
            main.querySelectorAll('.next-cta').forEach(el => el.remove());
            let pageMd = parseNode(main, pageUrl);
            pageMd = pageMd.replace(/\n{3,}/g, '\n\n').trim();
            combinedMd += pageMd + '\n\n---\n\n';
          }
        } catch (e) {
          console.error('Failed to fetch', urls[i], e);
        }
      }
      
      resolve(combinedMd);
    });
  }

  async function getMarkedHtml(md) {
    if (typeof window.marked === 'undefined') {
      await new Promise(r => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        s.onload = r;
        document.head.appendChild(s);
      });
    }
    return window.marked.parse(md);
  }

  async function buildBeautifiedHtml(onProgress, isPrint = false) {
    const md = await buildCombinedMarkdown(onProgress);
    const bodyHtml = await getMarkedHtml(md);
    
    const printScript = isPrint ? "<script>setTimeout(() => { window.print(); }, 1000);</script>" : "";

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>내 일에 바로 써먹는 AI 자동화 - 전체 교안</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown.min.css">
  <style>
    body { box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; padding: 45px; }
    @media (max-width: 767px) { body { padding: 15px; } }
    @media print { body { padding: 0; max-width: none; } }
  </style>
</head>
<body class="markdown-body">
  ${bodyHtml}
  <div style="margin-top: 50px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eaecef; padding-top: 20px;">
    ⓒ 데이터팝콘(datapopcorn) · 독서모임 전용 학습 자료입니다. 무단 외부 반출·복제·재배포를 금합니다.
  </div>
  ${printScript}
</body>
</html>`;
  }

  function withBusy(button, fn) {
    return async function () {
      const label = button.innerHTML;
      button.disabled = true;
      try {
        await fn(progress => { button.innerHTML = '<span class="ico">⏳</span> ' + progress; });
      } catch (e) {
        alert('자료를 모으는 중 문제가 발생했습니다: ' + e.message);
      } finally {
        button.innerHTML = label;
        button.disabled = false;
      }
    };
  }

  const downloadMarkdown = async progress => {
    const output = await buildCombinedMarkdown((i, n) => progress(i + '/' + n));
    const blob = new Blob([output], { type: 'text/markdown;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'trevari_ai_automation_notes.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  
  const downloadHtml = async progress => {
    const output = await buildBeautifiedHtml((i, n) => progress(i + '/' + n));
    const blob = new Blob([output], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'trevari_ai_automation_notes.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const printPdf = async progress => {
    const output = await buildBeautifiedHtml((i, n) => progress(i + '/' + n), true);
    const blob = new Blob([output], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (!printWindow) {
      alert('팝업이 차단되어 PDF 인쇄 창을 열 수 없습니다. HTML로 저장한 뒤 인쇄해주세요.');
      downloadHtml(progress);
    }
  };

  const htmlButton = document.getElementById('dl-all-html');
  if (htmlButton) htmlButton.addEventListener('click', withBusy(htmlButton, downloadHtml));

  const pdfButton = document.getElementById('dl-all-pdf');
  if (pdfButton) pdfButton.addEventListener('click', withBusy(pdfButton, printPdf));

  const mdButton = document.getElementById('dl-all-md');
  if (mdButton) mdButton.addEventListener('click', withBusy(mdButton, downloadMarkdown));
})();
