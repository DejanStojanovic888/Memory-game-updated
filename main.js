const timerEl = document.querySelector('.timer span')
let level = 1;
let time = null;
let timer;
let arrElementsHalf = [];
const container = document.querySelector('.container')

let arrTwoFlipped = [];
let arrFlipped = [];
let arrElements = [];
let arrRandElements = [];
let pocetniLength = null;
let allCards = [];
startGame()

function startGame() {
    arrTwoFlipped = [];
    arrFlipped = [];
    arrElementsHalf = [];
    arrElements = [];
    arrRandElements = [];
    pocetniLength = null;
    allCards = [];
    container.innerHTML = '';
    timeUpgradeOnLevel(level)
    kreiranjeBrojaKvadrata()
    createCards(level)
    allCards = document.querySelectorAll('.card' + String(level))
    allCards.forEach(card => card.addEventListener('click', flipCard))
}

function kreiranjeBrojaKvadrata() {
    let brKvadrata = (5 + level) ** 2;
    if (brKvadrata % 2 === 0) {
        arrElementsHalf = 'qwertyuiopasdfghjklzxcvbnm123456'.slice(0, brKvadrata / 2).toUpperCase().split('')
    } else {
        arrElementsHalf = 'qwertyuiopasdfghjklzxcvbnm123456'.slice(0, Math.floor(brKvadrata / 2)).toUpperCase().split('')
    }
    arrElements = arrElementsHalf.concat(arrElementsHalf)
    pocetniLength = arrElements.length;
    createRandElements()
}

function createRandElements() {
    for (let i = arrElements.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * arrElements.length);
        arrRandElements.push(arrElements[randomIndex])
        arrElements.splice(randomIndex, 1)
    }
}

function createCards(level) {
    console.log(pocetniLength)
    for (let i = 0; i < pocetniLength; i++) {
        const newCard = document.createElement('div')
        newCard.classList.add('card'+level)

        const newBack = document.createElement('div')
        newBack.classList.add('back'+level)
        newBack.innerHTML = arrRandElements[i]

        const newFront = document.createElement('div')
        newFront.classList.add('front'+level)

        newCard.appendChild(newBack)
        newCard.appendChild(newFront)
        container.appendChild(newCard)
    }
}


function checkIfFinished() {
    console.log(arrTwoFlipped.length)
    if (arrTwoFlipped.length % 2 == 0) {
        if (arrTwoFlipped.length === pocetniLength) {
            console.log("BRAVO POBEDILI STE!")
            // const poruka = "BRAVO POBEDILI STE! \nDa li želite da pređete na sledeći nivo?";
            const poruka = level === 3 ? "BRAVO PRESLI STE IGRICU!!!" : "BRAVO POBEDILI STE!! \nDa li želite da pređete na sledeći nivo?";
            const daLiNastavljamo = confirm(poruka);
            if (daLiNastavljamo) {
                if (level === 3) {
                    clearInterval(timer)
                    return;
                }
                // KORISNIK JE KLIKNUO "OK" (vraćena je vrednost true)
                console.log("Super! Prelazimo na sledeći nivo...");
                clearInterval(timer)
                level++;
                startGame()
            } else {
                // KORISNIK JE KLIKNUO "Cancel" (vraćena je vrednost false)
                clearInterval(timer)
                console.log("Ostajemo na trenutnom nivou.");
                location.reload();
            }
        }
    } else {
        if (arrTwoFlipped.length === pocetniLength - 1) {
            console.log("BRAVO POBEDILI STE!")
            levelUpgrade()
        }
    }
}

//  LEVEL APPLIED
function timeUpgradeOnLevel(level) {
    if (level === 1) {
        time = 150;
        timerSet()
    } else if (level === 2) {
        time = 200
        timerSet()
    } else if (level === 3) {
        time = 250
        timerSet()
    }
}

function timerSet() {
    timerEl.innerText = time;
    timer = setInterval(() => {
        time--;
        if (timerEl.innerText === '0') {
            stopAllClicks()
            const poruka = "Vreme je isteklo! \nDa li želite da igrate ponovo?";
            const daLiNastavljamo = confirm(poruka);
            if (daLiNastavljamo) {
                clearInterval(timer)
                startGame()
            } else {
                stopAllClicks()
                clearInterval(timer)
                return;
            }
        };
        timerEl.innerText = time;
    }, 1000)
}


function flipCard() {
    this.removeEventListener('click', flipCard)
    this.classList.add('flipped')
    arrFlipped.push(this)
    if (arrFlipped.length === 2) {
        stopAllClicks()
        checkCards()
    }
}

function checkCards() {
    if (arrFlipped[0].innerText === arrFlipped[1].innerText) {
        console.log('Pogodak')
        if (level === 3) {
            time = time + 20
        } else if (level === 2) {
            time = time + 15
        } else if (level === 1) {
            time = time + 10
        }
        arrTwoFlipped.push(arrFlipped[0])
        arrTwoFlipped.push(arrFlipped[1])
        arrTwoFlipped[arrTwoFlipped.length - 2].classList.add('flipped-two')
        arrTwoFlipped[arrTwoFlipped.length - 1].classList.add('flipped-two')
        arrFlipped = []
        setTimeout(() => {
            checkIfFinished()
        }, 1000)
        addAllClicksExceptFlipped()
    } else {
        setTimeout(() => {
            arrFlipped[0].classList.remove('flipped')
            arrFlipped[1].classList.remove('flipped')
            arrFlipped = []
            addAllClicksExceptFlipped()
            console.log('Promasaj')
        }, 1000)
    }
}

function addAllClicksExceptFlipped() {
    allCards.forEach(card => {
        if (!card.classList.contains('flipped-two')) {
            card.addEventListener('click', flipCard)
        }
    })
}

function stopAllClicks() {
    allCards.forEach(card => card.removeEventListener('click', flipCard))
}


