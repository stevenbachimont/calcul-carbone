function calculateCarbon() {
    // Récupération des valeurs du formulaire
    var electricity = parseFloat(document.getElementById("electricity").value);
    var gas = parseFloat(document.getElementById("gas").value);
    var carDistance = parseFloat(document.getElementById("carDistance").value);
    var typecar = document.getElementById("typecar").value;
    var caroccupants = parseFloat(document.getElementById("caroccupants").value);
    var trainDistance = parseFloat(document.getElementById("trainDistance").value);
    var flightDistance = parseFloat(document.getElementById("flightDistance").value);
    var appliances = parseFloat(document.getElementById("appliances").value);
    var electronics = parseFloat(document.getElementById("electronics").value);
    var redMeatConsumption = parseFloat(document.getElementById("redMeatConsumption").value);
    var whiteMeatConsumption = parseFloat(document.getElementById("whiteMeatConsumption").value);
    var porkConsumption = parseFloat(document.getElementById("porkConsumption").value);
    var housingType = document.getElementById("housingType").value;
    var housingSize = parseFloat(document.getElementById("housingSize").value);
    var bulkFoodPurchase = document.getElementById("bulkFoodPurchase").value;
    var occupants = parseFloat(document.getElementById("occupants").value);
    var largeClothingPurchase = parseFloat(document.getElementById("largeClothingPurchase").value);
    var smallClothingPurchase = parseFloat(document.getElementById("smallClothingPurchase").value);

    // Facteurs d'émissions de carbone en kg de CO2 par unité source; ADEME, GREENLY, RTE, CARBO academy
    var emissionFactors = {
        electricity: 0.4,
        gas: 0.2,
        train: 0.014,
        flight: 0.285,
        appliance: 0.1,
        electronic: 0.05,
        redMeat: 14,
        whiteMeat: 7,
        pork: 12,
        apartment: 15,
        house: 20,
        servicesCommuns: 1500,
        clothing: {
            large: 27,   //pour vêtement français et 54 pour vêtement importé
            small: 10
        }
    };

    // Calcul des émissions de carbone pour chaque catégorie
    var transportEmissions =
        (trainDistance * emissionFactors.train) +
        (flightDistance * emissionFactors.flight);

    var housingEmissions = (electricity * emissionFactors.electricity / occupants) +
        (gas * emissionFactors.gas / occupants) +
        (emissionFactors[housingType] * occupants * housingSize / occupants);

    var redMeatEmissions = redMeatConsumption * emissionFactors.redMeat;
    var whiteMeatEmissions = whiteMeatConsumption * emissionFactors.whiteMeat;
    var porkEmissions = porkConsumption * emissionFactors.pork;

    var foodEmissions = redMeatEmissions + whiteMeatEmissions + porkEmissions;

    var appliancesElectronicsEmissions = (appliances * emissionFactors.appliance / occupants) +
        (electronics * emissionFactors.electronic);

    // Ajout de l'impact de l'achat en vrac
    var bulkFoodPurchaseFactor = getBulkFoodPurchaseFactor(bulkFoodPurchase);
    foodEmissions *= bulkFoodPurchaseFactor;

    var typecarFactor = getTypecarFactor(typecar);
    transportEmissions += (carDistance / caroccupants * typecarFactor);

    // Calcul des émissions de carbone pour les vêtements
    var clothingEmissions = (largeClothingPurchase * emissionFactors.clothing.large) +
        (smallClothingPurchase * emissionFactors.clothing.small);

    // Calcul du total des émissions de carbone
    var totalEmissions = transportEmissions + (housingEmissions + appliancesElectronicsEmissions) + foodEmissions + clothingEmissions + emissionFactors.servicesCommuns;

    // Affichage du résultat
    document.getElementById("result").textContent = totalEmissions.toFixed(2);

    // Création d'un graphique
    var ctx = document.getElementById('carbonChart').getContext('2d');
    var labels = ['Transport', 'Logement', 'Nourriture', 'Vêtements & électronique', 'Services Communs'];
    var data = [transportEmissions, (housingEmissions + appliancesElectronicsEmissions), foodEmissions, clothingEmissions, emissionFactors.servicesCommuns];

    if (window.myChart) {
        window.myChart.destroy(); 
    }

    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Émissions de CO2 (kg)',
                data: data,
                backgroundColor: ['rgba(141,13,56,0.67)', 'rgba(95, 207, 163, 0.67)', 'rgba(32, 137, 255, 0.67)', 'rgba(255, 165, 0, 0.67)', 'rgba(255, 0, 0, 0.67)'],
                borderColor: 'rgb(132,75,192)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Fonction pour obtenir le facteur d'achat en vrac en fonction de la sélection
function getBulkFoodPurchaseFactor(selection) {
    switch (selection) {
        case 'never':
            return 1;
        case 'occasionally':
            return 0.8;
        case 'regularly':
            return 0.5;
        case 'always':
            return 0.3;
        default:
            return 1;
    }
}

// Fonction pour obtenir le facteur de type de véhicule en fonction de la sélection
function getTypecarFactor(selection) {
    switch (selection) {
        case 'small':
            return 0.1;
        case 'medium':
            return 0.14;
        case 'big':
            return 0.18;
        default:
            return 0.14;
    }
}   //petite voiture 0.104 / voiture moyenne 0.14 / grosse voiture 0.18


function saveToLocalStorage() {
    var formElements = document.getElementById("carbonCalculator").elements;
    for (var i = 0; i < formElements.length; i++) {
        if (formElements[i].type !== "button") {
            localStorage.setItem(formElements[i].id, formElements[i].value);
        }
    }
}

document.getElementById("carbonCalculator").addEventListener("button", function(event) {
    event.preventDefault(); // Empêche le rechargement de la page
    saveToLocalStorage();
    calculateCarbon(); // Vous pouvez également appeler la fonction calculateCarbon ici si vous le souhaitez
});


function loadFromLocalStorage() {
    var formElements = document.getElementById("carbonCalculator").elements;
    for (var i = 0; i < formElements.length; i++) {
        if (formElements[i].type !== "button") {
            if (localStorage.getItem(formElements[i].id)) {
                formElements[i].value = localStorage.getItem(formElements[i].id);
            }
        }
    }
}

window.onload = function() {
    loadFromLocalStorage();
}


