import axios from 'axios';

const GALLERY_COUNT = 15;

const containerEl = document.querySelector('.container');
const loadingBarEl = document.querySelector('.loading-bar');

// 피드백 반영 > loading 같은 경우 처음부터 돌리는 것이 아닌 fetch가 시작 됐을 때 돌리는 것이 유지보수에 더 효과적임.
let isLoading = false;

function setMasonryLayout() {
  let items = containerEl.querySelectorAll('.grid-item');
  items.forEach(function (item) {
    const rowHeight = parseInt(window.getComputedStyle(containerEl).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(containerEl).getPropertyValue('grid-row-gap'));
    const rowSpan = Math.floor((item.querySelector('.image').offsetHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = 'span ' + rowSpan;
  });
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

// Promise class를 사용해서 비동기 처리
function initGalleryImages(images) {
  return new Promise(resolve => {
    console.log(images);
    images.forEach(function (image) {
      const item = document.createElement('div');
      item.classList.add('grid-item');
      item.innerHTML = `<img src="${image}" alt="" class="image"/>`;
      containerEl.append(item);
    });
    imagesLoaded(containerEl, () => {
      resolve();
    });
  });
}

async function requestDogImages() {
  const res = await axios({
    url: `https://dog.ceo/api/breeds/image/random/${GALLERY_COUNT}`,
    method: 'GET'
  });

  return res.data;
}

// fetch, Promise 사용
function requestDogImagesWithFetch() {
  // 데이터를 가져올 때 로딩 돌리기
  loadingBarEl.classList.toggle('show');

  return new Promise((resolve, reject) => {
    fetch(`https://dsog.ceo/api/breeds/image/random/${GALLERY_COUNT}`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(res => {
        resolve(res.message);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// initGallery();
requestDogImagesWithFetch()
  .then(images => initGalleryImages(images))
  .then(setMasonryLayout)
  .catch(error => {
    console.log(`error 발생 >>> ${error}`);
    alert('사진을 불러오는 데 실패했습니다.');
  })
  .finally(() => {
    isLoading = false;
    containerEl.classList.add('show');
    loadingBarEl.classList.toggle('show');
  });
