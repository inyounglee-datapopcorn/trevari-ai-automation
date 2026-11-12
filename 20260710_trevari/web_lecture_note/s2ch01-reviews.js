(() => {
  'use strict';
  const room = document.getElementById('review-room');
  if (!room) return;
  const grid = room.querySelector('[data-review-grid]');
  const status = room.querySelector('[data-review-result]');
  const search = room.querySelector('[data-review-search]');
  const reset = room.querySelector('[data-review-reset]');
  const present = room.querySelector('[data-review-present]');
  const topics = room.querySelector('[data-review-topics]');
  const compact = room.querySelector('[data-review-compact]');
  let wasCompact = false;
  function compactMode(on) {
    room.classList.toggle('rr-compact', on);
    compact.setAttribute('aria-pressed',String(on));
    compact.textContent = on ? '요약 함께 보기' : '키워드만 보기';
  }
  compact.addEventListener('click',()=>compactMode(!room.classList.contains('rr-compact')));
  let selected = 'all';
  let cards = [];
  let previousFocus = null;
  const text = (tag, className, value) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = value;
    return el;
  };
  const renderFilter = () => {
    const query = search.value.trim().toLocaleLowerCase('ko');
    let shown = 0;
    cards.forEach(({el, person, searchable}) => {
      const visible = (selected === 'all' || person.themes.includes(selected)) && (!query || searchable.includes(query));
      el.hidden = !visible;
      if (visible) shown++;
    });
    topics.querySelectorAll('button').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.theme === selected)));
    status.textContent = shown === cards.length ? `${cards.length}명의 독후감 모두 보기 · 가나다순` : `${cards.length}명 중 ${shown}명 보기 · 가나다순`;
    room.querySelector('[data-review-empty]').hidden = shown !== 0;
    reset.hidden = selected === 'all' && !query;
  };
  function presentation(on) {
    if (on) {previousFocus = document.activeElement; wasCompact = room.classList.contains('rr-compact'); compactMode(true);}
    else compactMode(wasCompact);
    document.body.classList.toggle('rr-presenting', on);
    present.setAttribute('aria-pressed', String(on));
    present.textContent = on ? '모임 화면 닫기 · Esc' : '모임 화면';
    if (on) room.focus({preventScroll:true});
    else if (previousFocus) previousFocus.focus({preventScroll:true});
  }
  present.addEventListener('click', () => presentation(!document.body.classList.contains('rr-presenting')));
  document.addEventListener('keydown', event => {if (event.key === 'Escape' && document.body.classList.contains('rr-presenting')) presentation(false);});
  search.addEventListener('input', renderFilter);
  reset.addEventListener('click', () => {selected = 'all'; search.value = ''; renderFilter(); search.focus();});
  fetch('data/2611-ch01-keywords.json', {cache:'no-cache'})
    .then(response => {if (!response.ok) throw new Error('Cannot load reviews'); return response.json();})
    .then(data => {
      if (!Array.isArray(data.people) || !Array.isArray(data.themes)) throw new Error('Invalid review data');
      const people = [...data.people].sort((a,b) => a.name.localeCompare(b.name,'ko'));
      const guests = people.filter(person => person.guest).length;
      room.querySelector('[data-review-total]').textContent = people.length;
      room.querySelector('[data-review-members]').textContent = `멤버 ${people.length - guests}명 · 놀러가기 ${guests}명`;
      room.querySelector('[data-review-date]').textContent = `${data.observedAt.replaceAll('-','.')} 확인`;
      room.querySelector('[data-review-source]').href = data.sourceUrl;
      const allThemes = [{id:'all',label:'전체'}, ...data.themes];
      allThemes.forEach(theme => {
        const count = theme.id === 'all' ? people.length : people.filter(person => person.themes.includes(theme.id)).length;
        const btn = text('button','rr-topic',theme.label);
        btn.type = 'button'; btn.dataset.theme = theme.id;
        btn.setAttribute('aria-pressed',String(theme.id === selected));
        btn.append(text('span','',String(count)));
        btn.addEventListener('click',()=>{selected=theme.id;renderFilter();});
        topics.append(btn);
      });
      people.forEach((person, index) => {
        const article = document.createElement('article'); article.className='rr-card'; article.setAttribute('aria-labelledby',`rr-person-${index}`);
        const head = text('div','rr-card-head','');
        const name = text('h3','',`${person.name} 님`); name.id=`rr-person-${index}`; head.append(name);
        if (person.guest) head.append(text('span','rr-guest','놀러가기'));
        const keywords = text('ul','rr-keywords',''); keywords.setAttribute('aria-label','핵심 키워드');
        person.keywords.forEach(keyword=>keywords.append(text('li','',keyword)));
        const question = document.createElement('details'); question.className='rr-question';
        question.append(text('summary','','요약 · 대화 제안'),text('p','rr-context',person.summary),text('p','',person.question));
        article.append(head, keywords, text('p','rr-summary',person.summary), question);
        grid.append(article);
        cards.push({el:article,person,searchable:[person.name,...person.keywords,person.summary,person.question].join(' ').toLocaleLowerCase('ko')});
      });
      room.querySelector('[data-review-controls]').hidden = false;
      renderFilter();
    })
    .catch(() => {status.textContent='독후감 키워드를 불러오지 못했습니다. 새로고침 후 다시 확인해 주세요.';});
})();
