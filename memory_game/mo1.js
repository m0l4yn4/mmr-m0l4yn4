const gameBoard = document.getElementById('gameBoard');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');
const gamePopup = document.getElementById('gamePopup');
const closeBtn = document.getElementById('closeBtn');
const card = document.getElementById('myCard');
const timerEl = document.getElementById('timer');
const movesEl = document.getElementById('moves');
const bestEl = document.getElementById('bestScore');
const bestMel = document.getElementById('bestMoves') 


const cardsArray = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥝'];
let cards = [...cardsArray, ...cardsArray];

let flippedCards = [];
let matchedCards = [];

let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

let bestScore = localStorage.getItem('bestScore');
if (bestScore) {
    bestEl.textContent = bestScore + 's';
}

let bestMoves = localStorage.getItem('bestMoves');
if (bestMoves) {
    bestMel.textContent = bestMoves + 'ເທື່ອ';
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i-- ) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function startTimer() {
    if (gameStarted) return;
    gameStarted = true;

    timerInterval = setInterval(() => {
        timer++;
        timerEl.textContent = timer;
    },1000)
}

function createBoard() {
    gameBoard.innerHTML = "";
    cards = shuffle(cards);
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = emoji;
        
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = '❓';
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        gameBoard.appendChild(card);

        card.addEventListener('click', flipCard);
    });
}

    // function ປີ້ນ card 

function flipCard(e) {
    const card = e.currentTarget;

    startTimer();
    
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            movesEl.textContent = moves; 
            checkMatch();
        }
    }
}

    // function ກວດສອບຄູ່

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        matchedCards.push(card1, card2);
        flippedCards = [];
        checkWin();
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 800);
    }
}

function checkWin() {
    if (matchedCards.length === cards.length) {
        clearInterval(timerInterval);

        setTimeout(() => {
            gamePopup.style.display = 'block';
            
            if(!bestScore || !bestMoves) {
                localStorage.setItem('bestScore', timer);
                bestEl.textContent = timer + 's';
                localStorage.setItem('bestMoves', moves);
                bestMel.textContent = moves + 'ເທື່ອ';
            }
        }, 300);
    }
}

startBtn.addEventListener('click', () => {
    startBtn.classList.add('hidden')
    restartBtn.classList.remove('hidden');
    createBoard();
});

restartBtn.addEventListener('click', () => {
    resetGame();
});

function resetGame() {
    flippedCards = [];
    matchedCards = [];
    moves = 0;
    timer = 0;
    gameStarted = false;

    clearInterval(timerInterval);

    timerEl.textContent = 0;
    movesEl.textContent = 0;
    
    createBoard();
};

closeBtn.addEventListener('click', () => {
    gamePopup.style.display = 'none';
    resetGame();
});
