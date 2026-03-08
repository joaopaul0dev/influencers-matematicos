  let levels = ['easy', 'medium', 'hard'];
        let levelNames = { easy: 'Nivel Fácil', medium: 'Nivel Intermediário', hard: 'Mestre do Universo' };

        function generateRandomPercentageQuestion(min, max, level) {
            let base, percent, answer;
            if (level === 'easy') {
                base = Math.floor(Math.random() * (max - min + 1)) + min;
                base = base % 5 === 0 ? base : base + (5 - base % 5);
                percent = [5, 10, 15, 20][Math.floor(Math.random() * 4)]; // Fewer and smaller percents for easier
            } else if (level === 'medium') {
                base = Math.floor(Math.random() * (max - min + 1)) + min;
                percent = [10, 15, 20, 25, 30][Math.floor(Math.random() * 5)]; // Adjusted for easier
            } else {
                base = Math.floor(Math.random() * (max - min + 1)) + min;
                percent = [15, 20, 25, 30, 35, 40][Math.floor(Math.random() * 6)]; // Adjusted for easier
            }
            answer = (percent / 100) * base; // Remove rounding to allow decimals
            answer = answer.toFixed(1).replace('.', ','); // Format with comma
            return { q: `Quantos são ${percent}% de ${base}?`, a: `${answer}` };
        }

        let currentLevelIndex = 0;
        let questionPool = [];
        let currentQuestion = 0;
        let likes = 0;
        let timer;
        let timeLeft = 40;
        let streak = 0;

        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function startGame(level) {
            currentLevelIndex = levels.indexOf(level);
            likes = 0;
            streak = 0;
            document.getElementById('intro').style.display = 'none';
            document.getElementById('playArea').style.display = 'block';
            loadLevel();
        }

        function loadLevel() {
            let level = levels[currentLevelIndex];
            alert(`🆕 Iniciando: ${levelNames[level]}`);
            let min = level === 'easy' ? 50 : level === 'medium' ? 100 : 200; // Smaller bases for easier
            let max = level === 'easy' ? 200 : level === 'medium' ? 500 : 1000; // Smaller ranges
            questionPool = shuffle(Array.from({ length: 5 }, () => generateRandomPercentageQuestion(min, max, level)));
            currentQuestion = 0;
            nextQuestion();
        }

        function nextQuestion() {
            if (currentQuestion >= questionPool.length) {
                currentLevelIndex++;
                if (currentLevelIndex < levels.length) {
                    setTimeout(loadLevel, 500);
                } else {
                    endGame();
                }
                return;
            }

            let q = questionPool[currentQuestion];
            document.getElementById('question').innerHTML = `<h2>${q.q}</h2>`;
            document.getElementById('message').innerHTML = "";
            document.getElementById('options').innerHTML = `
                <input type="text" id="answer" placeholder="Digite sua resposta">
                <br>
                <button onclick="checkAnswer()">Responder</button>
            `;
            timeLeft = 40;
            document.getElementById('timer').innerHTML = `⏰ ${timeLeft}s`;
            clearInterval(timer);
            timer = setInterval(countdown, 1000);
        }

        function countdown() {
            timeLeft--;
            document.getElementById('timer').innerHTML = `⏰ ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                loseLike("Tempo esgotado!");
            }
        }

        function checkAnswer() {
            let playerAnswer = document.getElementById('answer').value.trim();
            let correctAnswer = questionPool[currentQuestion].a;
            let playerNum = parseFloat(playerAnswer.replace(',', '.'));
            let correctNum = parseFloat(correctAnswer.replace(',', '.'));
            if (Math.abs(playerNum - correctNum) < 0.1) { // Allow small tolerance for decimals
                streak++;
                let bonus = streak > 1 ? 1000 : 0;
                let gained = 2000 + bonus;
                likes += gained;
                document.getElementById('message').innerHTML = `🎉 Acertou! Ganhou ${gained} seguidores${bonus ? " (incluindo bônus!)" : ""}`;
            } else {
                streak = 0;
                let lost = Math.floor(Math.random() * 2000) + 1000; // Random loss between 1000 and 3000
                likes -= lost;
                document.getElementById('message').innerHTML = `😢 Errou! Perdeu ${lost} seguidores.`;
            }
            document.getElementById('likes').innerHTML = `Likes: ${likes}`;
            clearInterval(timer);
            currentQuestion++;
            setTimeout(nextQuestion, 2000);
        }

        function loseLike(msg) {
            streak = 0;
            let lost = Math.floor(Math.random() * 2000) + 1000; // Random loss
            likes -= lost;
            document.getElementById('message').innerHTML = `😢 ${msg} Perdeu ${lost} seguidores.`;
            document.getElementById('likes').innerHTML = `Likes: ${likes}`;
            currentQuestion++;
            setTimeout(nextQuestion, 2000);
        }

        function endGame() {
            document.getElementById('question').innerHTML = `<h2>🏆 Você se tornou um Super Influencer da Matemática! 🏆</h2>`;
            document.getElementById('options').innerHTML = `<p>Total de seguidores conquistados: ${likes}</p><button onclick='restartGame()'>Jogar novamente</button>`;
            document.getElementById('message').innerHTML = "✨ Parabéns pela sua jornada brilhante! ✨";
            clearInterval(timer);
        }

        function restartGame() {
            document.getElementById('playArea').style.display = 'none';
            document.getElementById('intro').style.display = 'block';
        }

        function backToHome() {
            clearInterval(timer);
            document.getElementById('playArea').style.display = 'none';
            document.getElementById('intro').style.display = 'block';
        }