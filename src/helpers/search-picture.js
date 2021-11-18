import axios from 'axios';
import Notiflix from 'notiflix';

export default class PicturesApiServise {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
        this.perPage = 40;
        this.totalImages = 0;
    }
    async getPictures() {
        const KEY = "24391071-3bb2721b0275ed041db341680"
        axios.defaults.baseURL = "https://pixabay.com/api/";
        try {
        const {data} = await axios.get(`?key=${KEY}&q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}&image_type=photo&orientation=horizontal&safesearch=true`);
        this.totalImages = data.totalHits;
        this.incrementPage();
        return data.hits;
        } catch(error) {
            alert(error.message)
        }

    }

    incrementPage() {
        this.page +=1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuerry) {
        this.searchQuery = newQuerry;
    }
}