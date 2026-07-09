
      document.addEventListener('DOMContentLoaded', () => {
        fetch('data.json')
          .then(response => response.json())
          .then(data => {
            window.clubMembers = data.members;
            window.clubData = data;
            
            const totalMembers = data.members.length;
            let submittedCount = 0;
            if (data.reviews && data.reviews["2026-07-10"]) {
              submittedCount = Object.keys(data.reviews["2026-07-10"]).length;
            }
            const rate = Math.round((submittedCount / totalMembers) * 100);
            
            const statsContainer = document.getElementById('stats-container');
            if (statsContainer) {
              statsContainer.innerHTML = `🙋‍♂️ 참여 인원: 총 ${totalMembers}명 <span style="font-size: 12px; font-weight: 500; color: var(--text-muted);">(시작 전 최종 확정 예정)</span> <span style="margin-left: 8px; padding: 4px 10px; border-radius: 6px; background: var(--accent-strong); color: white; font-size: 13.5px; box-shadow: var(--shadow-sm);">📝 1회차 독후감 제출율: ${rate}% (${submittedCount}/${totalMembers}명)</span>`;
            }

            renderGraph(data);
          })
          .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('grass-graph').innerHTML += '<p style="color: #ef4444;">데이터를 불러오지 못했습니다.</p>';
          });
      });

      function renderGraph(data) {
        const container = document.getElementById('grass-graph');
        const members = data.members.sort((a, b) => a.localeCompare(b, 'ko'));
        const sessions = data.sessions;
        const records = data.records;
        
        const matrix = document.createElement('div');
        matrix.className = 'matrix';
        
        const headerRow = document.createElement('div');
        headerRow.className = 'matrix-header';
        sessions.forEach(sess => {
          const label = document.createElement('div');
          label.className = 'event-label';
          label.textContent = sess.label;
          headerRow.appendChild(label);
        });
        matrix.appendChild(headerRow);
        
        const guests = data.guests || [];
        
        members.forEach(member => {
          const row = document.createElement('div');
          row.className = 'matrix-row';
          
          const nameEl = document.createElement('div');
          nameEl.className = 'member-name';
          if (guests.includes(member)) {
            nameEl.innerHTML = `${member} <span style="font-size: 11px; font-weight: 500; color: var(--accent-strong);">(놀러가기)</span>`;
          } else {
            nameEl.textContent = member;
          }
          row.appendChild(nameEl);
          
          const boxesEl = document.createElement('div');
          boxesEl.className = 'event-boxes';
          
          sessions.forEach(sess => {
            const att = records[member]?.[`${sess.id}_attendance`] || false;
            const rev = records[member]?.[`${sess.id}_review`] || false;
            
            const box = document.createElement('div');
            box.className = 'event-box split-box';
            
            box.style.setProperty('--color-top-left', att ? '#40c463' : '#ebedf0');
            box.style.setProperty('--color-bottom-right', rev ? '#40c463' : '#ebedf0');
            
            box.dataset.tooltip = `${member} - ${sess.label} (출석: ${att ? 'O' : 'X'}, 독후감: ${rev ? 'O' : 'X'})`;
            
            if (rev && data.reviews && data.reviews[sess.id] && data.reviews[sess.id][member]) {
              box.style.cursor = 'pointer';
              box.onclick = () => {
                const reviewData = data.reviews[sess.id][member];
                document.getElementById('modal-member-name').textContent = `${member} 님의 ${sess.label} 독후감`;
                document.getElementById('modal-review-title').textContent = reviewData.title;
                document.getElementById('modal-review-content').textContent = reviewData.content;
                
                const worksheetKey = `worksheet_${sess.id}_${member}`;
                const speechKey = `speech_${sess.id}_${member}`;
                
                const textarea = document.getElementById('modal-worksheet-input');
                textarea.value = localStorage.getItem(worksheetKey) || '';
                
                const speechTextarea = document.getElementById('modal-speech-input');
                speechTextarea.value = localStorage.getItem(speechKey) || '';
                
                const saveBtn = document.getElementById('modal-worksheet-save-btn');
                saveBtn.onclick = () => {
                  localStorage.setItem(worksheetKey, textarea.value);
                  localStorage.setItem(speechKey, speechTextarea.value);
                  const originalText = "모두 저장하기";
                  saveBtn.textContent = '✅ 저장되었습니다';
                  saveBtn.style.background = '#10b981';
                  setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.style.background = 'var(--accent-strong)';
                  }, 2000);
                };

                document.getElementById('review-modal').style.display = 'flex';
              };
            }
            
            boxesEl.appendChild(box);
          });
          
          row.appendChild(boxesEl);
          matrix.appendChild(row);
        });
        
        container.appendChild(matrix);
      }
      
      // Random Picker
      let pickerInterval;
      function pickRandomMember() {
        const members = window.clubMembers || [];
        if (members.length === 0) return;
        
        const display = document.getElementById('picker-result');
        const btn = document.querySelector('.picker-card .action-btn');
        btn.disabled = true;
        
        let ticks = 0;
        clearInterval(pickerInterval);
        display.style.color = 'var(--text)';
        
        pickerInterval = setInterval(() => {
          const randomName = members[Math.floor(Math.random() * members.length)];
          display.textContent = randomName;
          display.style.transform = 'scale(1.05)';
          setTimeout(() => display.style.transform = 'scale(1)', 50);
          
          ticks++;
          if (ticks > 25) {
            clearInterval(pickerInterval);
            const winner = members[Math.floor(Math.random() * members.length)];
            display.textContent = `🎉 ${winner} 🎉`;
            display.style.color = 'var(--accent-strong)';
            display.style.transform = 'scale(1.15)';
            setTimeout(() => display.style.transform = 'scale(1)', 300);
            btn.disabled = false;
          }
        }, 50);
      }

      // Timer
      let timerInterval;
      window.timeLeft = 180; let timeLeft = 180;
      let timerRunning = false;
      window.totalTime = 180; let totalTime = 180;

      function updateTimerDisplay() {
        const display = document.getElementById('timer-display');
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        display.textContent = `${m}:${s}`;
        
        if (timeLeft === 0) {
          display.style.color = '#ef4444';
        } else if (timeLeft <= 30) {
          display.style.color = '#eab308';
        } else {
          display.style.color = 'var(--text)';
        }
      }

      function setTimer(seconds) {
        clearInterval(timerInterval);
        timerRunning = false;
        timeLeft = seconds; window.timeLeft = seconds;
        totalTime = seconds; window.totalTime = seconds;
        document.getElementById('timer-toggle-btn').textContent = '시작';
        updateTimerDisplay();
      }

      function toggleTimer() {
        const btn = document.getElementById('timer-toggle-btn');
        if (timerRunning) {
          clearInterval(timerInterval);
          timerRunning = false;
          btn.textContent = '계속';
        } else {
          if (timeLeft === 0) setTimer(totalTime);
          timerRunning = true;
          btn.textContent = '일시정지';
          timerInterval = setInterval(() => {
            timeLeft--; window.timeLeft = timeLeft;
            updateTimerDisplay();
            if (timeLeft <= 0) {
              clearInterval(timerInterval);
              timerRunning = false;
              btn.textContent = '종료';
            }
          }, 1000);
        }
      }

      function resetTimer() {
        setTimer(totalTime);
      }
      
      // AI Notes & n8n
      document.addEventListener('DOMContentLoaded', () => {
        const savedUrl = localStorage.getItem('n8nWebhookUrl');
        if (savedUrl) {
          document.getElementById('n8n-webhook-url').value = savedUrl;
        }
      });

      async function summarizeWithN8n() {
        const urlInput = document.getElementById('n8n-webhook-url');
        const rawText = document.getElementById('raw-notes').value;
        const resultBox = document.getElementById('ai-summary-result');
        
        const url = urlInput.value.trim();
        if (url) localStorage.setItem('n8nWebhookUrl', url);
        
        if (!url) {
          alert("n8n Webhook URL을 입력해주세요. (실습에서 만든 워크플로우 URL)");
          urlInput.focus();
          return;
        }
        if (!rawText.trim()) {
          alert("요약할 원본 발언을 입력해주세요.");
          document.getElementById('raw-notes').focus();
          return;
        }
        
        resultBox.innerHTML = '<span style="color: var(--accent-strong);">n8n 워크플로우로 데이터를 전송 중입니다... ⏳</span>';
        
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: rawText })
          });
          
          if (response.ok) {
            const data = await response.json();
            resultBox.textContent = data.summary || data.text || JSON.stringify(data, null, 2);
          } else {
            throw new Error(`HTTP Error: ${response.status}`);
          }
        } catch (err) {
          resultBox.innerHTML = `
            <span style="color: #ef4444;">웹훅 호출 실패! (CORS 에러이거나 URL이 잘못되었습니다)</span>
            <br><br>
            <small style="color: var(--text-muted);">※ n8n 웹훅 노드 설정에서 'Respond to Webhook' 옵션과 CORS 설정을 확인하세요.<br>※ 현재는 데모용 가짜 요약 결과를 출력합니다.</small>
            <br><br>
            <strong>[데모 요약 결과]</strong><br>
            - 오늘 모임의 주요 안건: 업무 자동화의 필요성과 n8n 실습<br>
            - 다수결 의견: 생각보다 API 연동이 까다롭지만 효과적임<br>
            - <strong>Next Action:</strong> 다음 주까지 각자 API Key 1개씩 발급해오기
          `;
        }
      }

      function copySummary() {
        const text = document.getElementById('ai-summary-result').innerText;
        navigator.clipboard.writeText(text).then(() => {
          alert("요약 결과가 복사되었습니다!");
        });
      }
      
      function saveToPickedMember() {
        if (!window.currentPickedMember) {
          alert("먼저 발표자를 추첨해주세요!");
          return;
        }
        const sessionSelect = document.getElementById('picker-session-select');
        const sessionId = sessionSelect.value;
        const textNode = document.getElementById('raw-notes');
        const text = textNode.value.trim();
        
        if (!text) {
          alert("저장할 발언 내용이 없습니다.");
          return;
        }
        
        const speechKey = `speech_${sessionId}_${window.currentPickedMember}`;
        const existing = localStorage.getItem(speechKey) || "";
        const combined = existing ? existing + "\n\n---\n" + text : text;
        
        localStorage.setItem(speechKey, combined);
        alert(`${window.currentPickedMember} 님의 현장 발언 스크립트에 추가되었습니다!\n\n(해당 멤버의 독후감 팝업에서 확인 가능합니다)`);
        textNode.value = ''; // clear
      }

      // Web Speech API (Local Dictation on Mac)
      let recognition;
      let isRecording = false;

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'ko-KR';

        recognition.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            }
          }
          if (finalTranscript) {
            const rawNotes = document.getElementById('raw-notes');
            rawNotes.value += finalTranscript;
            rawNotes.scrollTop = rawNotes.scrollHeight;
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error);
        };
      }

      function toggleMic() {
        if (!recognition) {
          alert("현재 브라우저에서는 실시간 음성 인식을 지원하지 않습니다. (Chrome 또는 Safari 권장)");
          return;
        }
        const btn = document.getElementById('mic-btn');
        if (isRecording) {
          recognition.stop();
          isRecording = false;
          btn.innerHTML = '🎤 마이크 켜기';
          btn.classList.remove('danger');
          btn.classList.add('outline');
        } else {
          recognition.start();
          isRecording = true;
          btn.innerHTML = '🛑 녹음 중지...';
          btn.classList.remove('outline');
          btn.classList.add('danger');
          document.getElementById('raw-notes').placeholder = '맥북 로컬 엔진이 음성을 듣고 실시간으로 타이핑하고 있습니다...';
        }
      }

      // Local Ollama Summary
      async function summarizeWithOllama() {
        const rawText = document.getElementById('raw-notes').value;
        const resultBox = document.getElementById('ai-summary-result');
        
        if (!rawText.trim()) {
          alert("요약할 원본 발언을 먼저 입력하거나 마이크로 녹음해주세요.");
          return;
        }
        
        resultBox.innerHTML = '<span style="color: var(--accent-strong);">🦙 로컬 Ollama 모델(Llama 3 등)로 요약 중입니다... ⏳</span><br><br><small style="color: var(--text-muted);">※ 맥북에 Ollama가 설치되어 실행 중이어야 합니다. (기본 포트: 11434)</small>';
        
        try {
          const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'llama3', // Ollama에 설치된 모델 이름으로 변경 가능 (예: llama3, mistral)
              prompt: `다음 회의 발언 내용을 세 줄로 핵심만 명확하게 요약해 줘. 무조건 한국어로 답변해.\n\n발언 내용:\n${rawText}`,
              stream: false
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            resultBox.innerHTML = `<strong>[Ollama 로컬 요약]</strong><br><br>${data.response.replace(/\\n/g, '<br>')}`;
          } else {
            throw new Error(`HTTP Error: ${response.status}`);
          }
        } catch (err) {
          console.error(err);
          resultBox.innerHTML = `
            <span style="color: #ef4444;">Ollama 연결 실패!</span>
            <br><br>
            <small style="color: var(--text-muted);">
            ※ 이유: 로컬 맥북에 Ollama가 켜져 있지 않거나, 모델('llama3')이 설치되어 있지 않습니다.<br>
            ※ 실행 방법: 터미널에서 <code>ollama run llama3</code> 입력 후 다시 시도해 보세요.
            </small>
            <br><br>
            <strong>[데모 요약 결과]</strong><br>
            - 업무 자동화는 필수불가결한 요소임.<br>
            - n8n과 로컬 AI를 결합하면 보안과 비용 모두 잡을 수 있음.<br>
            - <strong>Next Action:</strong> Ollama 설치 및 llama3 모델 다운로드해 오기
          `;
        }
      }

      // Feature 1: AI Brainstormer Logic
      async function solveWithOllama() {
        const input = document.getElementById('solver-input').value;
        const resultBox = document.getElementById('solver-result');
        
        if (!input.trim()) {
          alert("귀찮은 업무를 먼저 입력해주세요!");
          document.getElementById('solver-input').focus();
          return;
        }
        
        resultBox.innerHTML = '<span style="color: var(--accent-strong);">🦙 Ollama가 최적의 n8n 파이프라인을 설계하고 있습니다... ⏳</span>';
        
        try {
          const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'llama3',
              prompt: `너는 최고의 업무 자동화(n8n) 전문가야. 다음 사용자의 귀찮은 반복 업무를 보고, 어떻게 n8n이나 Zapier로 자동화할 수 있을지 '트리거(시작)', '처리(AI/필터 등)', '출력(최종 동작)' 3단계로 나누어 명확하게 아키텍처 설계도를 짜줘. 무조건 한국어로 친절하게 대답해.\n\n사용자 업무: ${input}`,
              stream: false
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            resultBox.innerHTML = `<strong>[n8n 자동화 아키텍처 제안]</strong><br><br>${data.response.replace(/\\n/g, '<br>')}`;
          } else {
            throw new Error(`HTTP Error: ${response.status}`);
          }
        } catch (err) {
          resultBox.innerHTML = `
            <span style="color: #ef4444;">Ollama 연결 실패! (데모 설계도를 보여줍니다)</span>
            <br><br>
            <strong>[n8n 자동화 아키텍처 제안 (데모)]</strong><br><br>
            ⚡ <strong>트리거:</strong> Slack (지정된 채널에 새로운 메시지 감지)<br>
            🧠 <strong>처리:</strong> OpenAI (메시지 내용에서 업무 내용만 추출 및 요약)<br>
            ✅ <strong>출력:</strong> Google Sheets / Notion (추출된 데이터를 새로운 행으로 적재)
            <br><br>
            <small style="color: var(--text-muted);">이러면 매일 복붙하는 시간을 0으로 만들 수 있어요! 🎉</small>
          `;
        }
      }
    