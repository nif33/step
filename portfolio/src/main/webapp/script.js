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
let slideIndices = [0, 0, 0]; // array of slide indices for each slide deck
for(let i = 0; i < slideIndices.length; i++) {
    showSlides(i, slideIndices[i]);
}

function nextSlide(deckNum, direction) {
  showSlides(deckNum, slideIndices[deckNum] += direction);
}

// Returns corresponding class name for given deckNum
function deckNumToName(deckNum) {
  if(deckNum === 0)
    return "dog-slides"
  else if(deckNum == 1)
    return "place-slides"
  else
    return "food-slides"
}

function showSlides(deckNum, slideIndex) {
  const slides = document.getElementsByClassName(deckNumToName(deckNum));

  slideIndex = Math.abs(slideIndex % slides.length) // wrap around index

  for(let i = 0; i < slides.length; i++) { // display none except current index
      slides[i].style.display = "none";  
  }
  slides[slideIndex].style.display = "block";
}
