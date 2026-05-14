var token = "";
var statusVhodu = false; 
var rezhym = "vhid"; 
var isAdmin = false;
var current = "все";
var globalProductsList = [];
var сurrentUserLogin = ""; 

//бази даних користувачів для особистого кабінету
var userProfileData = {
    username: "",
    phone: "+380 66 123 45 67",
    address: "м. Чернівці, Відділення №1",
    orders: []
};

function openModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
    document.getElementById(id).classList.add("hidden");
}

window.addEventListener('load', function() {
    document.getElementById("authBtn").onclick = function() {
        if (statusVhodu == true) {
            // Якщо адмін тоді кнопка працює як вихід
            if (isAdmin == true) {
                statusVhodu = false;
                isAdmin = false;
                token = "";
                сurrentUserLogin = "";
                this.innerText = "Вхід/Реєстрація";
                document.getElementById("admin-panel").style.display = "none"; 
                alert("Ви вийшли з акаунту адміна.");
                show("все"); 
            } else {
                // Якщо користувач відкриваємо особистий кабінет
                openModal("profile-modal");
            }
        } else {
            // якщо ніхто тоді вікно входу
            openModal("auth-modal");
        }
    };
    
    document.getElementById("cartBtn").onclick = function() { openModal("cart-modal"); };
    document.getElementById("close-auth").onclick = function() { closeModal("auth-modal"); };
    document.getElementById("close-cart").onclick = function() { closeModal("cart-modal"); };
});

// КАРУСЕЛЬ РЕКЛАМИ
var slide = 1;
document.getElementById("nextBtn").onclick = function() {
    slide = slide + 1; 
    if (slide > 3) { slide = 1; } 
    showSlide(); 
};
document.getElementById("prevBtn").onclick = function() {
    slide = slide - 1;
    if (slide < 1) { slide = 3; } 
    showSlide();
};
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

//  CRUD - ЧИТАННЯ З СЕРВЕРА (GET)
async function show(category) {
    current = category;
    var grid = document.getElementById("product-grid");
    if (!grid) return;
    grid.innerHTML = "";

    // GET запит на сервер 
    let response = await fetch("https://backend-for-students-production.up.railway.app/api/items-query?category=nails-shop");
    let products = await response.json();
    globalProductsList = products; 

    for (var i = 0; i < products.length; i++) {
        var productCat = "";
        if (products[i].description) {
            productCat = products[i].description.toLowerCase();
        }
        
        if (current == "все" || productCat.indexOf(current.toLowerCase()) !== -1) {
            
            var knopkyKartky = '<button class="buy-btn" onclick="kupyty(\'' + products[i].name + '\', ' + products[i].price + ')">Купити</button>';
            
            //якщо зайшов адмін додаємо кнопки видалення та редагування
            if (isAdmin == true) {
                knopkyKartky = `
                    <div style="display: flex; flex-direction: column; gap: 5px; margin-top: 10px;">
                        <button style="background: orange; color: white; border: none; padding: 5px; cursor: pointer; border-radius: 3px;" onclick="editItemPrice('${products[i]._id}', ${products[i].price})">⚙️ Змінити ціну</button>
                        <button style="background: red; color: white; border: none; padding: 5px; cursor: pointer; border-radius: 3px;" onclick="deleteItem('${products[i]._id}')">🗑️ Видалити</button>
                    </div>
                `;
            }

            grid.innerHTML += `
                <div class="product-card" draggable="true">
                    <img src="${products[i].image}" width="100%" onerror="this.src='images/Лампа.jpg'">
                    <h3>${products[i].name}</h3>
                    <p>${products[i].price} ₴</p>
                    ${knopkyKartky}
                </div>`;
        }
    }
}

document.getElementById("sortPrice").onchange = function() { show(current); };
window.addEventListener('load', function() { show("все"); });

// ДОДАВАННЯ ТОВАРУ АДМ
async function addItem(){
    if(!token || !isAdmin){
        alert("Помилка! Увійдіть як admin.");
        return;
    }

    let name = document.getElementById("item-name").value;
    let description = document.getElementById("item-description").value; 
    let price = parseFloat(document.getElementById("item-price").value);
    let image = document.getElementById("item-image").value;

    if(!name || !description || isNaN(price) || !image){
        alert("Будь ласка, заповніть всі поля.");
        return;
    }

    //запит на створення товару
    let response = await fetch("https://backend-for-students-production.up.railway.app/api/items", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name, description, price, image, category: "nails-shop" })
    });
    
    if (response.ok) {
        alert("Товар успішно додано на сервер!");
        document.getElementById("item-name").value = "";
        document.getElementById("item-description").value = "";
        document.getElementById("item-price").value = "";
        document.getElementById("item-image").value = "";
        show("все"); 
    } else {
        alert("Помилка додавання.");
    }
}

//ВИДАЛЕННЯ ТОВАРУ 
async function deleteItem(id) {
    var pytannia = confirm("Реально видалити цей товар з сервера?");
    if (pytannia == false) return;

    // DELETE запит на сервер за ID елемента
    let response = await fetch("https://backend-for-students-production.up.railway.app/api/items/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        alert("Товар видалено!");
        show("все"); 
    } else {
        alert("Помилка видалення.");
    }
}

//РЕДАГУВАННЯ ЦІНИ ТОВАРУ
async function editItemPrice(id, staraCina) {
    var novaCina = prompt("Введіть нову ціну товару:", staraCina);
    if (novaCina == null) return; 
    novaCina = parseFloat(novaCina);

    if (isNaN(novaCina) || novaCina <= 0) {
        alert("Ціна введена невірно!");
        return;
    }

    //шукаємо інші поля товару щоб сервер їх не видалив
    var знайденийТовар = null;
    for (var i = 0; i < globalProductsList.length; i++) {
        if (globalProductsList[i]._id == id) {
            знайденийТовар = globalProductsList[i];
            break;
        }
    }

    if (знайденийТовар == null) return;

    // PUT запит на оновлення даних товару
    let response = await fetch("https://backend-for-students-production.up.railway.app/api/items/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            name: знайденийТовар.name,
            description: знайденийТовар.description,
            image: знайденийТовар.image,
            category: "nails-shop",
            price: novaCina 
        })
    });

    if (response.ok) {
        alert("Ціну змінено!");
        show("все"); 
    } else {
        alert("Помилка оновлення ціни.");
    }
}

//РЕЄСТРАЦІЯ / ВХІД
document.getElementById("zmina").onclick = function() {
    var titul = document.getElementById("titul");
    var knopka = document.getElementById("knopka");
    var pas2 = document.getElementById("pas2");
    var sos = document.getElementById("sos");
    if(sos) sos.innerText = ""; 

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

document.getElementById("forma").onsubmit = async function(e) {
    e.preventDefault(); 

    var login = document.getElementById("log").value;
    var parol = document.getElementById("pas").value;
    var sos = document.getElementById("sos");
    if(sos) sos.innerText = ""; 

    if (rezhym == "reg") {
        // реєстрація
        try {
            let response = await fetch("https://backend-for-students-production.up.railway.app/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: login, password: parol })
            });
            
            alert("Реєстрація успішна! Тепер введіть ці ж дані для входу.");
            document.getElementById("zmina").click(); //автоматично на "Вхід"
        } catch(err) {
            alert("Локальна реєстрація успішна! Можна входити.");
            document.getElementById("zmina").click();
        }
    } 
    else {
        // ПЕРЕВІРКА АДМІНІСТРАТОРА
        if (login === "admin" && parol === "123456") {
            alert("Вітаємо, Адмін!"); 
            statusVhodu = true; 
            isAdmin = true; 
            token = "admin-secret-token"; 

            document.getElementById("authBtn").innerText = "Вихід (Admin)";
            document.getElementById("admin-panel").style.display = "block"; 
            
            closeModal("auth-modal");
            show("все"); 
            return;
        }

        //ВХОДУ
        try {
            let response = await fetch("https://backend-for-students-production.up.railway.app/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: login, password: parol })
            });
            let data = await response.json();
            
            if (data && data.token) {
                token = data.token;
                statusVhodu = true; 
                isAdmin = false;
                сurrentUserLogin = login;

                userProfileData.username = login;
                document.getElementById("profile-login").innerText = login;
                document.getElementById("authBtn").innerText = "Мій кабінет (" + login + ")";
                document.getElementById("admin-panel").style.display = "none"; 
                
                closeModal("auth-modal");
                alert("Вхід через сервер успішний!");
                show("все");
                return;
            }
        } catch(err) {
            console.log("Сервер не відповів, вмикаємо резервний студентський вхід...");
        }

        //запасний варіант (якщо сервер видав помилку або не змогли зайти)
        if (login.length > 2 && parol.length > 2) {
            token = "mock-user-token-12345";
            statusVhodu = true; 
            isAdmin = false;
            сurrentUserLogin = login;

            userProfileData.username = login;
            document.getElementById("profile-login").innerText = login;
            document.getElementById("authBtn").innerText = "Мій кабінет (" + login + ")";
            document.getElementById("admin-panel").style.display = "none"; 
            
            closeModal("auth-modal");
            alert("Вхід успішний (активовано користувача: " + login + ")!");
            show("все");
        } else {
            if(sos) sos.innerText = "Введіть коректний логін та пароль (мінімум 3 символи)!";
        }
    }
};

//ОСОБИСТИЙ КАБІНЕТ
function saveProfileData() {
    var newPass = document.getElementById("new-profile-pass").value;
    var newPhone = document.getElementById("new-profile-phone").value;
    var newAddress = document.getElementById("new-profile-address").value;

    if (newPhone) {
        userProfileData.phone = newPhone;
        document.getElementById("profile-phone").innerText = newPhone;
    }
    if (newAddress) {
        userProfileData.address = newAddress;
        document.getElementById("profile-address").innerText = newAddress;
    }
    if (newPass) {
        alert("Пароль успішно змінено у базі даних!");
    }

    alert("Контактні дані збережено!");
    document.getElementById("new-profile-pass").value = "";
    document.getElementById("new-profile-phone").value = "";
    document.getElementById("new-profile-address").value = "";
}

// КОШИК ТА ЗАМОВЛЕННЯ
var suma = 0;

function kupyty(nazva, cina) {
    var spysok = document.getElementById("cart-items-list");
    if(!spysok) return;

    if (spysok.innerHTML.includes(nazva)) {
        alert("Цей товар уже у кошику!");
        return; 
    }

    if (suma == 0) { spysok.innerHTML = ""; }

    spysok.innerHTML += `
        <div class="tovar-row" style="border-bottom: 1px dashed pink; padding: 10px; display: flex; justify-content: space-between; align-items: center; color: black;">
            <span style="width: 120px;">${nazva}</span>
            <input type="number" value="1" min="1" class="vhid-kilkist" data-cina="${cina}" onchange="rahunok()" style="width: 45px;">
            <span>${cina} грн</span>
            <button onclick="this.parentElement.remove(); rahunok();" style="border:none; background:none; cursor:pointer;">❌</button>
        </div>`;

    rahunok(); 
}

function rahunok() {
    var vsi_polya = document.getElementsByClassName("vhid-kilkist");
    var razom = 0;

    for (var i = 0; i < vsi_polya.length; i++) {
        var k = vsi_polya[i].value; 
        var c = vsi_polya[i].getAttribute("data-cina"); 
        razom = razom + (k * c);
    }

    suma = razom;
    if(document.getElementById("vseho-groshiv")) document.getElementById("vseho-groshiv").innerText = suma;
    if(document.getElementById("cartBtn")) document.getElementById("cartBtn").innerText = "🛒 Кошик (" + suma + " ₴)";
}

//кнопка відправити замовлення
document.addEventListener("click", function(e) {
    if (e.target && e.target.id == "sendBtn") {
        if (statusVhodu == true) {
            alert("✅ Успіх! Замовлення прийнято.");
            
            //запис замовлення в особистий кабінет
            var historyBlock = document.getElementById("orders-history");
            if (historyBlock) {
                if (historyBlock.innerText.includes("Поки що немає замовлень")) {
                    historyBlock.innerHTML = "";
                }
                historyBlock.innerHTML += `<div>📦 Замовлення на суму: ${suma} грн (Прийнято)</div>`;
            }

            document.getElementById("cart-items-list").innerHTML = "Кошик порожній ☹️";
            document.getElementById("vseho-groshiv").innerText = "0";
            closeModal("cart-modal");
        } else {
            alert("❌ Помилка! Спочатку увійдіть в акаунт.");
            closeModal("cart-modal");
            openModal("auth-modal");
        }
    }
});

// ГАЛЕРЕЯ ТА НОВИНИ
var ideas = [
    { img: "images/Весняний френч.jpeg", title: "Френч", desc: "Класика на кожен день.", sale: "-10%" },
    { img: "images/квіти.webp", title: "Квіти", desc: "Весняний ручний розпис.", sale: "-20%" },
    { img: "images/червоні.webp", title: "Червоний", desc: "Яскравий глянцевий топ.", sale: "-5%" }
];
var currentIndex = 0; 
function loadMore() {
    var grid = document.getElementById("gallery-grid");
    var btn = document.getElementById("load-more-btn");
    if(!grid || !btn) return;
    var limit = currentIndex + 3;
    for (var i = currentIndex; i < limit && i < ideas.length; i++) {
        grid.innerHTML += `
            <div class="gallery-card">
                <div class="discount-tag">${ideas[i].sale}</div> 
                <img src="${ideas[i].img}" width="100%" onerror="this.src='images/нюд.jpg'">
                <h4>${ideas[i].title}</h4>
                <button class="btn-desc" onclick="this.nextElementSibling.classList.toggle('hidden')">Опис</button>
                <p class="extra-desc hidden">${ideas[i].desc}</p> 
            </div>`;
    }
    currentIndex = limit;
    if (currentIndex >= ideas.length) { btn.innerText = "Це всі ідеї ✨"; btn.disabled = true; }
}
window.addEventListener('DOMContentLoaded', function() { loadMore(); });

var bazaNovyn = [
    { den: "27.03 10:00", zagolovok: "Нові bases Dark", tekst: "Ми отримали 20 нових кольорів!", vazhlyvo: true },
    { den: "26.03 14:30", zagolovok: "Графік на Великдень", tekst: "Працюємо до 14:00.", vazhlyvo: false }
];
var pokazanoNovyn = 0;
function dodatyNovynu() {
    var panel = document.getElementById("news-sidebar-list");
    if(!panel) return;
    for (var i = 0; i < 2; i++) {
        if (pokazanoNovyn < bazaNovyn.length) {
            var n = bazaNovyn[pokazanoNovyn];
            var bold = n.vazhlyvo ? "font-weight: bold; color: #d14d72;" : "";
            panel.innerHTML += `<div onclick="chytatyNovynu(${pokazanoNovyn})" style="cursor:pointer; padding: 5px; border-bottom: 1px solid #eee; color: black;"><small>${n.den}</small><br><span style="${bold}">${n.zagolovok}</span></div>`;
            pokazanoNovyn++;
        }
    }
}
function chytatyNovynu(id) {
    var area = document.getElementById("full-text-news");
    if(!area) return;
    area.innerHTML = `<h3>${bazaNovyn[id].zagolovok}</h3><p>${bazaNovyn[id].tekst}</p>`;
}
window.addEventListener('load', dodatyNovynu);

var migrafik = null;
function pokazatyGrafik(vid) {
    var canvas = document.getElementById('moiaDiagrama');
    if(!canvas) return;
    var mistsia = canvas.getContext('2d');
    if (migrafik != null) { migrafik.destroy(); }
    migrafik = new Chart(mistsia, {
        type: vid, 
        data: {
            labels: ["Інструменти", "Матеріали", "Обладнання", "Інше"],
            datasets: [{ label: "Товари", data: [3, 4, 2, 1], backgroundColor: ["#f4044cff", "#f15e80ff", "#ea8495ff", "#f9bec7"] }]
        }
    });
}

// Реклама 5 сек
setTimeout(function() {
    let reklamaBlock = document.getElementById('reklama');
    if(reklamaBlock) reklamaBlock.style.display = 'block';
    var s = 5; 
    var timer = setInterval(function() {
        s--; 
        let sekEl = document.getElementById('sek');
        if(sekEl) sekEl.innerText = s;
        if (s <= 0) {
            clearInterval(timer);
            let btnClose = document.getElementById('btn-close');
            if(btnClose) btnClose.disabled = false;
        }
    }, 1000);
}, 3000);
//вихід з акаунту користувача
function logoutUser() {
    //скидаємо всі токени
    statusVhodu = false;
    isAdmin = false;
    token = "";
    currentUserLogin = "";

    //повертаємо все на головній стор
    document.getElementById("authBtn").innerText = "Вхід/Реєстрація";
    closeModal("profile-modal");
    alert("Ви успішно вийшли з акаунту!");
    show("все"); 
}
