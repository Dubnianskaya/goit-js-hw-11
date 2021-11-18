import './sass/main.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PicturesApiService from "./helpers/search-picture";
import galleryTpl from "./templates/gallery-markup.hbs"

const picturesApiService = new PicturesApiService();

const refs = {
    submitForm: document.querySelector(".search-form"),
    loadMoreBtn: document.querySelector(".load-more"),
    galleryContainer: document.querySelector(".gallery"),
    endOfGallery: document.querySelector(".finish"),
}

refs.submitForm.addEventListener("submit", onFormSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMore);

function onFormSubmit(event) {
    event.preventDefault();
    picturesApiService.query = event.currentTarget.elements.searchQuery.value.trim();
    if (picturesApiService.query === "") {
        refs.galleryContainer.innerHTML = "";
        hideLoading()
        return Notiflix.Notify.failure("Введите запрос в строку.");  
    }
    picturesApiService.resetPage();
    picturesApiService.getPictures().then(hits => {
        refs.galleryContainer.innerHTML = "";
        if (picturesApiService.totalImages === 0) {
            hideLoading();
            return Notiflix.Notify.failure("Извините, мы не нашли ничего соответсвующего вашему запросу. Попробуйте еще раз.");
        } 
        createGalleryMarkup(hits);
        let gallery = new SimpleLightbox(".gallery a");
        gallery.refresh()
        Notiflix.Notify.success(`Ура! Мы нашли ${picturesApiService.totalImages} картинок для бесплатного просмотра.`);
        refs.loadMoreBtn.classList.remove("hidden");
        refs.endOfGallery.classList.add("hidden");
        endOfCollection (picturesApiService.totalImages, picturesApiService.perPage, picturesApiService.page) 
    })
}

function onLoadMore() {
    picturesApiService.getPictures().then(hits => {
        createGalleryMarkup(hits);
        let gallery = new SimpleLightbox(".gallery a");
        gallery.refresh()
        endOfCollection (picturesApiService.totalImages, picturesApiService.perPage, picturesApiService.page) 
    })
}

function createGalleryMarkup(hits) {
refs.galleryContainer.insertAdjacentHTML("beforeend", galleryTpl(hits));
}

function endOfCollection (imagesAmmount, imagesPerPage, currentPage) {
 const lastPage = 1 + Math.ceil(imagesAmmount / imagesPerPage);
 if (currentPage >= lastPage) {
     refs.endOfGallery.classList.remove("hidden");
     refs.loadMoreBtn.classList.add("hidden");
 }
}

function hideLoading() {
    refs.endOfGallery.classList.add("hidden");
    refs.loadMoreBtn.classList.add("hidden");
}


