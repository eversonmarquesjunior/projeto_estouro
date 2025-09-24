document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('game-board');
    const remainingDisplay = document.getElementById('remaining');
    const resetButton = document.getElementById('reset');
    const prizeModal = document.getElementById('prize-modal');
    const prizeImage = document.getElementById('prize-image');
    const closeModal = document.getElementById('close-modal');
    const balloonCountSelect = document.getElementById('balloon-count');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');

    function getRandomPrizes() {
        // Lista de todas as imagens disponíveis
        const allPrizes = [
            'img/Big T Rosa.png',
            'img/Eco Tupper K-Pop 750ml.png',
            'img/Escorredor Tupperware.png',
            'img/Kit Basic Line.png',
            'img/Kit Caneca Rosa.png',
            'img/Kit da Vaquinha.png',
            'img/Kit Encanto.png',
            'img/Kit Floral.png',
            'img/Kit Jarra Prisma.png',
            'img/Kit Jeitosinhos.png',
            'img/Kit Jumbo Criativa.png',
            'img/Kit Preto e Branco.png',
            'img/Kit Tigela Criativa.png',
            'img/Kit Tigelas Aloha.png',
            'img/Kit Tigelas Clear.png',
            'img/Kit Toque Mágico.png',
            'img/Kit Views Tropical.png',
            'img/Quick Shake.png',
            'img/SuperChef.png',
            'img/Turbo Chef.png'
        ];

        // Se o número de balões for menor ou igual ao número de prêmios, distribui sem repetição
        if (totalBalloons <= allPrizes.length) {
            // Embaralha e pega os primeiros totalBalloons prêmios
            return allPrizes.sort(() => Math.random() - 0.5).slice(0, totalBalloons);
        } else {
            // Caso contrário, repete as imagens conforme necessário
            return Array(totalBalloons).fill().map((_, i) => {
                return allPrizes[i % allPrizes.length];
            }).sort(() => Math.random() - 0.5);
        }
    }

    let remainingBalloons = parseInt(balloonCountSelect.value);
    let poppedBalloons = 0;
    let totalBalloons = remainingBalloons;

    // Atualiza o jogo quando a quantidade de balões é alterada
    balloonCountSelect.addEventListener('change', function() {
        totalBalloons = parseInt(this.value);
        // Força a reinicialização completa
        gameBoard.innerHTML = '';
        initGame();
        
        // Atualiza imediatamente o contador
        remainingBalloons = totalBalloons;
        remainingDisplay.textContent = remainingBalloons;
        poppedBalloons = 0;
    });

    // Inicializa o jogo
    function initGame() {
        console.log('Iniciando jogo com', totalBalloons, 'balões');
        gameBoard.innerHTML = '';
        prizes = getRandomPrizes(); // Reembaralha os prêmios
        remainingBalloons = totalBalloons;
        poppedBalloons = 0;
        remainingDisplay.textContent = remainingBalloons;

        // Configura o grid para 10 balões por linha
        const balloonsPerRow = 10;
        const rows = Math.ceil(totalBalloons / balloonsPerRow);
        gameBoard.style.gridTemplateRows = `repeat(${rows}, auto)`;
        gameBoard.style.minHeight = `${rows * 100}px`;
        
        // Cria os balões
        for (let i = 0; i < totalBalloons; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.setProperty('--i', i);
            balloon.dataset.prize = prizes[i];
            
            // Numerar os balões sequencialmente: 1, 2, 3, ..., totalBalloons
            balloon.textContent = i + 1;
            
            // Aplica a cor do balão baseado no índice
            const colors = [
                '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE',
                '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE',
                '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40',
                '#FF6E40', '#FF3D00', '#D500F9', '#651FFF', '#3D5AFE'
            ];
            balloon.style.backgroundColor = colors[i % colors.length];
            
            balloon.addEventListener('click', function(e) {
                if (e.target.classList.contains('popped')) return;

                // Destaque inicial do balão selecionado
                e.target.classList.add('balloon-highlight');

                // Adiciona efeito de crescimento que leva ao estouro
                e.target.classList.add('prize-shake');

                // Atualiza contadores imediatamente
                poppedBalloons++;
                remainingBalloons--;
                remainingDisplay.textContent = remainingBalloons;

                // Cria marcador com X no lugar do balão após a animação
                setTimeout(() => {
                    const marker = document.createElement('div');
                    marker.className = 'balloon-marker';
                    marker.style.setProperty('--i', e.target.style.getPropertyValue('--i'));
                    marker.style.backgroundColor = getComputedStyle(e.target).backgroundColor;
                    e.target.replaceWith(marker);
                }, 800); // Tempo da animação de crescimento

                // Esconde o modal antes de mostrar novo prêmio
                prizeModal.classList.remove('active');

                // Delay para criar suspense
                setTimeout(() => {
                    // Mostra o novo prêmio com efeito de revelação
                    const prizeMessage = document.getElementById('prize-message');
                    const fileName = e.target.dataset.prize.split('/').pop().replace('.png', '');

                    // Efeito typewriter para o nome do prêmio
                    prizeMessage.innerHTML = `<span class="prize-name prize-typewriter">${fileName}</span>`;

                    // Verifica se a imagem existe antes de tentar carregar
                    prizeImage.onerror = function() {
                        this.style.display = 'none';
                    };
                    prizeImage.onload = function() {
                        this.style.display = 'block';
                        // Remove a classe para garantir que a animação seja executada novamente
                        this.classList.remove('prize-reveal');
                        // Força reflow para reiniciar a animação
                        void this.offsetWidth;
                        // Adiciona efeito de revelação à imagem
                        this.classList.add('prize-reveal');
                    };
                    prizeImage.src = e.target.dataset.prize;
                    prizeImage.alt = fileName;

                    // Força reflow antes de mostrar
                    void prizeModal.offsetWidth;

                    // Mostra o modal com novo prêmio
                    prizeModal.classList.add('active');

                }, 800); // Delay de 800ms para suspense
            });
            
            gameBoard.appendChild(balloon);
        }
    }

    // Fecha o modal
    closeModal.addEventListener('click', () => {
        prizeModal.classList.remove('active');
        
        // Remove o balão estourado
        const popped = document.querySelector('.balloon.popped');
        if (popped) {
            popped.remove();
        }
        
        // Verifica se o jogo acabou
        if (remainingBalloons === 0) {
            setTimeout(() => {
                alert('Parabéns! Você estourou todos os balões!');
            }, 500);
        }
    });

    // Mostra modal de confirmação ao reiniciar
    resetButton.addEventListener('click', () => {
        confirmModal.classList.add('active');
    });

    // Confirma reinicialização
    confirmYes.addEventListener('click', () => {
        confirmModal.classList.remove('active');
        initGame();
    });

    // Cancela reinicialização
    confirmNo.addEventListener('click', () => {
        confirmModal.classList.remove('active');
    });

    // Inicia o jogo
    initGame();
});