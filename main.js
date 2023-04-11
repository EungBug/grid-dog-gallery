import axios from 'axios';

const GALLERY_COUNT = 15;

const containerEl = document.querySelector('.container');

function setMasonryLayout() {
  let items = containerEl.querySelectorAll('.grid-item');
  items.forEach(function (item) {
    const rowHeight = parseInt(window.getComputedStyle(containerEl).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(containerEl).getPropertyValue('grid-row-gap'));
    const rowSpan = Math.floor((item.querySelector('.image').offsetHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = 'span ' + rowSpan;
  });
  containerEl.classList.add('show');
}

async function initGallery() {
  const data = await requestDogImages();
  const images = data.message;

  images.forEach(function (image) {
    const item = document.createElement('div');
    item.classList.add('grid-item');
    item.innerHTML = `<img src="${image}" alt="" class="image"/>`;
    containerEl.append(item);
  });

  imagesLoaded(containerEl, () => {
    setMasonryLayout();
  });
}

async function requestDogImages() {
  const res = await axios({
    url: `https://dog.ceo/api/breeds/image/random/${GALLERY_COUNT}`,
    method: 'GET'
  });

  return res.data;
}

initGallery();
