// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */
function addRandomFact() {
  const facts =
      ['I have a pet dog!', 'I like to code!', 'Marquees are my favourite HTML element!'];

  // Pick a random fact.
  const fact = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  const factContainer = document.getElementById('fact-container');
  factContainer.innerText = fact;
}

/**
 * Controls slideshow image display on the page
 */
const deckNums = { // Enumerate slide decks
  DOG_DECK: 0,
  PLACE_DECK: 1,
  FOOD_DECK: 2,
};

const SLIDES = {
  DOG_DECK: ["/images/dog/dog0.jpg", "/images/dog/dog1.jpg", "/images/dog/dog2.jpg"],
  PLACE_DECK: ["/images/place/place0.jpg", "/images/place/place1.jpg", "/images/place/place2.jpg"],
  FOOD_DECK: ["/images/food/food0.jpg", "/images/food/food1.jpg", "/images/food/food2.jpg"],
};

const PREV_SLIDE_DIR = -1;
const NEXT_SLIDE_DIR = 1;
let slideIndices = [0, 0, 0]; // array of slide indices for each slide deck

function preloadImages()
{
    for(let i = 0; i < SLIDES.length; i++) {
        for(let j = 0; j < SLIDES[i].length; j++) {
            var img = new Image();
            img.src = SLIDES[i][j];
        }
    }
}

function changeSlide(deck, deckNum, direction) {
  let slideIndex = slideIndices[deckNum];
  slideIndex += direction;
  if(slideIndex === deck.length) { // wrap around
      slideIndex = 0;
  }
  else if(slideIndex === -1) {
      slideIndex = deck.length - 1;
  }
  slideIndices[deckNum] = slideIndex;
}

preloadImages();

document.getElementById("prev-dog-slide-button").onclick = function() {
  changeSlide(SLIDES.DOG_DECK, deckNums.DOG_DECK, PREV_SLIDE_DIR);
  document.getElementById("dog-slide").src = SLIDES.DOG_DECK[slideIndices[deckNums.DOG_DECK]];
}

document.getElementById('next-dog-slide-button').onclick = function() {
  changeSlide(SLIDES.DOG_DECK, deckNums.DOG_DECK, NEXT_SLIDE_DIR);
  document.getElementById("dog-slide").src = SLIDES.DOG_DECK[slideIndices[deckNums.DOG_DECK]];
}

document.getElementById('prev-place-slide-button').onclick = function() {
  changeSlide(SLIDES.PLACE_DECK, deckNums.PLACE_DECK, PREV_SLIDE_DIR);
  document.getElementById("place-slide").src = SLIDES.PLACE_DECK[slideIndices[deckNums.PLACE_DECK]];
}

document.getElementById('next-place-slide-button').onclick = function() {
  changeSlide(SLIDES.PLACE_DECK, deckNums.PLACE_DECK, NEXT_SLIDE_DIR);
  document.getElementById("place-slide").src = SLIDES.PLACE_DECK[slideIndices[deckNums.PLACE_DECK]];
}

document.getElementById('prev-food-slide-button').onclick = function() {
  changeSlide(SLIDES.FOOD_DECK, deckNums.FOOD_DECK, PREV_SLIDE_DIR);
  document.getElementById("food-slide").src = SLIDES.FOOD_DECK[slideIndices[deckNums.FOOD_DECK]];
}

document.getElementById('next-food-slide-button').onclick = function() {
  changeSlide(SLIDES.FOOD_DECK, deckNums.FOOD_DECK, NEXT_SLIDE_DIR);
  document.getElementById("food-slide").src = SLIDES.FOOD_DECK[slideIndices[deckNums.FOOD_DECK]];
}