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

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

/*
 * Counts the number of times each city occurs in a list of markers. Returns {[city, count],...}
 */
function countMarkers(markers) {
  const markerCounts = {};
  for(marker of markers) {
    const city = marker.city;
    if(markerCounts[city] == null) {
      markerCounts[city] = 0;
    }
    markerCounts[city] += 1
  }
  return markerCounts;
}

/*
 * Creates a chart and adds it to the page.
 */
function drawChart() {
  fetch('/markers')
  .then(response => response.json())
  .then(markers => countMarkers(markers))
  .then((markerCounts) => {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'City');
    data.addColumn('number', 'Count');
    Object.keys(markerCounts).forEach((city) => {
      data.addRow([city, markerCounts[city]]);
    });

    const options = {
      width: 800,
      height: 500,
      legend: 'none',
      colors: ['#778899'],
    };

    const chart = new google.visualization.BarChart(document.getElementById('chart'));
    chart.draw(data, options);
  });
}

/**
 * Creates a map and adds it to the page
 */
function initMap() {
  const styledMapType = new google.maps.StyledMapType(
    [
      {
        'featureType': 'landscape.man_made',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#ffe4e1'
          }
        ]
      },
      {
        'featureType': 'landscape.natural',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#d5e9dd'
          }
        ]
      },
      {
        'featureType': 'poi.park',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#c5e5e0'
          }
        ]
      },
      {
        'featureType': 'road.highway',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#c3dbf2'
          }
        ]
      },
      {
        'featureType': 'road.highway',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'color': '#778899'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#d3f0fa'
          }
        ]
      }
    ],
  {name: 'Styled Map'});

  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.250, lng: -122.982},
    zoom: 11,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'styled_map']
    }
  });

  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  map.addListener('click', (event) => {
    lat = event.latLng.lat();
    lng = event.latLng.lng();
    const infoWindow = new google.maps.InfoWindow({content: buildInfoWindow(lat, lng)});
    const visitorMarker = createVisitorMarker(map, lat, lng, infoWindow);
  });

  addMyMapMarkers(map);
  addVisitorMarkers(map);
}

/** Fetches markers from the backend and adds them to the map. */
function addVisitorMarkers(map) {
  fetch('/markers').then(response => response.json()).then((markers) => {
    for(marker of markers){
      const visitorMarker = new google.maps.Marker({
        title: 'A visitor is from here!',
        position: {lat: marker.lat, lng: marker.lng},
        map: map
      });
    }
  });
}

/** Creates a marker where visitors can submit. */
function createVisitorMarker(map, lat, lng, infoWindow) {
  const visitorMarker = new google.maps.Marker({position: {lat: lat, lng: lng}, map: map});

  google.maps.event.addListener(infoWindow, 'closeclick', () => {
    visitorMarker.setMap(null);
  });

  infoWindow.open(map, visitorMarker);
}

/**
 * Builds and returns HTML elements that show submit button
 */
function buildInfoWindow(lat, lng) {
  const prompt = document.createElement('p');
  const textBox = document.createElement('textarea');
  const button = document.createElement('button');
  prompt.innerText = "What city are you visiting from?";
  button.innerText = "I'm here!";

  button.onclick = () => {
    postMarker(lat, lng, textBox.value);
  };

  const containerDiv = document.createElement('div');
  containerDiv.appendChild(prompt);
  containerDiv.appendChild(textBox);
  containerDiv.appendChild(button);

  return containerDiv;
}

/*
 * Sends a marker to the backend for saving.
 */
function postMarker(lat, lng, city) {
  const params = new URLSearchParams();
  params.append('lat', lat);
  params.append('lng', lng);
  params.append('city', city);

  fetch('/markers', {method: 'POST', body: params}).then((response) => {
    alert("Thanks for visiting!");
  });
}

/*
 * Adds hard-coded marker locations to map
 */
function addMyMapMarkers(map){
  const locations = [
    {
      name: 'My School',
      coords: {lat: 49.278, lng: -122.914},
      info: 'This is my school, Simon Fraser University, it is on a mountain which means it takes 20 minutes just to commute up the mountain!'
    }, {
      name: 'My Favourite Cafe',
      coords: {lat: 49.221, lng: -122.995},
      info: 'This is a great study spot on weekdays but on weekends it is far too busy and loud.'
    }, {
      name: 'My Favourite Park',
      coords: {lat: 49.124, lng: -123.184},
      info: 'I see swans and seals here sometimes. Also there is a great ice cream shop here.'
    }
  ];

  for(const location of locations){
    // create DOM element for infowindow
    const infoText = document.createElement('p');
    const title = document.createElement('strong');
    title.appendChild(document.createTextNode(location.name));
    infoText.appendChild(title);
    infoText.appendChild(document.createElement('br'));
    infoText.appendChild(document.createTextNode(location.info));

    const infoWindow = new google.maps.InfoWindow({
      content: infoText
    });

    const marker = new google.maps.Marker({
      title: location.name,
      position: location.coords,
      map: map
    });

    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });
  }
}

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
  reportComment.innerText = 'Report';
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
    alert('Your report will be processed.');
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
  const limit = document.getElementById('limit').value;

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
    this.prevButton = this.slideshowDOM.querySelector('.prev-slide-button');
    this.nextButton = this.slideshowDOM.querySelector('.next-slide-button');
    this.addButtons();
    this.preloadImages();
  }
  changeSlide(direction) {
    const deckSize = this.slides.length;
    this.index += direction;
    this.index = (this.index % deckSize + deckSize) % deckSize; // wrap around
    const imageDOM = this.slideshowDOM.querySelector('img');
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
  ['/images/dog/dog0.jpg', '/images/dog/dog1.jpg', '/images/dog/dog2.jpg'],
  document.querySelector('.dog-slideshow'));

placeSlides = new Slideshow(
  ['/images/place/place0.jpg', '/images/place/place1.jpg', '/images/place/place2.jpg'],
  document.querySelector('.place-slideshow'));

foodSlides = new Slideshow(
  ['/images/food/food0.jpg', '/images/food/food1.jpg', '/images/food/food2.jpg'],
  document.querySelector('.food-slideshow'));
