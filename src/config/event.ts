export interface DateOption {
  readonly id: string;
  readonly label: string;
  readonly dateText: string;
  readonly image: string;
}

export const EVENT_CONFIG = {
  title: 'VketReal 2025 Winter',
  dates: [
    { id: 'date20', label: '12月20日 (SAT)', dateText: '12月20日', image: 'VkketReal25W-20.webp' },
    { id: 'date21', label: '12月21日 (SUN)', dateText: '12月21日', image: 'VkketReal25W-21.webp' },
  ] as const satisfies readonly DateOption[],
  bothDatesImage: 'VkketReal25W-20_21.webp',
  tweetHashtags: 'VketReal参加',
  tweetUrl: 'https://2025w.imagecreator.vrugd.jp/',
  tweetBaseText: 'VketReal 2025 Winterに参加します!',
} as const;
