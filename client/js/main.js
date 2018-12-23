let inputTimeout;
let weatherData;


document.getElementById('town-input__input').addEventListener('input', event => {
  // debounce api call
  if (inputTimeout) {
    clearTimeout(inputTimeout);
  }
  inputTimeout = setTimeout(() => getWeather(event.target.value), 300);
});

function dayListEventListener() {
  renderDaysDetails({
    day: weatherData.list[this.dataset.index],
    city: weatherData.city.name
  });
}

function getWeather (town) {
  const req = new Request(`http://localhost:8081/api/v1/weather?town=${town}`);
  const opts = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'default'
  };
  fetch(req, opts)
    .then(response => response.json())
    .then(data => {
      weatherData = data;
      renderDaysList(data.list);
    });
}

function renderDaysList (data) {
  // remove old listeners before re-rendering template
  document
    .querySelectorAll('.days-list__day')
    .forEach(el => el.removeEventListener('click', dayListEventListener));

  renderTemplate('tmpl-days-list', 'list', { days: data });
  document
    .querySelectorAll('.days-list__day')
    .forEach(el => el.addEventListener('click', dayListEventListener));
}

function renderDaysDetails (data) {
  renderTemplate('tmpl-days-detail', 'detail', data);
}

Handlebars.registerHelper('date', function(epoch) {
  const date = new Date(epoch * 1000);
  return new Handlebars.SafeString(date.toLocaleString());
});

function renderTemplate(source, destination, context) {
  const destElement = document.getElementById(destination);
  const srcElement = document.getElementById(source).innerHTML;
  const template = Handlebars.compile(srcElement);
  destElement.innerHTML = template(context);
}
