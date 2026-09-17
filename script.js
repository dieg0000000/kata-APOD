//Récupère la date depuis l'URL si elle existe, sinon prend la date du jour
const params = new URLSearchParams(window.location.search);
let date = params.get("date") || today();

//Garde la date en AAAA-MM-JJ (10 premiers elements de la date)
function today() {
  return new Date().toISOString().slice(0, 10);
}

function load() {
  //Empêche d'aller dans le futur
  if (date > today()) {
    date = today();
  }

  //Récupère la clé API dans le champ "Clé API NASA" ou utilise la clé de démo
  const key = document.getElementById("apiKeyInput").value ||  "DEMO_KEY";

  //Met à jour l'URL et le titre de la page avec la date de aujourd'hui
  history.replaceState({}, "", "?date=" + date);
  document.title = "Kata APOD " + date;

  //Récupère les données de l'API APOD pour la date donnée
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${key}&date=${date}`)
    //Si la réponse est OK, on parse le JSON et on met à jour le contenu de la carte
    .then((res) => res.json())
    .then((data) => {
      const media =
        data.media_type === "video"
          ? `<div class="media-wrap"><a href="${data.url}" target="_blank">Voir la vidéo</a></div>`
          : `<div class="media-wrap"><img src="${data.url}"><a class="hd-link" href="${data.hdurl || data.url}" target="_blank">Voir HD</a></div>`;

      //Met à jour le contenu de la carte avec les données de l'API
      card.innerHTML = `
  <p>${data.date}</p>
  <h2>${data.title}</h2>
  <div class="apod-row">
    <button class="button1" onclick="change(-1)"><</button>
    ${media}
    <button class="button2" onclick="change(1)" ${date === today() ? "disabled" : ""}>></button>
  </div>
  <p><b>${data.copyright}</b></p>
  <p>${data.explanation}</p>
`;
    });
}

function change(n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  date = d.toISOString().slice(0, 10);
  load();
}

function share() {
  navigator.clipboard.writeText(location.href);
  alert("Lien copié !");
}

apiKeySave.onclick = load;

load();