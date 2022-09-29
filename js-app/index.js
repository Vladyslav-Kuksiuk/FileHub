const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const inputs = form.getElementsByTagName('input');
  // eslint-disable-next-line no-console
  [...inputs].forEach((input) => console.log(input.id + ': ' + input.value));
});

