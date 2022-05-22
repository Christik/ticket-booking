export default (element) => {
    const parent = element.parentElement;
    const elements = parent.children;
    const array = [...elements];
    const index = array.indexOf(element);

    return index;
};