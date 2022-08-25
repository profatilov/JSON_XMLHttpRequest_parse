let httpRequest = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open(obj.method || 'GET', obj.url);
        xhr.send(obj);

        xhr.onerror = () => reject(xhr.statusText);
        xhr.onload = () => {
            if (xhr.status !== 200) {
                reject(`Error ${xhr.status}: ${xhr.statusText}`);
            } else {
                resolve(xhr.response);
            }
        };
    });
};

httpRequest({url: 'https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json'}).then(data => {
    let countries = JSON.parse(data);
    let htmlCountryOptions = '<option value="0">Country not selected</option>';
    let countrySelect = document.querySelector('#country');
    let citySelect = document.querySelector('#city');
    let resultH3 = document.querySelector('.result');

    countries = sortObj(countries);

    for (let countriesKey in countries) {
        if (countriesKey && countries.hasOwnProperty(countriesKey)) {
            htmlCountryOptions += `<option value="${countriesKey}">${countriesKey}</option>`;
        }
    }

    countrySelect.innerHTML = htmlCountryOptions;

    countrySelect.addEventListener('change', function (e) {
        let countrySelected = countrySelect.options[countrySelect.selectedIndex].value;
        let htmlCitiesOptions = '<option value="0">City not selected</option>';

        resultH3.innerHTML = '';

        countries[countrySelected].sort();

        countries[countrySelected].forEach(city => {
            htmlCitiesOptions += `<option value="${city}">${city}</option>`;
        });

        citySelect.innerHTML = htmlCitiesOptions;
        citySelect.removeAttribute('disabled');

        citySelect.addEventListener('change', function (e) {
            let citySelected = citySelect.options[citySelect.selectedIndex].value;

            resultH3.innerHTML = `<h3>Country selected = <span style="color: yellow;">${countrySelected}</span>, City selected = <span style="color: yellow;">${citySelected}</span></h3>`;
        });
    })
}).catch(error => {
    console.log(error);
});

function sortObj(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];

        return result;
    }, {});
}