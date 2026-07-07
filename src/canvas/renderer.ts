import { EVENT_CONFIG } from "../config/event";

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

// プロフィール画像の描画領域
const IMG_X = 755;
const IMG_Y = 23;
const IMG_WIDTH = 394;
const IMG_HEIGHT = 394;
const IMG_RADIUS = 22;

export class CanvasRenderer {
  private readonly canvas: HTMLCanvasElement;
  // biome-ignore lint/correctness/noUnusedPrivateClassMembers: used in redraw()
  private readonly ctx: CanvasRenderingContext2D;
  private readonly baseImages = new Map<string, HTMLImageElement>();
  private baseImage: HTMLImageElement | null = null;
  private currentBaseImageUrl = "";
  private userImage: HTMLImageElement | null = null;
  private name = "";
  private sns = "";

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    this.ctx = ctx;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
  }

  async preload(): Promise<void> {
    const primaryUrl = EVENT_CONFIG.bothDatesImage;
    try {
      const img = await this.loadImg(primaryUrl);
      this.baseImages.set(primaryUrl, img);
    } catch (error) {
      console.error("Failed to preload primary image:", error);
    }

    const secondaryUrls = EVENT_CONFIG.dates.map((d) => d.image);
    for (const url of secondaryUrls) {
      this.loadImg(url)
        .then((img) => {
          this.baseImages.set(url, img);
          if (this.currentBaseImageUrl === url) {
            this.setBaseImageUrl(url);
          }
        })
        .catch((err) => {
          console.error(`Failed to load secondary image in background: ${url}`, err);
        });
    }
  }

  setBaseImageUrl(url: string): void {
    this.currentBaseImageUrl = url;
    const img = this.baseImages.get(url);
    if (img) {
      this.baseImage = img;
      this.redraw();
    } else {
      this.baseImage = null;
      this.redraw();

      this.loadImg(url)
        .then((loadedImg) => {
          this.baseImages.set(url, loadedImg);
          if (this.currentBaseImageUrl === url) {
            this.baseImage = loadedImg;
            this.redraw();
          }
        })
        .catch((err) => {
          console.error(`Failed to load image on demand: ${url}`, err);
        });
    }
  }

  setName(name: string): void {
    this.name = name;
    this.redraw();
  }

  setSns(sns: string): void {
    this.sns = sns;
    this.redraw();
  }

  async setUserImageFile(file: File): Promise<void> {
    const dataUrl = await readFileAsDataUrl(file);
    this.userImage = await this.loadImg(dataUrl);
    this.redraw();
  }

  clearUserImage(): void {
    this.userImage = null;
    this.redraw();
  }

  redraw(): void {
    if (!this.baseImage) {
      this.drawLoading();
      return;
    }

    const { ctx } = this;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(this.baseImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (this.userImage) this.drawUserImage();

    ctx.fillStyle = "#333333";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(this.name, 334, 475);
    ctx.fillText(this.sns, 334, 585);
  }

  exportWebP(filename: string): void {
    if (!this.baseImage) {
      alert("ベース画像を読み込んでからダウンロードしてください。");
      return;
    }
    const url = this.canvas.toDataURL("image/webp");
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private drawLoading(): void {
    const { ctx } = this;
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "black";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "ベース画像を読み込んでいます...",
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
    );
  }

  private drawUserImage(): void {
    if (!this.userImage) return;
    const { ctx, userImage } = this;

    const boxRatio = IMG_WIDTH / IMG_HEIGHT;
    const imgRatio = userImage.width / userImage.height;

    let sx = 0,
      sy = 0;
    let sWidth = userImage.width;
    let sHeight = userImage.height;

    if (imgRatio > boxRatio) {
      sWidth = sHeight * boxRatio;
      sx = (userImage.width - sWidth) / 2;
    } else {
      sHeight = sWidth / boxRatio;
      sy = (userImage.height - sHeight) / 2;
    }

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(IMG_X, IMG_Y, IMG_WIDTH, IMG_HEIGHT, IMG_RADIUS);
    ctx.clip();
    ctx.drawImage(
      userImage,
      sx,
      sy,
      sWidth,
      sHeight,
      IMG_X,
      IMG_Y,
      IMG_WIDTH,
      IMG_HEIGHT,
    );
    ctx.restore();
  }

  private loadImg(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () =>
        reject(new Error(`画像の読み込みに失敗しました: ${src}`));
      img.src = src;
    });
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("ファイルの読み込みに失敗しました"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
