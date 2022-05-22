import './styles/styles.less';

import formatNumber from './utilities/format-price';
import getIndexOfElement from './utilities/index-of-element';
import templateOrderList from './templates/order-list.hbs';

// Настройки
const settings = {
    availableClass: 'seat_available',
    selectedClass: 'seat_selected',
    reservedClass: 'seat_reserved',
    expensiveClass: 'seat_expensive',
    inexpensiveClass: 'seat_inexpensive',
    cheatClass: 'seat_cheap',
    rowElement: '.seats__row',
    orderListElement: '[data-order-list]',
    totalElement: '[data-total]',
};

// Вилка цен
const pricesMap = {
    [settings.expensiveClass]: 3000,
    [settings.inexpensiveClass]: 1500,
    [settings.cheatClass]: 1000,
};

// Зал с креслами
const auditorium = document.querySelector('.auditorium');

// Получить номер ряда
const getRowNumber = (seat) => {
    const row = seat.closest(settings.rowElement);
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
    const seatsSelected = auditorium.querySelectorAll(`.${settings.selectedClass}`);

    return seatsSelected;
};

// Получить общую сумму
const getTotal = () => {
    const seatsSelected = getSeatsSelected();
    let total = 0;

    seatsSelected.forEach((seat) => {
        const price = getPriceOfSeat(seat);
        total += price;
    });

    return total;
};

// Обновить общую сумму
const updateTotal = () => {
    const total = getTotal();
    const totalElement = document.querySelector(settings.totalElement);

    totalElement.textContent = formatNumber(total);
};

// Обновить информацию о заказе
const updateOrder = () => {
    const orderList = document.querySelector(settings.orderListElement);
    const seatsSelected = getSeatsSelected();
    const orderRows = [];
    
    seatsSelected.forEach((seat) => {
        const orderRow = {
            rowNumber: getRowNumber(seat),
            seatNumber: getSeatNumber(seat),
            price: formatNumber(getPriceOfSeat(seat)),
        };
        orderRows.push(orderRow);
    });

    const template = templateOrderList({
        orderRows,
    });

    orderList.innerHTML = template;
};

// Переключение классов кресел
const toggleSeatClass = (seat) => {
    seat.classList.toggle(settings.availableClass);
    seat.classList.toggle(settings.selectedClass);
};

// Делегирование клика по креслу в зале
auditorium.addEventListener('click', (event) => {
    const seat = event.target.closest(`.${settings.availableClass}, .${settings.selectedClass}`);

    if (seat) {
        toggleSeatClass(seat);
        updateOrder();
        updateTotal();
    }
});