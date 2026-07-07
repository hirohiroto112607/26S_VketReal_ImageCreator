import "./style.css";
import { CanvasRenderer } from "./canvas/renderer";
import { EVENT_CONFIG } from "./config/event";

function getBaseImageUrl(day1: boolean, day2: boolean): string {
  if (day1 && day2) return EVENT_CONFIG.bothDatesImage;
  if (day1) return EVENT_CONFIG.dates[0].image;
  if (day2) return EVENT_CONFIG.dates[1].image;
  return EVENT_CONFIG.bothDatesImage;
}

function buildPostUrl(day1: boolean, day2: boolean): string {
  let text: string = EVENT_CONFIG.postBaseText;
  const [d1, d2] = EVENT_CONFIG.dates;
  const eventTitle = EVENT_CONFIG.title;
  if (day1 && day2) {
    text = `${eventTitle}に${d1.dateText}と${d2.dateText}で参加します!`;
  } else if (day1) {
    text = `${eventTitle}に${d1.dateText}に参加します!`;
  } else if (day2) {
    text = `${eventTitle}に${d2.dateText}に参加します!`;
  }

  return `https://x.com/intent/post?text=${encodeURIComponent(text)}&hashtags=${EVENT_CONFIG.postHashtags}&url=${EVENT_CONFIG.postUrl}`;
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
  const postLink = document.getElementById("postLink") as HTMLAnchorElement;

  const renderer = new CanvasRenderer(canvas);
  await renderer.preload();

  const updateButtonStates = (downloaded: boolean) => {
    if (downloaded) {
      downloadButton.classList.remove("button--highlight");
      downloadButton.classList.add("button--muted");

      postLink.classList.remove("disabled");
      postLink.classList.add("button--highlight");
      postLink.removeAttribute("aria-disabled");
      postLink.removeAttribute("tabindex");
    } else {
      downloadButton.classList.remove("button--muted");
      downloadButton.classList.add("button--highlight");

      postLink.classList.remove("button--highlight");
      postLink.classList.add("disabled");
      postLink.setAttribute("aria-disabled", "true");
      postLink.setAttribute("tabindex", "-1");
    }
  };

  const syncDateState = () => {
    renderer.setBaseImageUrl(
      getBaseImageUrl(day1Checkbox.checked, day2Checkbox.checked),
    );
    postLink.href = buildPostUrl(
      day1Checkbox.checked,
      day2Checkbox.checked,
    );
  };

  const handleInputChange = () => {
    updateButtonStates(false);
  };

  syncDateState();
  updateButtonStates(false);

  nameInput.addEventListener("input", () => {
    renderer.setName(nameInput.value);
    handleInputChange();
  });
  snsInput.addEventListener("input", () => {
    renderer.setSns(snsInput.value);
    handleInputChange();
  });
  day1Checkbox.addEventListener("change", () => {
    syncDateState();
    handleInputChange();
  });
  day2Checkbox.addEventListener("change", () => {
    syncDateState();
    handleInputChange();
  });

  imageUpload.addEventListener("change", async () => {
    const file = imageUpload.files?.[0];
    if (file) {
      await renderer.setUserImageFile(file);
    } else {
      renderer.clearUserImage();
    }
    handleInputChange();
  });

  downloadButton.addEventListener("click", () => {
    const name = nameInput.value.trim().replace(/\s+/g, "_") || "vket_user";
    renderer.exportWebP(`${name}_profile_card.webp`);
    updateButtonStates(true);
  });
}

main();
