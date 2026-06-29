import './style.css';
import { CanvasRenderer } from './canvas/renderer';
import { EVENT_CONFIG } from './config/event';

function getBaseImageUrl(date20: boolean, date21: boolean): string {
  if (date20 && date21) return EVENT_CONFIG.bothDatesImage;
  if (date20) return EVENT_CONFIG.dates[0].image;
  if (date21) return EVENT_CONFIG.dates[1].image;
  return EVENT_CONFIG.bothDatesImage;
}

function buildTweetUrl(date20: boolean, date21: boolean): string {
  let text: string = EVENT_CONFIG.tweetBaseText;
  const [d20, d21] = EVENT_CONFIG.dates;

  if (date20 && date21) {
    text = `VketReal 2025 Winterに${d20.dateText}と${d21.dateText}で参加します!`;
  } else if (date20) {
    text = `VketReal 2025 Winterに${d20.dateText}に参加します!`;
  } else if (date21) {
    text = `VketReal 2025 Winterに${d21.dateText}に参加します!`;
  }

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${EVENT_CONFIG.tweetHashtags}&url=${EVENT_CONFIG.tweetUrl}`;
}

async function main() {
  const canvas = document.getElementById('passCardCanvas') as HTMLCanvasElement;
  const nameInput = document.getElementById('nameInput') as HTMLInputElement;
  const snsInput = document.getElementById('snsInput') as HTMLInputElement;
  const imageUpload = document.getElementById('imageUpload') as HTMLInputElement;
  const date20Checkbox = document.getElementById('date20') as HTMLInputElement;
  const date21Checkbox = document.getElementById('date21') as HTMLInputElement;
  const downloadButton = document.getElementById('downloadButton') as HTMLButtonElement;
  const tweetLink = document.getElementById('tweetLink') as HTMLAnchorElement;

  const renderer = new CanvasRenderer(canvas);
  await renderer.preload();

  const syncDateState = () => {
    renderer.setBaseImageUrl(getBaseImageUrl(date20Checkbox.checked, date21Checkbox.checked));
    tweetLink.href = buildTweetUrl(date20Checkbox.checked, date21Checkbox.checked);
  };

  syncDateState();

  nameInput.addEventListener('input', () => renderer.setName(nameInput.value));
  snsInput.addEventListener('input', () => renderer.setSns(snsInput.value));
  date20Checkbox.addEventListener('change', syncDateState);
  date21Checkbox.addEventListener('change', syncDateState);

  imageUpload.addEventListener('change', async () => {
    const file = imageUpload.files?.[0];
    if (file) {
      await renderer.setUserImageFile(file);
    } else {
      renderer.clearUserImage();
    }
  });

  downloadButton.addEventListener('click', () => {
    const name = nameInput.value.trim().replace(/\s+/g, '_') || 'vket_user';
    renderer.exportWebP(`${name}_profile_card.webp`);
  });
}

main();
