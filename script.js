
const canvas = document.getElementById('passCardCanvas');
const ctx = canvas.getContext('2d');

const nameInput = document.getElementById('nameInput');
const snsInput = document.getElementById('snsInput');
const imageUpload = document.getElementById('imageUpload');
const date20Checkbox = document.getElementById('date20');
const date21Checkbox = document.getElementById('date21');
const downloadButton = document.getElementById('downloadButton');
const tweetLink = document.getElementById('tweetLink');

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let baseImage = new Image();
let userImage = null;
let baseImageLoaded = false;
let baseImages = {};
let allImagesLoaded = false;

function preloadImages() {
  const urls = ['VkketReal25W-20.webp', 'VkketReal25W-21.webp', 'VkketReal25W-20_21.webp'];
  let loadedCount = 0;
  urls.forEach(url => {
    const img = new Image();
    img.onload = () => {
      baseImages[url] = img;
      loadedCount++;
      if (loadedCount === urls.length) {
        allImagesLoaded = true;
        loadBaseImage(); // 初期読み込み
      }
    };
    img.src = url;
  });
}

function getImageUrl() {
    const date20 = document.getElementById('date20').checked;
    const date21 = document.getElementById('date21').checked;
    if (date20 && date21) {
        return 'VkketReal25W-20_21.webp';
    } else if (date20) {
        return 'VkketReal25W-20.webp';
    } else if (date21) {
        return 'VkketReal25W-21.webp';
    } else {
        // デフォルトは両方
        return 'VkketReal25W-20_21.webp';
    }
}

function loadBaseImage() {
    if (allImagesLoaded) {
        baseImage = baseImages[getImageUrl()];
        baseImageLoaded = true;
        redrawCanvas();
    } else {
        // フォールバック: まだプリロードされていない場合
        const img = new Image();
        img.onload = function() {
            baseImage = img;
            baseImageLoaded = true;
            redrawCanvas();
        };
        img.src = getImageUrl();
    }
}

function redrawCanvas() {
  if (!baseImageLoaded) {
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = 'black';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ベース画像を読み込んでいます...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    return;
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.drawImage(baseImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw User Image 
  if (userImage) {
    const imgX = 755, imgY = 23, imgWidth = 394, imgHeight = 394;
    let sWidth = userImage.width;
    let sHeight = userImage.height;
    let sx = 0;
    let sy = 0;
    const imgAspectRatio = userImage.width / userImage.height;
    const boxAspectRatio = imgWidth / imgHeight;

    if (imgAspectRatio > boxAspectRatio) {
      sHeight = userImage.height;
      sWidth = sHeight * boxAspectRatio;
      sx = (userImage.width - sWidth) / 2;
    } else {
      sWidth = userImage.width;
      sHeight = sWidth / boxAspectRatio;
      sy = (userImage.height - sHeight) / 2;
    }
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgWidth, imgHeight, 22);
    ctx.clip();
    ctx.drawImage(userImage, sx, sy, sWidth, sHeight, imgX, imgY, imgWidth, imgHeight);
    ctx.restore();
  }

  // Draw Name
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(nameInput.value || '', 334, 475);

  // Draw SNS
  ctx.fillText(snsInput.value || '',334, 585);

  // Draw Date Selections
  ctx.strokeStyle = '#FF3B7F';
  ctx.lineWidth = 8;
  // const circleRadius = 60;
  // const dateCircleY = 585;

  // if (date20Checkbox.checked) {
  //   ctx.beginPath();
  //   ctx.arc(888, dateCircleY, circleRadius, 0, Math.PI * 2);
  //   ctx.stroke();
  // }
  // if (date21Checkbox.checked) {
  //   ctx.beginPath();
  //   ctx.arc(1022, dateCircleY, circleRadius, 0, Math.PI * 2);
  //   ctx.stroke();
  // }
}

function updateTweetLink() {
  let tweetText = "VketReal 2025 Winterに参加します!";
  if (date20Checkbox.checked && date21Checkbox.checked) {
    tweetText = "VketReal 2025 Winterに12月20日と21日で参加します!";
  } else if (date20Checkbox.checked) {
    tweetText = "VketReal 2025 Winterに12月20日に参加します!";
  } else if (date21Checkbox.checked) {
    tweetText = "VketReal 2025 Winterに12月21日に参加します!";
  }
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=VketReal参加&url=https://2025w.imagecreator.vrugd.jp/`;
  tweetLink.href = tweetUrl;
}

nameInput.addEventListener('input', redrawCanvas);
snsInput.addEventListener('input', redrawCanvas);
date20Checkbox.addEventListener('change', () => {
  loadBaseImage();
  updateTweetLink();
});
date21Checkbox.addEventListener('change', () => {
  loadBaseImage();
  updateTweetLink();
});

imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      userImage = new Image();
      userImage.onload = () => {
        redrawCanvas();
      };
      userImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    userImage = null;
    redrawCanvas();
  }
});

downloadButton.addEventListener('click', () => {
  if (!baseImageLoaded) {
    alert("ベース画像を読み込んでからダウンロードしてください。");
    return;
  }
  const dataURL = canvas.toDataURL('image/webp');
  const a = document.createElement('a');
  a.href = dataURL;
  const filename = (nameInput.value.trim().replace(/\s+/g, '_') || 'vket_user') + '_profile_card.webp';
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

window.onload = () => {
  preloadImages();
  updateTweetLink();
};
