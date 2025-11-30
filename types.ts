export interface Memo {
  id: string;
  content: string;
  timestamp: number; // Unix timestamp
  deletedAt?: number; // ゴミ箱に入れた日時。undefinedなら通常表示
}

export type SortOrder = 'desc' | 'asc';

export interface WebSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onresult: (event: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onerror: (event: any) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): WebSpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): WebSpeechRecognition;
    };
  }
}