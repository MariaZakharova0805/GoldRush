//Объект для хранения данных о кол-ве монет и звезд
let gameData = {};
//По умолчанию рулетка не крутится(первичное открытие)
//Если рулетка крутится - то кнопки увеличения/уменьшения будут заблокированы
let isSliderRunning = false;
//Определяет режим прокрутки(spin или авто)
let autoPlayRunning = false;

//Сессионная память, которая сохраняет результат локально,
const setGameDataToLocalStorage = () => {
    gameData.coins_amount = coins.innerHTML;
    gameData.stars_amount = stars.innerHTML;
    let objectString = JSON.stringify(gameData);
    localStorage.setItem("gameData", objectString);
}

function checkEmptyStorage() {
    if (typeof (Storage) !== "undefined") {
        var result = localStorage.getItem("gameData");
        if (result === null) {
            return gameData = { coins_amount: 1000000, stars_amount: 0, }
        } else {
            gameData = JSON.parse(localStorage.gameData);
        }
    } else {
        console.log("Ваш браузер не поддерживает Local Storage");
    }
}
checkEmptyStorage()

//Количество очков(звездочек)
const stars = document.getElementById("stars");
stars.innerHTML = gameData.stars_amount;

//Баланс пользователя(монеты)
const coins = document.getElementById("coins");
coins.innerHTML = gameData.coins_amount;

//Размер ставки
const bet = document.getElementById("bet");
let bet_amount = 50000;
bet.innerHTML = bet_amount;
const increase_bet = document.getElementById("increase_bet"); //кнопка '+'
const decrease_bet = document.getElementById("decrease_bet"); //кнопка '-'

//Размер выигрыша
const win = document.getElementById("win");
win_amount = 0;
win.innerHTML = win_amount;

//Функция рандомно выбирает кол-во времени, которое будет крутится одна прокрутка(опционально)
const randomTimeAmount = () => {
    return Math.ceil(Math.random() * 800) + 600
}

//Проверка совпадения центральных картинок после каждой остановки
const checkMiddlePics= () => {
    // Определение активного слайда
    activeSlide1 = swiper_1.slides[swiper_1.activeIndex + 1];
    activeSlide2 = swiper_2.slides[swiper_2.activeIndex + 1];
    activeSlide3 = swiper_3.slides[swiper_3.activeIndex + 1];
    if (activeSlide1.dataset.number === activeSlide2.dataset.number &&
        activeSlide2.dataset.number === activeSlide3.dataset.number) {
        win.innerHTML = bet_amount * 5;
        coins.innerHTML = parseInt(coins.innerHTML) + parseInt(win.innerHTML);
        alert("Your win is " + win.innerHTML);
        setGameDataToLocalStorage();
        autoPlayRunning = false; //закоментировать строку, если после выигрыша нужно продолжить запуск игры
    }
}

//Функция запуска рулетки (1 прокрутка)
const runOneSpin = () => {
    isSliderRunning = true;
    let spinTime = randomTimeAmount();
    win.innerHTML = 0;
    swiper_1.autoplay.start();
    swiper_2.autoplay.start();
    swiper_3.autoplay.start();
    setTimeout(() => {
        swiper_1.autoplay.stop();
        swiper_2.autoplay.stop();
        swiper_3.autoplay.stop();
        checkMiddlePics();
        isSliderRunning = false;
    }, spinTime);
}

//Списывает из общего баланса размер ставки, зачисляет +100 звездочек
const makeBet = () => {
    coins.innerHTML -= bet_amount;
    stars.innerHTML = Number(stars.innerHTML) + 100;
}

//кнопка "auto", начинает подряд вызывать циклы прокрутки рулетки и списания денег(пока позволяет баланс монет)
//До повторного нажатия этой кнопки
const autoStartButton = document.getElementById("startButton");

function autoPlay() {
    if (parseInt(coins.innerHTML) > 0 && autoPlayRunning && (parseInt(coins.innerHTML) - bet_amount) >= 0) {
        makeBet();
        runOneSpin();
        setTimeout(autoPlay, 2000); //авто запуск слота каждые 2 секунды(опционально)
        setGameDataToLocalStorage();
    } else {
        autoPlayRunning = false;
    }
}

//кнопка "auto", начинает подряд вызывать циклы прокрутки рулетки и списания денег
autoStartButton.addEventListener("click", () => {
    autoPlayRunning = !autoPlayRunning;
    if (autoPlayRunning) {
        autoPlay(); // запускаем цикл только если флаг true
    }
});

//Увеличение ставки кнопкой '+'
increase_bet.addEventListener("click", () => {
    if (!isSliderRunning && !autoPlayRunning) {
        bet.innerHTML = ++bet_amount;
    }
})
//Уменьшение ставки кнопкой '-'
decrease_bet.addEventListener("click", () => {
    if (bet_amount > 0 && !isSliderRunning && !autoPlayRunning) {
        bet.innerHTML = --bet_amount;
    }
})

//Нажатие кнопки spin вызывает прокрутку рулетки один раз, сохраняя новый баланс монет и звезд
const spin = document.getElementById("spin");
spin.addEventListener("click", () => {
    if (coins.innerHTML > 0 && isSliderRunning === false && (parseInt(coins.innerHTML) - bet_amount) >= 0) {
        makeBet();
        runOneSpin();
    }
    setGameDataToLocalStorage();
})

//Анимация рулетки
function createSwiper(swiperClass, speedTime) {
    const swiper = new Swiper(swiperClass, {
        slidesPerView: 3,
        freeMode: false,
        loop: true,
        direction: "vertical",
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        speed: speedTime,
        allowTouchMove: false,
    });
    swiper.autoplay.stop();
    return swiper;
}

//3 колонки рулетки
const swiper_1 = createSwiper(".mySwiper_1", 40);// (слектор рулетки, скорость прокрутки (опционально))
const swiper_2 = createSwiper(".mySwiper_2", 60);
const swiper_3 = createSwiper(".mySwiper_3", 80);

//localStorage.removeItem("gameData"); //раскомментировать для отчистки объекта игры из хранилища и перезагруить браузер