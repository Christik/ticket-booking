import './styles/styles.less';

import formatNumber from './utilities/format-price';
import getIndexOfElement from './utilities/index-of-element';
import templateOrderList from './templates/order-list.hbs';

// Настройки
const SETTINGS = {
    availableClass: 'seat_available',
    selectedClass: 'seat_selected',
    reservedClass: 'seat_reserved',
    expensiveClass: 'seat_expensive',
    inexpensiveClass: 'seat_inexpensive',
    cheatClass: 'seat_cheap',
    seatElement: '.seats .seat',
    rowElement: '.seats__row',
    orderListElement: '[data-order-list]',
    totalElement: '[data-total]',
};

// Вилка цен
const pricesMap = {
    [SETTINGS.expensiveClass]: 3000,
    [SETTINGS.inexpensiveClass]: 1500,
    [SETTINGS.cheatClass]: 1000,
};

// Зал с креслами
const auditoriumEl = document.querySelector('.auditorium');

// Получить номер ряда
const getRowNumber = (seat) => {
    const row = seat.closest(SETTINGS.rowElement);
    const index = getIndexOfElement(row);

    return (index + 1);
};

// Получить номер места
const getSeatNumber = (seat) => {
    return seat.textContent;
};

// Получить цену указанного места
const getPriceOfSeat = (seat) => {
    const tariffs = Object.keys(pricesMap);

    for (const tariff of tariffs) {
        if (seat.classList.contains(tariff)) {
            return pricesMap[tariff];
        }
    }

    return null;
};

// Получить все места, выбранные пользователем
const getSeatsSelected = () => {
    const seatsSelectedEl = auditoriumEl.querySelectorAll(`.${SETTINGS.selectedClass}`);

    return seatsSelectedEl;
};

// Получить общую сумму
const getTotal = () => {
    const seatsSelectedEl = getSeatsSelected();
    let total = 0;

    seatsSelectedEl.forEach((seat) => {
        const price = getPriceOfSeat(seat);
        total += price;
    });

    return total;
};

// Отметить выбранные кресла, согласно данным из localStorage 
const setSeatsSelected = () => {
    const seatsSelectedPosition = JSON.parse(
        localStorage.getItem('seatsSelectedPosition')
    );

    if (seatsSelectedPosition) {
        seatsSelectedPosition.forEach((position) => {
            const [ rowNumber, seatNumber ] = position;
            const rowEl = document.querySelector(`${SETTINGS.rowElement}:nth-child(${rowNumber})`);
            const cellEl = rowEl.children[seatNumber - 1];
            const seatEl = cellEl.querySelector(SETTINGS.seatElement);

            toggleSeatClass(seatEl);
        });
    }
};

// Сохранить в locasStorage расположение выбранных пользователем мест
const saveSeatsSelectedPosition = () => {
    const seatsSelectedEl = getSeatsSelected();

    // Получаем массив с позициями выбранных пользователем мест.
    // Каждая позиция - массив с номером ряда и номером места
    const seatsSelectedPosition = [...seatsSelectedEl].map((seat) => {
        const seatNumber = getSeatNumber(seat);
        const rowNumber = getRowNumber(seat);

        return [rowNumber, seatNumber];
    });

    localStorage.setItem(
        'seatsSelectedPosition', 
        JSON.stringify(seatsSelectedPosition)
    );
};

// Обновить общую сумму
const updateTotal = () => {
    const total = getTotal();
    const totalEl = document.querySelector(SETTINGS.totalElement);

    totalEl.textContent = formatNumber(total);
};

// Обновить информацию о заказе
const updateOrder = () => {
    const orderListEl = document.querySelector(SETTINGS.orderListElement);
    const seatsSelectedEl = getSeatsSelected();
    const orderRows = [];
    
    seatsSelectedEl.forEach((seat) => {
        const orderRow = {
            rowNumber: getRowNumber(seat),
            seatNumber: getSeatNumber(seat),
            price: formatNumber(getPriceOfSeat(seat)),
        };
        orderRows.push(orderRow);
    });

    const template = templateOrderList({ orderRows });

    orderListEl.innerHTML = template;
};

// Переключение классов кресел
const toggleSeatClass = (seat) => {
    seat.classList.toggle(SETTINGS.availableClass);
    seat.classList.toggle(SETTINGS.selectedClass);
};

// Делегирование клика по креслу в зале
auditoriumEl.addEventListener('click', (event) => {
    const seat = event.target.closest(
        `.${SETTINGS.availableClass}, .${SETTINGS.selectedClass}`
    );

    if (seat) {
        toggleSeatClass(seat);
        updateOrder();
        updateTotal();
        saveSeatsSelectedPosition();
    }
});

// Инициализация
setSeatsSelected();
updateOrder();
updateTotal();