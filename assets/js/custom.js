// Surandame HTML elementus
const form = document.getElementById("cvContactForm");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");
const results = document.getElementById("formResults");

// Formos laukai
const fields = [
    "vardas",
    "pavarde",
    "email",
    "telefonas",
    "adresas",
    "klausimas1",
    "klausimas2",
    "klausimas3"
];

// ==========================================
// 1. VALIDACIJOS FUNKCIJA
// ==========================================

function validateField(id) {

    const field = document.getElementById(id);
    const error = document.getElementById(id + "Error");
    const value = field.value.trim();

    let message = "";

    // Tikriname, ar laukas tuscias
    if (value === "") {
        message = "Šis laukas yra privalomas.";
    }

    // Tikriname varda
    else if (id === "vardas" || id === "pavarde") {

        const lettersOnly =
            /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+(?:\s+[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž]+)*$/;

        if (!lettersOnly.test(value)) {
            message = "Galima naudoti tik raides.";
        }
    }

    // Tikriname el. pasta
    else if (id === "email") {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailPattern.test(value)) {
            message = "Įveskite teisingą el. pašto adresą.";
        }
    }

    // Tikriname telefono numeri
    else if (id === "telefonas") {

        const phoneDigits = value.replace(/\D/g, "");

        if (!/^3706\d{7}$/.test(phoneDigits)) {
            message = "Numeris turi būti formato +370 6xx xxxxx.";
        }
    }

    // Tikriname vertinimo klausimus
    else if (
        id === "klausimas1" ||
        id === "klausimas2" ||
        id === "klausimas3"
    ) {

        const number = Number(value);

        if (!Number.isInteger(number) || number < 1 || number > 10) {
            message = "Pasirinkite skaičių nuo 1 iki 10.";
        }
    }

    // Parodome klaidos pranesima
    error.textContent = message;

    // Pridedame raudona arba zalia remeli
    field.classList.toggle("invalid-field", message !== "");
    field.classList.toggle("valid-field", message === "" && value !== "");

    return message === "";
}


// ==========================================
// 2. TIKRINIMAS REALIU LAIKU
// ==========================================

function checkForm() {

    let allValid = true;

    fields.forEach(function(id) {

        if (!validateField(id)) {
            allValid = false;
        }

    });

    // Mygtukas aktyvus tik tada, kai visi laukai teisingi
    submitBtn.disabled = !allValid;

    return allValid;
}


// Stebime visu lauku pakeitimus
fields.forEach(function(id) {

    const field = document.getElementById(id);

    field.addEventListener("input", checkForm);
    field.addEventListener("change", checkForm);

});


// ==========================================
// 3. TELEFONO NUMERIO FORMATAVIMAS
// ==========================================

const phoneInput = document.getElementById("telefonas");

phoneInput.addEventListener("input", function() {

    // Paliekame tik skaitmenis
    let digits = this.value.replace(/\D/g, "");

    // Atpazistame Lietuvos koda
    if (digits.startsWith("370")) {
        digits = digits.substring(3);
    }

    // Pritaikome vietini formata, pvz. 860...
    else if (digits.startsWith("8")) {
        digits = digits.substring(1);
    }

    else if (digits.startsWith("0")) {
        digits = digits.substring(1);
    }

    // Leidziame tik 8 skaitmenis po +370
    digits = digits.substring(0, 8);

    // Formuojame numeri +370 6xx xxxxx
    let formatted = "+370";

    if (digits.length > 0) {
        formatted += " " + digits.substring(0, 3);
    }

    if (digits.length > 3) {
        formatted += " " + digits.substring(3, 8);
    }

    this.value = formatted;

    // Tikriname numeri ir kitus laukus
    checkForm();

});


// ==========================================
// 4. FORMOS DUOMENU PATEIKIMAS
// ==========================================

form.addEventListener("submit", function(event) {

    // Sustabdome puslapio perkrovima
    event.preventDefault();

    // Pakartotinai patikriname visus laukus
    if (!checkForm()) {
        return;
    }

    // Sukuriame JavaScript objekta
    const formData = {

        vardas: document.getElementById("vardas").value.trim(),

        pavarde: document.getElementById("pavarde").value.trim(),

        email: document.getElementById("email").value.trim(),

        telefonas: document.getElementById("telefonas").value,

        adresas: document.getElementById("adresas").value.trim(),

        klausimas1: Number(document.getElementById("klausimas1").value),

        klausimas2: Number(document.getElementById("klausimas2").value),

        klausimas3: Number(document.getElementById("klausimas3").value)

    };

    // Isvedame objekta i Console
    console.log("Formos duomenys:", formData);

    // Apskaiciuojame vidurki
    const vidurkis = (
        formData.klausimas1 +
        formData.klausimas2 +
        formData.klausimas3
    ) / 3;

    // Isvalome ankstesnius rezultatus
    results.replaceChildren();

    // Sukuriame rezultatu kortele
    const card = document.createElement("div");
    card.className = "info-box";

    const title = document.createElement("h3");
    title.textContent = "Pateikti duomenys";
    card.appendChild(title);

    // Duomenu atvaizdavimo funkcija
    function addResult(label, value) {

        const paragraph = document.createElement("p");

        paragraph.textContent = label + ": " + value;

        card.appendChild(paragraph);

    }

    // Atvaizduojame asmens duomenis
    addResult("Vardas", formData.vardas);
    addResult("Pavardė", formData.pavarde);
    addResult("El. paštas", formData.email);
    addResult("Tel. numeris", formData.telefonas);
    addResult("Adresas", formData.adresas);

    // Atvaizduojame vertinimus
    const subtitle = document.createElement("h4");
    subtitle.textContent = "Įvertinimai";
    card.appendChild(subtitle);

    addResult("1 klausimas", formData.klausimas1);
    addResult("2 klausimas", formData.klausimas2);
    addResult("3 klausimas", formData.klausimas3);

    // Atvaizduojame vidurki
    const average = document.createElement("h4");

    average.textContent =
        formData.vardas + " " +
        formData.pavarde + ": " +
        vidurkis.toFixed(2);

    card.appendChild(average);

    // Idedame rezultatus i puslapi
    results.appendChild(card);

});


// ==========================================
// 5. FORMOS ISVALYMAS
// ==========================================

clearBtn.addEventListener("click", function() {

    // Isvalome visus laukus
    form.reset();

    // Isvalome rezultatus
    results.replaceChildren();

    // Isvalome klaidu pranesimus
    fields.forEach(function(id) {

        const field = document.getElementById(id);
        const error = document.getElementById(id + "Error");

        field.classList.remove("invalid-field");
        field.classList.remove("valid-field");

        error.textContent = "";

    });

    // Mygtukas vel tampa neaktyvus
    submitBtn.disabled = true;

});
