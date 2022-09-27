export function validateInputLength(inputId, minLength) {
    const input = document.getElementById(inputId);

    if (input.value.length >= minLength) {
        return true;
    }

    console.log(`Input '${inputId}' has a length less than ${minLength}!`);
    return false;
}

export function validateInputByRegex(inputId, regex) {
    const input = document.getElementById(inputId);

    if (input.value.match(regex)) {
        return true;
    }

    console.log(`Input '${inputId}' validation failed!`);
    return false;
}

export function validateSameInputsValue(firstInputId, secondInputId) {
    const firstInput = document.getElementById(firstInputId);
    const secondInput = document.getElementById(secondInputId);

    if (firstInput.value === secondInput.value) {
        return true;
    }

    console.log(`Inputs '${firstInputId}' and '${secondInputId}' not match!`);
    return false;
}