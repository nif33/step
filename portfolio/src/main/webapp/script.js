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

const PREV_SLIDE_DIR = -1;
const NEXT_SLIDE_DIR = 1;

class Slideshow {
  constructor(idNum, slides) {
    this.index = 0;
    this.idNum = idNum;
    this.slides = slides;
  }
  changeSlide(direction) { // returns new slide image string
      const deckSize = this.slides.length;
      this.index += direction;
      if(this.index === deckSize) { // wrap around
        this.index = 0;
      }
      else if(this.index === -1) {
        this.index = deckSize - 1;
      }
      return this.slides[this.index];
  }
}

dogSlides = new Slideshow(deckNums.DOG_DECK, ["/images/dog/dog0.jpg", "/images/dog/dog1.jpg", "/images/dog/dog2.jpg"]);
placeSlides = new Slideshow(deckNums.PLACE_DECK, ["/images/place/place0.jpg", "/images/place/place1.jpg", "/images/place/place2.jpg"]);
foodSlides = new Slideshow(deckNums.PLACE_DECK, ["/images/food/food0.jpg", "/images/food/food1.jpg", "/images/food/food2.jpg"]);

document.getElementById("prev-dog-slide-button").onclick = function() {
  const newImage = dogSlides.changeSlide(PREV_SLIDE_DIR);
  document.getElementById("dog-slide").src = newImage;
}

document.getElementById('next-dog-slide-button').onclick = function() {
  const newImage = dogSlides.changeSlide(NEXT_SLIDE_DIR);
  document.getElementById("dog-slide").src = newImage;
}

document.getElementById('prev-place-slide-button').onclick = function() {
  const newImage = placeSlides.changeSlide(PREV_SLIDE_DIR);
  document.getElementById("place-slide").src = newImage;
}

document.getElementById('next-place-slide-button').onclick = function() {
  const newImage = placeSlides.changeSlide(NEXT_SLIDE_DIR);
  document.getElementById("place-slide").src = newImage;
}

document.getElementById('prev-food-slide-button').onclick = function() {
  const newImage = foodSlides.changeSlide(PREV_SLIDE_DIR);
  document.getElementById("food-slide").src = newImage;
}

document.getElementById('next-food-slide-button').onclick = function() {
  const newImage = foodSlides.changeSlide(NEXT_SLIDE_DIR);
  document.getElementById("food-slide").src = newImage;
}