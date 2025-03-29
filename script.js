document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('game-board');
    const remainingDisplay = document.getElementById('remaining');
    const resetButton = document.getElementById('reset');
    const prizeModal = document.getElementById('prize-modal');
    const prizeImage = document.getElementById('prize-image');
    const closeModal = document.getElementById('close-modal');
    const balloonCountSelect = document.getElementById('balloon-count');

    function getRandomPrizes() {
        // Lista de todas as imagens disponíveis
        const allPrizes = [
            'img/Kit Encanto.png',
            'img/Kit Jarra Prisma.png',
            'img/Kit Tigela Criativa.png',
            'img/Kit Tigelas Aloha.png',
            'img/Kit Views Tropical.png'
        ];

        // Distribui e embaralha as imagens
        return Array(50).fill().map((_, i) => {
            return allPrizes[i % allPrizes.length];
        }).sort(() => Math.random() - 0.5);
    }

    let prizes = getRandomPrizes();
    
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
                
                e.target.classList.add('popped');
                poppedBalloons++;
                remainingBalloons--;
                remainingDisplay.textContent = remainingBalloons;
                
                // Cria marcador com X no lugar do balão
                const marker = document.createElement('div');
                marker.className = 'balloon-marker';
                marker.style.setProperty('--i', e.target.style.getPropertyValue('--i'));
                
                // Substitui o balão pelo marcador após a animação
                setTimeout(() => {
                    e.target.replaceWith(marker);
                }, 300);
                
                // Esconde o modal antes de mostrar novo prêmio
                prizeModal.classList.remove('active');
                
                // Mostra o novo prêmio imediatamente
                const prizeMessage = document.getElementById('prize-message');
                const fileName = e.target.dataset.prize.split('/').pop().replace('.png', '');
                prizeMessage.innerHTML = `VOCÊ GANHOU: <span class="prize-name">${fileName}</span>`;
                
                // Verifica se a imagem existe antes de tentar carregar
                prizeImage.onerror = function() {
                    this.style.display = 'none';
                };
                prizeImage.onload = function() {
                    this.style.display = 'block';
                };
                prizeImage.src = e.target.dataset.prize;
                prizeImage.alt = fileName;
                
                // Força reflow antes de mostrar
                void prizeModal.offsetWidth;
                
                // Mostra o modal com novo prêmio
                prizeModal.classList.add('active');
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

    // Reinicia o jogo
    resetButton.addEventListener('click', initGame);

    // Inicia o jogo
    initGame();
});