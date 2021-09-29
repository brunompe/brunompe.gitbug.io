const URL_ROOT = "https://api.adzuna.com/v1/api";
const APPLICATION_ID = "17b53278";
const APPLICATION_KEYS = "f2796d62235042b6c9c808a32e6b3241";

const form_header_option = document.querySelector(".btn-submit");
const input_job = document.querySelector(".input-job");
const input_location = document.querySelector(".input-location");
const div_results = document.querySelector(".results");
const selected_job = document.querySelector(".selected-job");
const input_number = document.querySelector('#input-number');
const loading = document.querySelector('.loading');
const h3_modal = document.querySelector('.modal-title');
const modal_body = document.querySelector('.modal-body');
const company_modal = document.querySelector('.company');
const category_modal = document.querySelector('.category');
const location_modal = document.querySelector('.location');
const contract_time_modal = document.querySelector('.contract-time');
const description_modal = document.querySelector('.description');
const salary_min_modal = document.querySelector('.salary-min');
const salary_max_modal = document.querySelector('.salary-max');
const redirect_url_modal = document.querySelector('.redirect-url-modal');

let job;
let country;
let numberPerPage;
let data;

function takeInputsData(event) {
  event.preventDefault();
  loading.innerHTML = 'Loading...';
  job = input_job.value.replace(" ", "%20").toLowerCase();
  country = input_location.value;
  if (input_number.value > 0) {
    numberPerPage = input_number.value;
  } else {
    numberPerPage = 20;
  }
  clear();
  makeRequest(job, country, numberPerPage);
}

function addEventOnButtons() {
  form_header_option.addEventListener("click", takeInputsData);
}


function clear() {
  div_results.innerHTML = "";
}
function findIncomplete(string) {
  if (string.endsWith('\u2026')) {
    array = string.split(/\.|;/).filter((str) => str.length > 0);
    array.splice(array.length - 1, 1);
    return array.join(".").concat(".");
  }
  return string;
}

function createAllElementsOfPopUp() {
  const newH2 = document.createElement('h2');
  const paragraphCategory = document.createElement('p');
  const paragraphLocation = document.createElement('p');
  const paragraphDescription = document.createElement('p');
  return { newH2, paragraphCategory, paragraphLocation, paragraphDescription };
}

function createPopUpDetails({ title, description, location, category, company, contract_time, salary_min, salary_max, redirect_url }) {
  h3_modal.innerText = title;
  company_modal.innerHTML = `<b>Empresa:</b> ${company.display_name ? company.display_name : 'Não Listada'}`;
  category_modal.innerHTML = `<b>Categoria:</b> ${category.label ? category.label : 'Indefinida'}`;
  location_modal.innerHTML = `<b>Local:</b> ${location.display_name ? location.display_name : 'Não declarado'}`;
  contract_time_modal.innerHTML = `<b>Período:</b> ${contract_time ? contract_time : 'Indefinido'}`;
  description_modal.innerHTML = `<b>Descrição da vaga:</b> ${findIncomplete(description)}`;
  salary_min_modal.innerHTML = `<b>Salário mínimo estimado:</b> ${salary_min ? salary_min : 'A combinar.'}`;
  salary_max_modal.innerHTML = `<b>Salário máximo estimado:</b> ${salary_max ? salary_max : 'A combinar.'}`;
  redirect_url_modal.href = redirect_url;
}

function moreInfo(event) {
  let id;
  if (event.target.className === "job-card") {
    id = event.target.id;
  } else {
    id = event.target.closest(".job-card").id;
  }
  const jobObj = data.find((job) => {
    return job.id === id;
  });
  createPopUpDetails(jobObj);
}

function createJobTitle(result) {
  const jobTitle = document.createElement("h3");
  jobTitle.className = "job-title";
  jobTitle.innerText = result.title;
  return jobTitle;
}

function createJobLocation(result) {
  const jobLocation = document.createElement("p");
  jobLocation.className = "job-location";
  const jobLocationText = result.location.display_name;
  if (jobLocationText) {
    jobLocation.innerText = `Local: ${jobLocationText}`;
  } else {
    jobLocation.innerText = "Empresa: Não listada";
  }
  return jobLocation;
}

function createJobCompany(result) {
  const jobCompany = document.createElement("p");
  jobCompany.className = "job-company";
  const resultCompanyName = result.company.display_name;
  if (resultCompanyName) {
    jobCompany.innerText = `Empresa: ${resultCompanyName}`;
  } else {
    jobCompany.innerText = "Empresa: Não listada";
  }
  return jobCompany;
}

function createDiv(result) {
  const div = document.createElement("div");
  div.className = "job-card";
  div.setAttribute('data-bs-toggle', 'modal');
  div.setAttribute('data-bs-target', '#job-modal');
  div.id = result.id;
  div.addEventListener("click", moreInfo);
  return div;
}

function divChildCard() {
  const div = document.createElement("div");
  div.className = "div-company-location";
  return div;
}

function makeCards(result) {
  const div = createDiv(result);
  const divChild = divChildCard();
  const title = createJobTitle(result);
  const company = createJobCompany(result);
  const local = createJobLocation(result);
  div.appendChild(title);
  div.appendChild(divChild);
  divChild.appendChild(local);
  divChild.appendChild(company);
  loading.innerHTML = '';
  div_results.style.border = '3px solid rgb(62, 66, 75)';
  div_results.appendChild(div);
}

async function makeRequest(job, country, numberPerPage) {
  const fetchRequest = await fetch(
    `${URL_ROOT}/jobs/${country}/search/1?app_id=${APPLICATION_ID}&app_key=${APPLICATION_KEYS}&results_per_page=${numberPerPage}&what=${job}&content-type=application/json`
  );
  const response = await fetchRequest.json();
  data = response.results;
  data.forEach((result) => makeCards(result));
  // console.log(data);
}

window.onload = async () => {
  await makeRequest("javascript%20developer", "br", 20);
  addEventOnButtons();
};
