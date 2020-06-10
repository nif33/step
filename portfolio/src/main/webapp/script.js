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
 * Adds a random fact to the page.
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
 * Adds a new Comment Box to the page
 */
function newCommentBox(comment){
  // create comment elements
  const commentBox = document.createElement('div');
  const commentName = document.createElement('p');
  const commentText = document.createElement('p');
  const reportComment = document.createElement('a');

  // set info for elements
  commentName.innerText = comment.name + ':';
  commentText.innerText = comment.text;
  reportComment.innerText = "Report";
  reportComment.onclick = function() {
    addReport(comment.id);
  };

  // append elements to comment box
  commentBox.className = 'comment'
  commentBox.appendChild(commentName);
  commentBox.appendChild(commentText);
  commentBox.appendChild(reportComment);
  return commentBox;
}

function addReport(id) {
  const request = new Request(`/report?id=${id}`, {method: 'POST'});
  fetch(request).then((response) => {
    alert("Your report will be processed.");
  });
}

function clearChildren(dom) {
  while(dom.lastElementChild) {
    dom.removeChild(dom.lastElementChild);
  }
}

/**
 * Loads comments to the page
 */
function loadComments() {
  const commentContainer = document.getElementById('comment-container');
  const limit = document.getElementById("limit").value;

  // Clear previous children
  clearChildren(commentContainer);

  // Repopulate comment section
  fetch(`/data?limit=${limit}`).then(response => response.json()).then((comments) => {
    for(const comment of comments) {
      commentContainer.appendChild(newCommentBox(comment));
    }
  });
}

function shouldDelete() {
  var inputWord = prompt('What\'s the magic word?');
  if (inputWord == 'please') {
    alert('Comments have been deleted.')
    return true;
  } else {
    alert('That word is not magic.');
    return false;
  }
}

/**
 * Deletes all the comments from the page
 */
 function deleteComments() {
   if (!shouldDelete()) {
      return;
   }

   const commentContainer = document.getElementById('comment-container');
   const request = new Request('/delete-data', {method: 'POST'});

   fetch(request).then(() => {
     clearChildren(commentContainer);
   });
 }

/**
 * Add a new comment to the page from form input
 */
function addComment() {
  const commentContainer = document.getElementById('comment-container');
  const nameInput = document.getElementById("name-input").value;
  const commentInput = document.getElementById("comment-input").value;
  const request = new Request(
    `/data?name-input=${nameInput}&comment-input=${commentInput}`,
    {method: 'POST'}
  );
  fetch(request).then(() => {
    loadComments();
  });
}

function verifyDelete() {
  var inputWord = prompt('What\'s the magic word?');
  if (inputWord == 'please') {
    alert('Comments have been deleted.')
    return true;
  }
  alert('That word is not magic.');
  return false;
}

/**
 * Deletes all the comments from the page
 */
 function deleteComments() {
   if (!verifyDelete()) {
      return;
   }

   const commentContainer = document.getElementById('comment-container');
   const request = new Request('/delete-data', {method: 'POST'});

   fetch(request).then(() => {
     clearChildren(commentContainer);
   });
 }

/**
 * Controls slideshow image display on the page
 */
const PREV_SLIDE_DIR = -1;
const NEXT_SLIDE_DIR = 1;

class Slideshow {
  constructor(slides, slideshowDOM) {
    this.index = 0;
    this.slides = slides;
    this.slideshowDOM = slideshowDOM;
    this.prevButton = this.slideshowDOM.querySelector(".prev-slide-button");
    this.nextButton = this.slideshowDOM.querySelector(".next-slide-button");
    this.addButtons();
    this.preloadImages();
  }
  changeSlide(direction) {
    const deckSize = this.slides.length;
    this.index += direction;
    this.index = (this.index % deckSize + deckSize) % deckSize; // wrap around
    const imageDOM = this.slideshowDOM.querySelector("img");
    imageDOM.src = this.slides[this.index];
  }
  addButtons() {
    this.prevButton.onclick = () => {
      this.changeSlide(PREV_SLIDE_DIR);
    };
    this.nextButton.onclick = () => {
      this.changeSlide(NEXT_SLIDE_DIR);
    };
  }
  preloadImages() {
    for(const slide of this.slides) {
      var img = new Image();
      img.src = slide;
    }
  }
}

dogSlides = new Slideshow(
  ["/images/dog/dog0.jpg", "/images/dog/dog1.jpg", "/images/dog/dog2.jpg"],
  document.querySelector('.dog-slideshow'));

placeSlides = new Slideshow(
  ["/images/place/place0.jpg", "/images/place/place1.jpg", "/images/place/place2.jpg"],
  document.querySelector('.place-slideshow'));

foodSlides = new Slideshow(
  ["/images/food/food0.jpg", "/images/food/food1.jpg", "/images/food/food2.jpg"],
  document.querySelector('.food-slideshow'));
