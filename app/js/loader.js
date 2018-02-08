;
"use strict";
var loader_demo = true; //Включить/выключить режим демонстрации
var loader_square = true; //Включить/выключить режим адаптивности

var loader_fade_time = 500; //Время скрытия прелоадера, мс
var loader_time_demo = 3500; //Период переключения демо, мс

var animation_classes = [ //Классы, которые будут добавляться на блок #loader_wrap
    "loader_animation", //Это базовый класс анимации, на его наличие привязана анимация в стилях...
]; //В массив можно добавлять свои классы через запятую

//Класс для дополнительной анимации проявления контента...
//Если он не нужен, то следует оставить пустую строку ("")...
//или пустую переменную (var post_loader_transition_class;)...
//Комментирование этой строки приведет к ошибке
var post_loader_transition_class = "blur";
// ===============
var loader_wrap = document.querySelector('#loader_wrap'); //Контейнер прелоадера
var loader = document.querySelector('.loader'); //Сам элемент прелоадера
var content_wrap = document.querySelector('#content_wrap'); //Контейнер содержимого страницы

var loader_wrap_original_display = getComputedStyle(loader_wrap).display; //Получени значения display из стилей контейнера прелоадера
content_wrap.style.transition = 'all ' + loader_fade_time / 1000 + 's'; //Установка времени transition...
//для анимации появления/скрытия контента
loader_wrap.style.transition = 'opacity ' + loader_fade_time / 1000 + 's'; //Установка transition//Установка времени transition...
//для анимации появления/скрытия прелоадера
var loader_demo_interval; //Будет хранить интервал Демо-режима. Нужен для его же сброса
var loader_demo_run = false; //Фаг первого запуска Демо-режима

//Инициализация появления прелоадера. Может принимать функцию в качестве аргумента,...
//которая вызовется по окончанию анимации проявления прелоадера
function init_preloader(callback1, callback2) {
    // console.log('init_preloader');
    loader_wrap.style.display = loader_wrap_original_display; //Установка display для контейнера прелоада, заданного в стилях
    if (animation_classes.length > 0) { //Цикл назначения классов на контейнер прелоада, к которым привязана анимация...
        for (var i = 0; i < animation_classes.length; i++) { // поведения самого прелоадера в стилях
            loader_wrap.classList.add(animation_classes[i]);
        }
    }
    if (post_loader_transition_class) { //Назначение класса дополнительной анимации появления контента...
        content_wrap.classList.add(post_loader_transition_class); //Этот класс удалится в момент начала скрытия прелоадера...
    } //При этом длительность transition этого класса синхронизирована с длительностью скрытия прелоадера,...
    //и задается переменной loader_fade_time в начале скрипта
    setTimeout(function() { //Здесь на body вешается класс, который отображает сам прелоадер. Чтобы сработал transition плавности...
        document.body.classList.add('loader'); //появления прелоадера, после переключения режимов display (none -> block, flex),...
    }, 10); //класс, использующий transition, должен вешаться через небольшой таймаут

    if (loader_square) { //Если нужна гибкая адаптивность прелоадера,...
        preloader_resize(); //то вызвать функцию, отвечающую за нее...
        window.addEventListener("optimizedResize", preloader_resize); //и подписать ее на событие ресайза окна браузера
    }

    setTimeout(function() { //Этот таймаут выполнится когда закончится анимация появления прелоадера....
        //Задержка таймаута синхронизируется со свойством transition для анимации появления прелоадера, и указывается в loader_fade_time
        document.body.classList.add('dont_scroll'); //Здесь на body вешается класс, который описан стилями таким образом,...
        //чтобы блокировать прокрутку страницы под прелоадером
        document.body.classList.remove('content'); //Удаляется класс, отвечающий в стилях за отображение онтента страницы

        if (typeof(callback1) == 'function') { //Вызов функции, переданной аргументом при вызове init_preloader
            callback1(); //На этот момент все переходные процессы анимации появления прелоадера завершены
        } else if (typeof(callback2) == 'function') { //Эта проверка нужна на случай, если первым аргументом придет объект event
            callback2();
        }
    }, loader_fade_time);
};
//Вызов функции remove_preloader запускает процесс скрытия прелоадера. Может принимать функцию в качестве аргумента,...
//которая вызовется по окончанию анимации проявления прелоадера
function remove_preloader(callback1, callback2) {
    // console.log('remove_preloader');
    if (loader_square) { //Если был установлен режим адаптивности,...
        window.removeEventListener("optimizedResize", preloader_resize); //то отписать функцию preloader_resize от события ресайза окна
    }
    if (loader_wrap && content_wrap) { //Если все нормально, и существуют контейнеры прелоадера и контента, то запускать скрытие прелоадера

        document.body.classList.remove('loader'); //Удалить класс с body, описывающий отображение прелоадера
        document.body.classList.remove('dont_scroll'); //Удалить класс, запрещающий скролл
        document.body.classList.add('content'); //Добавить класс, отображающий контент страницы
        //Тут начнется анимация скрытия прелоадера
        if (post_loader_transition_class) { //Если был задан дополнительный класс анимации появления контента,...
            content_wrap.classList.remove(post_loader_transition_class); //то удалить его с контейнера контента
        }
        setTimeout(function() { //Этот таймаут выполнится когда закончится анимация скрытия прелоадера....
            //Задержка таймаута синхронизируется со свойством transition для анимации скрытия прелоадера, и указывается в loader_fade_time
            loader_wrap.style.display = 'none'; //Скрытие контейнера прелоадера. Оно происходит когда все переходные моменты анимации...
            //на transition, уже закончились 
            if (animation_classes.length > 0) { //Цикл удаления классов с контейнера прелоада, к которым привязана анимация...
                for (var i = 0; i < animation_classes.length; i++) { // поведения самого прелоадера в стилях
                    loader_wrap.classList.remove(animation_classes[i]);
                }
            }
            if (typeof(callback1) == 'function') { //Вызов функции, переданной аргументом при вызове remove_preloader
                callback1(); //На этот момент все переходные процессы анимации скрытия прелоадера завершены
            } else if (typeof(callback2) == 'function') { //Эта проверка нужна на случай, если первым аргументом придет объект event
                callback2();
            }
        }, loader_fade_time);
    }
};

//Функция, иницииализирующая событие ресайза окна, взята с MDN:
//https://developer.mozilla.org/ru/docs/Web/Events/resize
function init_optimizedResize() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };
    throttle("resize", "optimizedResize");
};

function init_loader_demo() { //Инициализация Демо-режима
    if (loader_demo && !loader_demo_run) { //Если разрешен и не запущен
        loader_demo = false; //Отключить флаг демо для того, чтобы выполнилась один раз
        loader_demo_run = true; //Включить флаг запущенного Демо-режима
        console.log('Демо-режим прелоадера включен. Для отключения вызовите remove_loader_demo()');
        loader_demo_interval = setInterval(function() { //Сохраняет интервал в переменную
            if (loader_wrap.style.display == loader_wrap_original_display) {
                remove_preloader(test_callback_add);
            } else {
                init_preloader(test_callback_remove);
            }
        }, loader_time_demo);
        return true;
    } else if (!loader_demo && loader_demo_run) { //Если разрешен и запущен
        console.log('Демо-режим уже был включен ранее. Для отключения вызовите remove_loader_demo()');
        return false;
    } else if (!loader_demo && !loader_demo_run) { //Если не разрешен и не запущен
        console.log('Для включения Демо-режима вызовите init_loader_demo()');
        return false;
    } else {
        console.log('Демо-режим: O_o');
        return false;
    }
};

function remove_loader_demo() { //Отключение Демо-режима
    if (!loader_demo && loader_demo_run) { //Если запущен
        loader_demo = true; //Включить флаг демо для того, чтобы запустить init_loader_demo при следующем вызове
        loader_demo_run = false; //Выключить флаг запущенного Демо-режима
        console.log('Демо-режим прелоадера отключен. Для включения вызовите init_loader_demo()');
        clearInterval(loader_demo_interval); //Сбрасывает интервал, сохраненный в переменную
        return true;
    } else {
        console.log('Демо-режим не включен. Для включения вызовите init_loader_demo()');
        return false;
    }
};

function test_callback_add() { //Тестовый колбек, вызов которого отображает в примере...
    content_wrap.classList.add("loader_hideen"); //строку "Закончилась анимация исчезновения прелоадера"
};

function test_callback_remove() { //Тестовый колбек, вызов которого удаляет в примере...
    content_wrap.classList.remove("loader_hideen"); //строку "Закончилась анимация исчезновения прелоадера"
};

function preloader_resize() { //Функция для адаптивности прелоадера (сохраняет квадратные пропорции блока loader)
    // console.log('preloader_resize');
    var w_w = window.innerWidth; //Получить ширину окна
    var loader_comp_style = getComputedStyle(loader); //Получить стили loader из css
    var loader_w = loader_comp_style.width; //Выбрать из них ширину
    // var loader_w = parseInt(loader_comp_style.width); //Выбрать из них целое значение ширины
    // var loader_ratio = w_w / loader_w;
    // loader.style.height = w_w / loader_ratio + 'px';
    loader.style.height = loader_w; //И привсоить значение ширины в качестве высоты
}

// ========= Определение режима и запустк прелоадера =========
if (loader_square) { //Если нужна адаптивность
    init_optimizedResize(); //Вызвать функцию, генерирубщую событие ресайза
    init_preloader(); //Вызвать запуск прелоадера
} else {
    init_preloader(); //Если не нужна адаптивность, просто запустить прелоадер
};

if (loader_demo) { //Если Демо-режим разрешен,...
    init_loader_demo(); //то запустить его
} else if (!loader_demo) { //Если Демо-режим не разрешен,...
    console.log('Для включения Демо-режима вызовите init_loader_demo()');
    loader_demo = true; //То включить разрешение для возможности последующего ручного запуска
}


// ========= Для теста =========
content_wrap.addEventListener("click", init_preloader); //По клику на контент начать отображение прелоадера
content_wrap.style.cursor = 'pointer'; //Для теста

loader.addEventListener("click", remove_preloader); //По клику на прелоадер начать скрывать его
loader.style.cursor = 'pointer'; //Для теста;