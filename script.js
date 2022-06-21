const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

const count = 10;
let page = 1;

// Proxy cross server
const proxyUrl = 'https://murmuring-inlet-62825.herokuapp.com/'

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages || imagesLoaded > 4) {
    ready = true;
    loader.hidden = true;
    imagesLoaded = 0;
  }
}

// Helper Function to Set Attributes on DOM Elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create Elements For Links & Photos, Add to DOM
function displayPhotos() {
  totalImages = photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    // Create <a> to link Unsplash
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.download_url,
      target: '_blank',
    });
    // Create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.download_url,
      alt: photo.author,
      title: photo.author,
    });
    // Event Listener, check when each is finished loading
    img.addEventListener('load', imageLoaded);
    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  page = Math.floor(Math.random() * 100);
  try {
    // Picsum API
    const apiUrl = `https://picsum.photos/v2/list?page=${page}&limit=${count}`;
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    page++
    displayPhotos();
  } catch (error) {
    console.log('Ops... ',error);
  }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos();