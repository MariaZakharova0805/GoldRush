1. При нажатии кнопки SPIN
- списывается баланс в размере ставки
- добавляется +100 звездочек (в ТЗ не уточнено, на что влияют звездочки и есть ли предельный баланс, */900 - 900 стоит по умолчанию, тк не описано в ТЗ)
- если баланс не нулевой и размер ставки меньше баланса, рулетка запускает прокрутку слота(1 раз)
- прокрутка слота останавливается атоматически после рандомного количество времени (до )

2. При нажатии кнопки AUTO:
- списывается баланс в размере ставки
- добавляется +100 здездочек
- рулетка запускает прокрутку слота пока баланс не будет нулевым или же размер ставки будет больше чем баланс
- промежуток между запусками 3секунду. Можно поменять, изменив строку 102:
```sh
103 setTimeout(autoPlay, 3000); //авто запуск слота каждые 3 секунды(опционально)
```
- при повторном нажатии кнопки AUTO проигрыш будет остановлен
- если игрок побеждает, автопроигрыш не останавливается. Если необходимо остановить игру после выигрыша - убрать строку 67:
```sh
68: autoPlayRunning = false; //закоментировать строку, если после выигрыша нужно продолжить запуск игры
```

3. Рулетка
- для реализации использована библиотке swiper.js
- разметка рулетки: 3 ряда(слайдера) по 9 картинок
- три слайдера запускаются одновременно с разной скоростью
- чтобы поменять скорость прокрутки каждого слайдера, нужно изменить значение 2го параметра в строках 160-162: 
```sh
160 const swiper_1 = createSwiper(".mySwiper_1", 40);// (слектор рулетки, скорость прокрутки (опционально))
161 const swiper_2 = createSwiper(".mySwiper_2", 60);
162 const swiper_3 = createSwiper(".mySwiper_3", 80);
```
- каждой картинке происвоен data-number
- после каждой прокрутке определяется, совпадают ли data-number у всех центральных картинок
*чтобы не крутить рулетку долго и приверить, как будет евсти себя игра при выигрыше, в index.html заменить все data-number на одинаковые числа
```sh
<div class="swiper-slide" data-number="7"><img src="./assets/img7.svg" alt="bell" /></div>
```

4. Баланс монет и звездочек:
- автоматичеси сохраняется при нажатии кнопок SPIN и AUTO, а также при выигрыше
- при первичном запуске игры:
    * баланс звездочек: 0
    * баланс игрока(монеты): 1000000
- при перезагрузке страницы баланс звездочек и монет выгружатеся из объекта LocalStorage
- чтобы очистить хранилище нужно раскомментировать строку 165 и перезагрузить браузер:
```sh
164 localStorage.removeItem("gameData"); //раскомментировать для отчистки объекта игры из хранилища и перезагруить браузер
```
5. Cсылки:
- <a href='https://mariazakharova0805.github.io/GoldRush/'>deploy</a>
- <a href='https://www.figma.com/file/9mww8B2cwQwuHeLfSfmdZk/Gold-Rush?node-id=0%3A1&t=lTgtl0i7KwFIi7Bt-0'>layout</a> 
