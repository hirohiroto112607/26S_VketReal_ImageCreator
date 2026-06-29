import "./style.css";
import { CanvasRenderer } from "./canvas/renderer";
import { EVENT_CONFIG } from "./config/event";

function getBaseImageUrl(day1: boolean, day2: boolean): string {
  if (day1 && day2) return EVENT_CONFIG.bothDatesImage;
  if (day1) return EVENT_CONFIG.dates[0].image;
  if (day2) return EVENT_CONFIG.dates[1].image;
  return EVENT_CONFIG.bothDatesImage;
}

function buildTweetUrl(day1: boolean, day2: boolean): string {
  let text: string = EVENT_CONFIG.tweetBaseText;
  const [d1, d2] = EVENT_CONFIG.dates;
  const eventTitle = EVENT_CONFIG.title;
  if (day1 && day2) {
    text = `${eventTitle}に${d1.dateText}と${d2.dateText}で参加します!`;
  } else if (day1) {
    text = `${eventTitle}に${d1.dateText}に参加します!`;
  } else if (day2) {
    text = `${eventTitle}に${d2.dateText}に参加します!`;
  }

  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${EVENT_CONFIG.tweetHashtags}&url=${EVENT_CONFIG.tweetUrl}`;
}

async function main() {
  const canvas = document.getElementById("passCardCanvas") as HTMLCanvasElement;
  const nameInput = document.getElementById("nameInput") as HTMLInputElement;
  const snsInput = document.getElementById("snsInput") as HTMLInputElement;
  const imageUpload = document.getElementById(
    "imageUpload",
  ) as HTMLInputElement;
  const day1Checkbox = document.getElementById("day1") as HTMLInputElement;
  const day2Checkbox = document.getElementById("day2") as HTMLInputElement;
  const downloadButton = document.getElementById(
    "downloadButton",
  ) as HTMLButtonElement;
  const tweetLink = document.getElementById("tweetLink") as HTMLAnchorElement;

  const renderer = new CanvasRenderer(canvas);
  await renderer.preload();

  const syncDateState = () => {
    renderer.setBaseImageUrl(
      getBaseImageUrl(day1Checkbox.checked, day2Checkbox.checked),
    );
    tweetLink.href = buildTweetUrl(
      day1Checkbox.checked,
      day2Checkbox.checked,
    );
  };

  syncDateState();

  nameInput.addEventListener("input", () => renderer.setName(nameInput.value));
  snsInput.addEventListener("input", () => renderer.setSns(snsInput.value));
  day1Checkbox.addEventListener("change", syncDateState);
  day2Checkbox.addEventListener("change", syncDateState);

  imageUpload.addEventListener("change", async () => {
    const file = imageUpload.files?.[0];
    if (file) {
      await renderer.setUserImageFile(file);
    } else {
      renderer.clearUserImage();
    }
  });

  downloadButton.addEventListener("click", () => {
    const name = nameInput.value.trim().replace(/\s+/g, "_") || "vket_user";
    renderer.exportWebP(`${name}_profile_card.webp`);
  });
}

main();
