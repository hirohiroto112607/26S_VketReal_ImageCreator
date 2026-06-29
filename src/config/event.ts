export interface DateOption {
  readonly id: string;
  readonly label: string;
  readonly dateText: string;
  readonly image: string;
}

export const EVENT_CONFIG = {
  title: "VketReal 2026 Summer",
  dates: [
    {
      id: "date25",
      label: "7月25日 (SAT)",
      dateText: "7月25日",
      image: "VketReal26S_25.png",
    },
    {
      id: "date26",
      label: "7月26日 (SUN)",
      dateText: "7月26日",
      image: "VketReal26S_26.png",
    },
  ] as const satisfies readonly DateOption[],
  bothDatesImage: "VketReal26S_25_26.png",
  tweetHashtags: "VketReal参加",
  tweetUrl: "https://2026s.imagecreator.vrugd.jp/",
  tweetBaseText: "VketReal 2026 Summerに参加します!",
} as const;
