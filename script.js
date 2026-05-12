// ЗАВДАННЯ 1 вхід та кошик

// 1 відкриття
function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

// 2 закриття
function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}
// 3 нерухомі кнопки
window.addEventListener('load', function() {
    //відкриття при кліку 
    document.getElementById("authBtn").onclick = function() { openModal("auth-modal"); };
    document.getElementById("cartBtn").onclick = function() { openModal("cart-modal"); };
    //закриття на хрестики
    document.getElementById("close-auth").onclick = function() { closeModal("auth-modal"); };
    document.getElementById("close-cart").onclick = function() { closeModal("cart-modal"); };
});

// ЗАВДАННЯ 2 карусель

var slide = 1;
//кнопка вправо
document.getElementById("nextBtn").onclick = function() {
    slide = slide + 1; 
    if (slide > 3) { slide = 1; } 
    showSlide(); //показати
};
//кнопка вліво
document.getElementById("prevBtn").onclick = function() {
    slide = slide - 1;
    if (slide < 1) { slide = 3; } 
    showSlide();
};
//міняємо текст по номеру
function showSlide() {
    if (slide == 1) {
        document.getElementById("promo-title").innerText = "Весняна Акція!";
        document.getElementById("promo-text").innerText = "Знижки на всі лаки.";
    }
    if (slide == 2) {
        document.getElementById("promo-title").innerText = "Подарунок!";
        document.getElementById("promo-text").innerText = "Фреза у подарунок до замовлення.";
    }
    if (slide == 3) {
        document.getElementById("promo-title").innerText = "Доставка!";
        document.getElementById("promo-text").innerText = "Безкоштовно від 1000 грн.";
    }
}
// ЗАВДАННЯ 3 новини
function toggle(element) {
    //текст при натисненні
    var text = element.querySelector(".news-text");

    //схований  показуємо, ні ховаємо
    if (text.style.display == "block") {
        text.style.display = "none";
    } else {
        text.style.display = "block";
    }
}
// ЗАВДАННЯ 4-5 товари
var products = [
    { name: "Ножиці Staleks", price: 650, cat: "інструменти", img: "images/ножниці .webp" },
    { name: "База Kodi 12мл", price: 280, cat: "матеріали", img: "images/База Kodi Rubber Base 12мл.webp" },
    { name: "Лампа SunOne", price: 850, cat: "обладнання", img: "images/Лампа.jpg" },
    { name: "Гель для нарощування", price: 320, cat: "нарощування", img: "images/нарощювання.webp" },
    { name: "Обезжирювач 3в1", price: 120, cat: "рідини", img: "images/знежирювач.avif" },
    { name: "Серветки безворсові", price: 60, cat: "витратні матеріали", img: "images/серветки.webp" },
    { name: "Крафт-пакети", price: 180, cat: "стерилізація", img: "images/Крафт.jpg" },
    { name: "Олія для кутикули", price: 95, cat: "догляд", img: "images/олійка для кутикули.jpg" },
    { name: "Слайдери для нігтів", price: 35, cat: "декор", img: "images/слайдер для нігтів.jpeg" }
];

// спочатку все
function show(category) {
    current = category;
    var grid = document.getElementById("product-grid");
    grid.innerHTML = "";

    for (var i = 0; i < products.length; i++) {
        if (current == "все" || products[i].cat == current) {
            grid.innerHTML += `
                <div class="product-card" draggable="true" ondragstart="drag(event, '${products[i].name}', ${products[i].price})">
                    <img src="${products[i].img}" width="100%">
                    <h3>${products[i].name}</h3>
                    <p>${products[i].price} ₴</p>
                    <button class="buy-btn" onclick="kupyty('${products[i].name}', ${products[i].price})">Купити</button>
                </div>`;
        }
    }
}

document.getElementById("sortPrice").onchange = function() { show(current); };
window.onload = function() { show("все"); };

 // ЗАВДАННЯ галерея ідей
var ideas = [
    { img: "images/Весняний френч.jpeg", title: "Френч", desc: "Класика на кожен день.", sale: "-10%" },
    { img: "images/квіти.webp", title: "Квіти", desc: "Весняний ручний розпис.", sale: "-20%" },
    { img: "images/червоні.webp", title: "Червоний", desc: "Яскравий глянцевий топ.", sale: "-5%" },
    { img: "images/нюд.jpg", title: "Нюд", desc: "Природний вигляд нігтів.", sale: "-15%" },
    { img: "images/стилет.jpg", title: "Стилет", desc: "Екстравагантна форма.", sale: "-30%" },
    { img: "images/Градієнт бейбібумер.jpg", title: "Градієнт", desc: "Плавний перехід кольорів.", sale: "-12%" }
];

var currentIndex = 0; // Починаємо з нуля
var step = 3;         // Додаємо по 3 штуки

function loadMore() {
    var grid = document.getElementById("gallery-grid");
    var btn = document.getElementById("load-more-btn");
    
    // Рахуємо кінцеву точку для цього кроку (наприклад, 0 + 3 = 3)
    var limit = currentIndex + step;

    for (var i = currentIndex; i < limit && i < ideas.length; i++) {
        grid.innerHTML += `
            <div class="gallery-card">
                <div class="discount-tag">${ideas[i].sale}</div> 
                <img src="${ideas[i].img}" width="100%">
                <h4>${ideas[i].title}</h4>
                <button class="btn-desc" onclick="this.nextElementSibling.classList.toggle('hidden')">
                    Опис
                </button>
                <p class="extra-desc hidden">${ideas[i].desc}</p> 
            </div>`;
    }

    // Оновлюємо лічильник: тепер ми показали вже 'limit' елементів
    currentIndex = limit;

    // Перевірка: якщо ми показали стільки ж або більше, ніж є в масиві
    if (currentIndex >= ideas.length) {
        btn.innerText = "Це всі ідеї ✨"; 
        btn.disabled = true;                      
    }
}

// ВАЖЛИВО: Викликаємо лише ОДИН РАЗ при завантаженні, щоб показати перші 3
window.addEventListener('DOMContentLoaded', function() {
    loadMore(); 
});
function hovaemo() {
    // 1 наше вікно 
    var vikno = document.getElementById('subscribe-notification');

    // 2робимо щоб воно пропало
    vikno.style.display = 'none';

    // 3 щоб було смс
    alert("Дякуємо!");
}

// ЗАВДАННЯ  реклама  5 секунди 
setTimeout(function() {
    document.getElementById('reklama').style.display = 'block';

    var s = 5; // Скільки секунд чекати

    // 2рахуємо час назад 
    var timer = setInterval(function() {
        s--; 
        document.getElementById('sek').innerText = s; //щоб цифри мінялися
        
        if (s <= 0) {
            clearInterval(timer);
            document.getElementById('btn-close').disabled = false; //кнопка щоб можна було закрити
            document.getElementById('sek').parentElement.innerText = "Можна закривати!";
        }
    }, 1000);
    
}, 3000);

//ЗАВДАННЯ стрілочка
//крутимо сторінку
window.onscroll = function() {
    var btn = document.getElementById("vhoru");
    
    //більше 500 пікселів то показуємо кнопку
    if (window.scrollY > 500) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

//3 лабораторна
// 1. Створюємо змінну для загальної суми
//кошик
var suma = 0; 

function kupyty(nazva, cina) {
    var spysok = document.getElementById("cart-items-list");

    //перевіряємо чи є вже такий товар? 
    if (spysok.innerHTML.includes(nazva)) {
        alert("Цей товар уже у кошику! Змініть кількість у віконці.");
        return; 
    }

    if (suma == 0) { spysok.innerHTML = ""; }

    // підрахунок
    spysok.innerHTML += `
        <div class="tovar-row" style="border-bottom: 1px dashed pink; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="width: 120px;">${nazva}</span>
            <input type="number" value="1" min="1" class="vhid-kilkist" data-cina="${cina}" onchange="rahunok()" style="width: 45px;">
            <span>${cina} грн</span>
            <button onclick="this.parentElement.remove(); rahunok();" style="border:none; background:none; cursor:pointer;">❌</button>
        </div>`;

    rahunok(); //оновлюємо суму 
}

//функція яка пробігається по кошику і додає
function rahunok() {
    var vsi_polya = document.getElementsByClassName("vhid-kilkist");
    var razom = 0;

    for (var i = 0; i < vsi_polya.length; i++) {
        var k = vsi_polya[i].value; // скільки штук
        var c = vsi_polya[i].getAttribute("data-cina"); // ціна за одну
        razom = razom + (k * c);
    }

    suma = razom;
    document.getElementById("vseho-groshiv").innerText = suma;
    document.getElementById("cartBtn").innerText = "🛒 Кошик (" + suma + " ₴)";
}

//новини
var bazaNovyn = [
    { den: "27.03 10:00", zagolovok: "Нові бази Dark", tekst: "Ми отримали 20 нових кольорів, які не печуть у лампі!", vazhlyvo: true },
    { den: "26.03 14:30", zagolovok: "Графік на Великдень", tekst: "У святкові дні магазин працюватиме до 14:00.", vazhlyvo: false },
    { den: "25.03 09:00", zagolovok: "Знижки на фрези", tekst: "Тільки три дні знижка -30% на всі алмазні фрези.", vazhlyvo: true },
    { den: "24.03 16:00", zagolovok: "Поради майстрам", tekst: "Як правильно стерилізувати інструменти: нове відео на каналі.", vazhlyvo: false }
];

var pokazanoNovyn = 0;

function dodatyNovynu() {
    var panel = document.getElementById("news-sidebar-list");
    
    //додаємо по 2 новини за раз
    for (var i = 0; i < 2; i++) {
        if (pokazanoNovyn < bazaNovyn.length) {
            var n = bazaNovyn[pokazanoNovyn];
            var bold = n.vazhlyvo ? "font-weight: bold; color: #d14d72;" : "";
            
            panel.innerHTML += `
                <div onclick="chytatyNovynu(${pokazanoNovyn})" style="cursor:pointer; padding: 5px; border-bottom: 1px solid #eee;">
                    <small>${n.den}</small><br>
                    <span style="${bold}">${n.zagolovok}</span>
                </div>`;
            pokazanoNovyn++;
        }
    }
}

function chytatyNovynu(id) {
    var area = document.getElementById("full-text-news");
    area.innerHTML = `
        <h3>${bazaNovyn[id].zagolovok}</h3>
        <p>${bazaNovyn[id].tekst}</p>
        <hr><small>Дата публікації: ${bazaNovyn[id].den}</small>
    `;
}

//спочвтку нові новини
window.addEventListener('load', dodatyNovynu);

//графік
var migrafik = null;

function pokazatyGrafik(vid) {

    var mistsia = document.getElementById('moiaDiagrama').getContext('2d');
    //підрахунок що маємо
    var k_instr = 0;
    var k_mat = 0;
    var k_oblad = 0;
    var k_inshe = 0;

    //рахуємо скільки яких товарів у нашому products
    for (var i = 0; i < products.length; i++) {
        if (products[i].cat == "інструменти") {
            k_instr = k_instr + 1;
        } else if (products[i].cat == "матеріали") {
            k_mat = k_mat + 1;
        } else if (products[i].cat == "обладнання") {
            k_oblad = k_oblad + 1;
        } else {
            k_inshe = k_inshe + 1;
        }
    }

    //видаляємо старий і виводимо новий
    if (migrafik != null) {
        migrafik.destroy();
    }

    //малюємо новий графік
    migrafik = new Chart(mistsia, {
        type: vid, 
        data: {
            labels: ["Інструменти", "Матеріали", "Обладнання", "Інше"],
            datasets: [{
                label: "Кількість",
                data: [k_instr, k_mat, k_oblad, k_inshe],
                backgroundColor: ["#f4044cff", "#f15e80ff", "#ea8495ff", "#f9bec7"]
            }]
        }
    });
}


//лаб 4
var statusVhodu = false; 
var rezhym = "vhid"; 

// Вхід / Реєстрація
document.getElementById("zmina").onclick = function() {
    var titul = document.getElementById("titul");
    var knopka = document.getElementById("knopka");
    var pas2 = document.getElementById("pas2");
    var sos = document.getElementById("sos");

    sos.innerText = ""; 

    if (rezhym == "vhid") {
        rezhym = "reg";
        titul.innerText = "Реєстрація";
        knopka.innerText = "Створити акаунт";
        pas2.classList.remove("hidden"); 
        this.innerText = "Вже є акаунт? Увійти";
    } else {
        rezhym = "vhid";
        titul.innerText = "Вхід";
        knopka.innerText = "Увійти";
        pas2.classList.add("hidden");
        this.innerText = "Ще немає акаунту? Реєстрація";
    }
};

// завдання 3, 4, 5, 6, 7
document.getElementById("forma").onsubmit = function(e) {
    e.preventDefault(); 

    var login = document.getElementById("log").value;
    var parol = document.getElementById("pas").value;
    var povtor = document.getElementById("pas2").value;
    var sos = document.getElementById("sos");

    sos.innerText = ""; // очищення помилок перед новою перевіркою

    if (rezhym == "reg") {
        //РЕЄСТРАЦІЯ
        
    } 
    else {
        // ВХІД 
        if (login == "admin" && parol == "123456") {
            alert("Вітаємо! Ви успішно увійшли."); // Завдання 7
            statusVhodu = true; 
            document.getElementById("authBtn").innerText = "Мій кабінет (" + login + ")";
            closeModal("auth-modal");
        } else {
            sos.innerText = "Помилка: Невірні дані!"; // Завдання 6 
        }
    }
};

// ЗАВДАННЯ 8 (Кошик)
document.addEventListener("click", function(e) {
    if (e.target && e.target.id == "sendBtn") {
        
        if (typeof statusVhodu === 'undefined') statusVhodu = false;

        if (statusVhodu) {
            alert("✅ Успіх! Замовлення прийнято.");
            document.getElementById("cart-items-list").innerHTML = "Кошик порожній ☹️";
            document.getElementById("vseho-groshiv").innerText = "0";
            if (typeof closeModal === "function") closeModal("cart-modal");
        } else {
            alert("❌ Помилка! Спочатку увійдіть в акаунт.");
            if (typeof closeModal === "function") closeModal("cart-modal");
            if (typeof openModal === "function") openModal("auth-modal");
        }
    }
});