export type GuideId =
  | 'outlook-desktop'
  | 'outlook-web'
  | 'gmail'
  | 'apple-mail'
  | 'mobile';

export interface GuideStep {
  title: string;
  body: string;
}

export interface GuideTroubleshooting {
  problem: string;
  solution: string;
}

export interface InstallationGuide {
  id: GuideId;
  title: string;
  subtitle: string;
  /** Short label for cards and print header */
  clientName: string;
  prerequisites: string[];
  steps: GuideStep[];
  tips?: string[];
  troubleshooting?: GuideTroubleshooting[];
}
