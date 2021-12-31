import View from './View.js';
import icons from '../../img/icons.svg'; //Pacel 1
// import icons from 'url:../../img/icons.svg'; //Parcel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was sucessfully uploaded:)';
  _overlay = document.querySelector('.overlay');
  _windodw = document.querySelector('.add-recipe-window ');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleEvent() {
    this._overlay.classList.toggle('hidden');
    this._windodw.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleEvent.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleEvent.bind(this));
    this._overlay.addEventListener('click', this.toggleEvent.bind(this));
  }

  addHandlerUploadRecipe(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }
  _generateMarkup() {}
}
export default new AddRecipeView();
