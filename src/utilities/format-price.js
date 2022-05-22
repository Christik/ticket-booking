export default (number) => {
    const string = String(number);
    let formatNumber = '';

    for (let i = 0; i < string.length; i++) {
        const currentDigit = string[string.length - 1 - i];

        formatNumber = `${currentDigit}${formatNumber}`;

        if ((i + 1) % 3 === 0) {
            formatNumber = ` ${formatNumber}`;
        }
    }

    return formatNumber;
};