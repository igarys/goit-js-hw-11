import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';
// Opisany w dokumentacji
import SimpleLightbox from "simplelightbox";
// Dodatkowy import stylów
import "simplelightbox/dist/simple-lightbox.min.css";

// const axios = require('axios/dist/node/axios.cjs');
const API_URL = "https://pixabay.com/api/";
const searchBtn = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search-input');
const galleryEl = document.querySelector('.gallery');
const loadMore = document.querySelector(".btn-container");
const searchForm = document.querySelector(".search-form")

let page = 1;
let per_page = 40;


async function fetchImg() {
  
    try {
        q = searchInput.value;
        console.log(q)
        const getImg = await axios.get(
            `${API_URL}?key=36079957-3576dde99500ac3aadc903693&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`
            );
         console.log(getImg.data.hits);
         return getImg.data;
    } catch (error) {
        console.log('ERROR');
    }
};
 
async function notify() {
     q = searchInput.value;
    const getImg = await fetchImg();
        if (getImg.totalHits === 0  ||  q === "") {
            loadMore.classList.add('hidden');
            galleryEl.innerHTML = '';

            Notiflix.Notify.failure(
                `Sorry, there are no images matching your search query. Please try again.`
            );
                    
                console.log('NO VALUE');
            } else {
                const totalHits = getImg.totalHits;
                Notiflix.Notify.success(
                    `Hooray! We found ${totalHits} images.`
                    )
                    
    } 
    
}
searchBtn.addEventListener("click", notify);

async function createCards(e) {
    e.preventDefault();
    const images = await fetchImg();
    if (searchInput.value === "" || images.totalHits === 0) {
        galleryEl.innerHTML = "";    
            loadMore.classList.add('hidden');

        console.log("clear loading btn")
    } else {
        loadMore.classList.remove("hidden");
        galleryEl.innerHTML = images.hits
        .map(
            image =>
            `<div class="photo-card">
            <a class="link" href=${image.largeImageURL}><img src=${image.largeImageURL}" alt="" title=${image.tags}/>
            <img class="img" width="355"  src=${image.webformatURL} alt=${image.tags} loading="lazy" /></a>
            <div class="info">
            <p class="info-item">
            <b>Likes:</b> ${image.likes}
            </p>
            <p class="info-item">
            <b>Views:</b> ${image.views}
                            </p>
                            <p class="info-item">
                            <b>Comments: </b>${image.comments}
                            </p>
                            <p class="info-item">
                            <b>Downloads:</b> ${image.downloads}
                            </p>
                            </div>
                            </div>
                            `
                            )
                            .join(' ');
                        }
                        searchForm.removeAddEventListener;
                    };
                    
                    const lightbox = new SimpleLightbox(".gallery a", {
                        caption: true,
                        captionsData: "alt",
                        captionDelay: 250,
                    });
                    
    searchBtn.addEventListener("click", createCards);
                    
                    // const loading = (e) => {
                        //     e.preventDefault();
                        //     page++;
                        //     createCards;
                        // }
loadMore.addEventListener('click', loading);

async function loading(e) {
    e.preventDefault();
    page++;
    const newCards = await fetchImg();
    if (page > newCards.totalHits / per_page ) {
        Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
        );
    }
    galleryEl.insertAdjacentHTML('beforeend', createCards(e));
};