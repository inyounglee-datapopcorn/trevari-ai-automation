
      window.whisperTranscriber = null;
      window.isWhisperRecording = false;
      window.whisperMediaRecorder = null;
      window.whisperAudioChunks = [];
      
      let audioCtx, analyser, source, drawVisual;
      let recognition = null;

      window.toggleWhisperMic = async function() {
        const btn = document.getElementById('whisper-mic-btn');
        const textarea = document.getElementById('raw-notes');
        const canvas = document.getElementById('audio-visualizer');
        const canvasCtx = canvas.getContext('2d');
      
        if (!window.isWhisperRecording) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            window.whisperMediaRecorder = new MediaRecorder(stream);
            window.whisperAudioChunks = [];
            
            // --- Audio Visualizer Setup ---
            canvas.style.display = 'block';
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            function draw() {
              drawVisual = requestAnimationFrame(draw);
              analyser.getByteFrequencyData(dataArray);
              canvasCtx.fillStyle = '#f4f4f5'; // var(--bg-soft)
              canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
              const barWidth = (canvas.width / bufferLength) * 2.5;
              let x = 0;
              for(let i = 0; i < bufferLength; i++) {
                let barHeight = dataArray[i] / 10;
                canvasCtx.fillStyle = '#10b981'; // var(--accent) or green
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
              }
            }
            draw();

            // --- Real-time Streaming text (Web Speech API as fallback/preview) ---
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
              recognition = new SpeechRecognition();
              recognition.continuous = true;
              recognition.interimResults = true;
              recognition.lang = 'ko-KR';
              let finalTranscript = '';
              recognition.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                  if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                  } else {
                    interimTranscript += event.results[i][0].transcript;
                  }
                }
                // Show streaming text while recording
                textarea.value = finalTranscript + interimTranscript;
              };
              try { recognition.start(); } catch(e) {}
            }
            
            // --- Audio Chunking for Whisper ---
            window.whisperMediaRecorder.ondataavailable = e => {
              if (e.data.size > 0) window.whisperAudioChunks.push(e.data);
            };
            
            window.whisperMediaRecorder.onstop = async () => {
              cancelAnimationFrame(drawVisual);
              canvas.style.display = 'none';
              stream.getTracks().forEach(track => track.stop());
              if(recognition) recognition.stop();
              
              textarea.placeholder = "🤖 Whisper 모델 구동 및 최종 변환 중... (최초 실행 시 70MB 모델을 다운받느라 약 10~30초 소요됩니다)";
              btn.innerHTML = '⏳ Whisper 변환 중...';
              btn.disabled = true;
              btn.classList.remove('danger');
              
              try {
                if (!window.whisperTranscriber) {
                   const transformers = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1');
                   transformers.env.allowLocalModels = false;
                   window.whisperTranscriber = await transformers.pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
                }
                
                const blob = new Blob(window.whisperAudioChunks, { type: 'audio/webm' });
                
                const arrayBuffer = await blob.arrayBuffer();
                const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
                const audioData = audioBuffer.getChannelData(0);
                
                // Final accurate transcription via Whisper
                const result = await window.whisperTranscriber(audioData, { language: 'korean', task: 'transcribe' });
                
                // If Whisper gives text, overwrite the preview text
                if(result.text && result.text.trim() !== '') {
                  textarea.value = result.text.trim();
                }
                textarea.placeholder = "변환이 완료되었습니다.";
              } catch (err) {
                console.error(err);
                if (textarea.value.trim() === '') {
                  textarea.value = "Whisper 변환 실패: " + err.message + " (임시 스크립트가 유지됩니다.)";
                }
              } finally {
                btn.innerHTML = '🎤 녹음 시작';
                btn.disabled = false;
                btn.classList.add('outline');
              }
            };
            
            window.whisperMediaRecorder.start();
            window.isWhisperRecording = true;
            btn.innerHTML = '🛑 녹음 완료 & 고품질 변환';
            btn.classList.remove('outline');
            btn.classList.add('danger');
            textarea.placeholder = "🔴 녹음 중입니다... (말씀을 마치면 '녹음 완료'를 눌러주세요)";
            textarea.value = '';
            
          } catch (err) {
            alert("마이크 권한을 허용해주세요!");
            console.error(err);
          }
        } else {
          window.whisperMediaRecorder.stop();
          window.isWhisperRecording = false;
        }
      };
    