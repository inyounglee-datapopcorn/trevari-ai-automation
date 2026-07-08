// 공용 사이드바 + 푸터 — 한 곳만 고치면 모든 페이지에 반영됨.
// 트레바리 독서모임: 내 일에 바로 써먹는 AI 자동화
(function () {
  const SIDEBAR_HTML = `
    <a class="brand" href="index.html">
      <span class="brand-title">내 일에 쓰는 AI 자동화</span>
    </a>

    <div class="top-nav">
      <a class="top-nav-item" data-nav="resources" href="resources.html">
        <span class="ico">🛠️</span> 모임 참고자료
      </a>
      <div class="dl-caption">전체 강의 자료 저장</div>
      <div class="dl-row">
        <button class="dl-btn" id="dl-all-html" type="button" title="전체 강의 자료를 HTML 파일로 저장">
          <span class="ico">⬇</span> HTML
        </button>
        <button class="dl-btn" id="dl-all-pdf" type="button" title="전체 강의 자료를 PDF로 저장">
          <span class="ico">🖨</span> PDF
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

  function collectCss() {
    let css = '';
    for (const sheet of Array.from(document.styleSheets)) {
      const href = sheet.href || '';
      const path = href ? new URL(href, location.href).pathname : '';
      if (href && !path.endsWith('/styles.css') && !path.endsWith('/sidebar.css')) continue;
      try {
        css += '\n' + Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
      } catch (e) {}
    }
    return css;
  }

  function scopeCss(cssText, scope) {
    const style = document.createElement('style');
    style.textContent = cssText;
    document.head.appendChild(style);
    const out = [];
    const walk = rules => {
      for (const rule of Array.from(rules)) {
        if (rule.selectorText) {
          out.push(rule.selectorText.split(',').map(selector => scope + ' ' + selector.trim()).join(', ') + '{' + rule.style.cssText + '}');
        } else if (rule.media && rule.cssRules) {
          out.push('@media ' + rule.media.mediaText + '{');
          walk(rule.cssRules);
          out.push('}');
        } else {
          out.push(rule.cssText);
        }
      }
    };
    try { walk(style.sheet.cssRules); } catch (e) {}
    document.head.removeChild(style);
    return out.join('\n');
  }

  async function imgToDataUrl(url) {
    try {
      const blob = await (await fetch(url)).blob();
      return await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  }

  async function buildCombinedHtml(onProgress, options) {
    const opts = options || {};
    const urls = collectPages();
    const parser = new DOMParser();
    const container = document.createElement('div');
    const urlToId = {};
    let pageStyles = '';

    for (let i = 0; i < urls.length; i += 1) {
      if (onProgress) onProgress(i + 1, urls.length);
      try {
        const pageUrl = new URL(urls[i], location.href).href;
        const html = await (await fetch(urls[i])).text();
        const doc = parser.parseFromString(html, 'text/html');
        const pageMain = doc.querySelector('.main');
        if (!pageMain) continue;
        const scope = '.dlp' + i;
        doc.querySelectorAll('style').forEach(style => {
          pageStyles += '\n' + scopeCss(style.textContent, scope);
        });
        pageMain.querySelectorAll('.page-footer, script, style').forEach(el => el.remove());
        pageMain.querySelectorAll('img[src]').forEach(img => {
          img.setAttribute('src', new URL(img.getAttribute('src'), pageUrl).href);
        });
        const section = document.createElement('section');
        section.className = 'dl-page dlp' + i + ' dl-start';
        section.id = 'dlp' + i;
        section.innerHTML = pageMain.innerHTML;
        container.appendChild(section);
        urlToId[urls[i]] = '#dlp' + i;
      } catch (e) {}
    }

    container.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (urlToId[href]) a.setAttribute('href', urlToId[href]);
    });

    const imageCache = {};
    for (const img of Array.from(container.querySelectorAll('img[src]'))) {
      const src = img.getAttribute('src');
      if (!(src in imageCache)) imageCache[src] = await imgToDataUrl(src);
      if (imageCache[src]) img.setAttribute('src', imageCache[src]);
    }

    let sidebarHtml = '';
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      const clone = sidebar.cloneNode(true);
      clone.querySelectorAll('.dl-btn, .dl-row, .dl-caption').forEach(el => el.remove());
      clone.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (urlToId[href]) a.setAttribute('href', urlToId[href]);
        else if (href === 'index.html') a.setAttribute('href', urlToId['index.html'] || '#dlp0');
        else if (!/^(#|mailto:|https?:)/.test(href)) a.setAttribute('href', '#top');
      });
      clone.querySelectorAll('.active, .current').forEach(el => el.classList.remove('active', 'current'));
      sidebarHtml = clone.innerHTML;
    }

    const title = '내 일에 바로 써먹는 AI 자동화';
    const footer =
      '<footer class="page-footer">ⓒ 데이터팝콘(datapopcorn) · 독서모임 전용 학습 자료입니다. 무단 외부 반출·복제·재배포를 금합니다.</footer>';
    const bundleScript =
      '<script>' +
      '(function(){' +
      'function show(id){var pages=[].slice.call(document.querySelectorAll(".dl-page"));var target=document.querySelector(id)||pages[0];if(!target)return;pages.forEach(function(p){p.classList.toggle("active",p===target);});document.querySelectorAll(".sidebar .active,.sidebar .current").forEach(function(el){el.classList.remove("active","current");});var link=document.querySelector(".sidebar a[href=\\"#"+target.id+"\\"]");if(link){link.classList.add("current");var block=link.closest(".ch-block");if(block)block.classList.add("active");if(link.classList.contains("top-nav-item"))link.classList.add("active");}window.scrollTo(0,0);}' +
      'window.addEventListener("hashchange",function(){show(location.hash);});' +
      'show(location.hash||"#dlp0");' +
      (opts.autoPrint ? 'setTimeout(function(){window.print();},500);' : '') +
      '})();' +
      '</scr' + 'ipt>';

    return '<!doctype html><html lang="ko"><head><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      '<title>' + title + ' · 전체 자료</title>' +
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css">' +
      '<style>' + collectCss() + '\n' + pageStyles +
      '\n.dl-page{display:none}' +
      '\n.dl-page.active{display:block}' +
      '\n.print-table{width:100%;border-collapse:collapse}' +
      '\n.print-table>tbody>tr>td,.print-table>tfoot>tr>td{padding:0}' +
      '\n.print-tfoot{display:none}' +
      '\n@page{margin:14mm 12mm}' +
      '\n@media print{.sidebar{display:none}.layout{display:block;max-width:none;margin:0}.main{max-width:none;margin:0;padding:0}' +
      '.dl-page{display:block;break-before:page}.dl-page:first-child{break-before:auto}' +
      '.main .page-footer{display:none}' +
      '.print-tfoot{display:table-footer-group}' +
      '.print-footer{text-align:center;font-size:8.5px;line-height:1.4;color:#8a8a93;padding:9mm 0 1mm}}' +
      '</style></head><body><div class="layout">' +
      '<aside class="sidebar">' + sidebarHtml + '</aside>' +
      '<main class="main">' +
      '<table class="print-table">' +
      '<tfoot class="print-tfoot"><tr><td><div class="print-footer">ⓒ 데이터팝콘(datapopcorn) · 독서모임 전용 교안 · 무단 외부 반출·복제·재배포 금지</div></td></tr></tfoot>' +
      '<tbody><tr><td>' + container.innerHTML + footer + '</td></tr></tbody>' +
      '</table>' +
      '</main>' +
      '</div>' +
      bundleScript + '</body></html>';
  }

  function withBusy(button, fn) {
    return async function () {
      const label = button.textContent;
      button.disabled = true;
      try {
        await fn(progress => { button.textContent = '⏳ ' + progress; });
      } catch (e) {
        alert('자료를 모으는 중 문제가 발생했습니다: ' + e.message);
      } finally {
        button.textContent = label;
        button.disabled = false;
      }
    };
  }

  const htmlButton = document.getElementById('dl-all-html');
  if (htmlButton) {
    htmlButton.addEventListener('click', withBusy(htmlButton, async progress => {
      const output = await buildCombinedHtml((i, n) => progress(i + '/' + n));
      const blob = new Blob([output], { type: 'text/html;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '내 일에 쓰는 AI 자동화 전체 교안.html';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }));
  }

  const pdfButton = document.getElementById('dl-all-pdf');
  if (pdfButton) {
    pdfButton.addEventListener('click', withBusy(pdfButton, async progress => {
      const printWindow = window.open('', '_blank');
      const output = await buildCombinedHtml((i, n) => progress(i + '/' + n), { autoPrint: true });
      const blob = new Blob([output], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      if (printWindow) {
        printWindow.location.href = url;
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = '내 일에 쓰는 AI 자동화 PDF용.html';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        alert('팝업이 차단되어 PDF용 HTML을 내려받았습니다. 파일을 열고 인쇄에서 PDF로 저장하세요.');
      }
    }));
  }
})();
