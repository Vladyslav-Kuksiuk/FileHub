export function renderError(inputName, message) {
  const input = document.getElementsByName(inputName)[0];
  input.classList.add('input-error');
  const helpBlock = document.createElement('p');
  helpBlock.classList.add('help-block', 'text-danger');
  helpBlock.textContent = message;
  input.parentElement.append(helpBlock);
}

export function clearError() {
  const inputs = [...document.getElementsByTagName('input')];
  inputs.forEach((input) => {
    input.classList.remove('input-error');
    [...input.parentElement
        .getElementsByClassName('help-block')]
        .forEach((helpBlock) => helpBlock.remove());
  });
}
