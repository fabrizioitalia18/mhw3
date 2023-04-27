function onTokenJson(json){
    console.log(json);
    token = json.access_token;
}


function onBoxOfficeJson(json){
    console.log(json);

    const box_office = document.querySelector('#box_office');

    const risultati = json.items;
    console.log(risultati);
    let numero_risultati = risultati.length;
    if(numero_risultati>5){
        numero_risultati=5;
    }

    for(let i=0; i<numero_risultati; i++){
        const film = risultati[i];
        console.log(film);
        const titolo = film.title;
        console.log(titolo);
        const copertina = film.image;
        const incasso = film.weekend;
        const settimane = film.weeks;

        const main_section = document.createElement('section');
        main_section.classList.add('contenuti');

        const new_numeri=document.createElement('div');
        new_numeri.classList.add('numeri');
        new_numeri.textContent = i+1 + '.';

        const new_paragrafo = document.createElement('div');
        new_paragrafo.classList.add("paragrafo");

        const new_titolo = document.createElement('div');
        new_titolo.classList.add("titoli-paragrafi");
        new_titolo.textContent = titolo;

        const new_settimane = document.createElement('div');
        new_settimane.classList.add('settimane');
        new_settimane.textContent = "Settimane in sala: "+ settimane;

        const new_testo = document.createElement('div');
        new_testo.classList.add('testo');
        new_testo.textContent = "Il film nell'ultimo weekend ha incassato " + incasso;

        const new_img = document.createElement('img');
        new_img.src=copertina;

        new_paragrafo.appendChild(new_titolo);
        new_paragrafo.appendChild(new_settimane);
        new_paragrafo.appendChild(new_testo);
        new_paragrafo.appendChild(new_img);

        main_section.appendChild(new_numeri);
        main_section.appendChild(new_paragrafo);

        box_office.appendChild(main_section);
    }
    
}


function onMusicJson(json){
    console.log(json);

    const vetrina_musica = document.querySelector('#vetrina_musica');

    const musica = document.createElement('div');
    musica.classList.add('musica');
    vetrina_musica.innerHTML = '';

    const new_h1 = document.createElement('h1');
    new_h1.textContent = 'Ecco i brani correlati al film che hai scelto:'
    vetrina_musica.appendChild(new_h1);
    const songs = json.tracks.items;

    if(songs.length===0){
        const new_h1 = document.createElement('h1');
        new_h1.textContent = 'Ci dispiace, la tua ricerca non ha portato ad alcun risultato.';
        vetrina_musica.appendChild(new_h1);
    }


    for(const song of songs){

        const canzone = document.createElement('div');
        canzone.classList.add('canzone');

        const titolo = song.name;
        const img = song.album.images[0].url;
        const artista = song.artists[0].name;
        const link = song.external_urls.spotify;

        console.log(link);
        const new_titolo = document.createElement('div');
        new_titolo.textContent = 'Titolo: ' + titolo;

        const new_img = document.createElement('img');
        new_img.src = img;

        const new_artista = document.createElement('div');
        new_artista.textContent = 'Artista: ' + artista;

        const new_a = document.createElement('a');
        new_a.href = link;
        new_a.textContent = 'Ascoltala su Spotify'
        new_a.target = '_blank';

        canzone.appendChild(new_img);
        canzone.appendChild(new_titolo);
        canzone.appendChild(new_artista);
        canzone.appendChild(new_a);

        musica.appendChild(canzone);

        vetrina_musica.appendChild(musica);
    }

}

function musica(event){
    const button = event.currentTarget;
    const film = button.parentNode.parentNode;
    const titolo = encodeURIComponent(film.childNodes[0].textContent);

    const fetch_url = 'https://api.spotify.com/v1/search/?type=track&q=' + titolo + '&limit=4'
    fetch(fetch_url,
    {   'headers':{
        'Authorization': 'Bearer ' + token
    }
}).then(onResponse).then(onMusicJson);

}


function onSearchJson(json){
    console.log(json);

    const movies = json.results;

    const vetrina = document.querySelector('#vetrina');
    vetrina.innerHTML= '';

    let num_movies = movies.length;

    if(num_movies === 0){
        const new_h1 = document.createElement('h1');
        new_h1.textContent = 'Ci dispiace, la tua ricerca non ha portato ad alcun risultato.';
        vetrina.appendChild(new_h1);
    }

    if(movies.length>6)
        num_movies = 6;


    for(let i=0; i<num_movies; i++){
        const movie = movies[i];
        const titolo = movie.title;
        const img = movie.image;

        const film = document.createElement('div');
        film.classList.add('film');

        const new_titolo = document.createElement('div');
        new_titolo.textContent = titolo;
        
       
        const new_img = document.createElement('img');
        new_img.src = img;

        const new_a = document.createElement('a');
        const button = document.createElement("button");
        button.textContent= 'Cerca brani correlati';
        button.addEventListener('click', musica);
        new_a.href = '#vetrina_musica';

        new_a.appendChild(button);

        film.appendChild(new_titolo);
        film.appendChild(new_img);
        film.appendChild(new_a);

        vetrina.appendChild(film);
    }

}


function onResponse(response){
    return response.json();
}



function search(event){
    event.preventDefault();

    const ricerca = encodeURIComponent(document.querySelector('#search_film').value);

    const vetrina_musica = document.querySelector('#vetrina_musica');
    if(vetrina_musica.childNodes.length !== 0){
        vetrina_musica.innerHTML = '';
    }
    fetch(search_url + key + '/' + ricerca).then(onResponse).then(onSearchJson);
    

}



const client_id = '6ec62a855e4644768984ab41b9862982';
const client_secret= '82660c1dd93f425faace08eb669fabd0';

const url_token = 'https://accounts.spotify.com/api/token'
let token ='';
fetch(url_token,{
    'method': 'post',
    'body': 'grant_type=client_credentials&client_id=' + client_id + '&client_secret=' + client_secret,
    'headers': {
        "Content-Type": "application/x-www-form-urlencoded"
    }
}).then(onResponse).then(onTokenJson)


const key = "k_jx1cf2kl";
const search_url = 'https://imdb-api.com/en/API/Search/';
const box_office_url = "https://imdb-api.com/en/API/BoxOffice/";
fetch(box_office_url + key).then(onResponse).then(onBoxOfficeJson);

const form = document.querySelector('form');
form.addEventListener('submit', search);