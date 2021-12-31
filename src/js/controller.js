// const { isDataView } = require('util/types');
import * as model from './model.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { MODAL_ClOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //0)Upate results view to mark selected search results
    resultsView.update(model.getSearchResult());
    //updating bookmarks view

    bookmarksView.update(model.state.bookmarks);

    //1) loading Recipe
    await model.loadRecipe(id);

    //2) rendering recipe;
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1) search query
    const query = searchView.getQuery();

    if (!query) return;
    //2)load search result
    await model.loadSearchResults(query);

    //3) render results

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResult());

    //4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //Render New Results
  resultsView.render(model.getSearchResult(goToPage));

  //Render New Pagination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  //update the recipe serivng (in state)
  model.updateServings(newServings);
  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  //add or remove recipe to bookmark
  else model.deletBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  //update the recipe view
  recipeView.update(model.state.recipe);
  //render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading Spinner
    addRecipeView.renderSpinner();

    //Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    // suceess message
    addRecipeView.renderMessage();

    //Rerender bookmarksView
    bookmarksView.render(model.state.bookmarks);

    //Change ID in ther URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

    //close the form
    setTimeout(function () {
      addRecipeView.toggleEvent();
    }, MODAL_ClOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServing);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  searchView.addHandlerSeach(controlSearchResults);
  paginationView.addHandlerPagnation(controlPagination);
  addRecipeView.addHandlerUploadRecipe(controlAddRecipe);
};

init();
console.log('Welcome');
