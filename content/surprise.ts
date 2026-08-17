export type SurpriseMode = "confession" | "anniversary" | "birthday" | "just-because";

export interface OpeningContent {
  eyebrow?: string;
  systemLabel?: string;
  bootInitializing?: string;
  bootOnline?: string;
  title: string;
  subtitle?: string;
  cta: string;
  previewImage: string;
  previewImageAlt: string;
}

export interface EnvelopeContent {
  systemLabel?: string;
  label: string;
  message: string;
  instruction: string;
}

export interface QuestionContent {
  systemLabel?: string;
  text: string;
  yesLabel: string;
  noLabel: string;
  noEscapeLabels: string[];
}

export interface QuizContent {
  eyebrow: string;
  question: string;
  answer: string;
  placeholder: string;
  submitLabel: string;
  wrongFeedback: string[];
  successLabel: string;
  helper: string;
  inputLabel: string;
  successStatus: string;
}

export interface TransitionContent {
  acceptedLine1: string;
  acceptedLine2: string;
  thinkingLine1?: string;
  thinkingLine2?: string;
}

export interface Reason {
  title: string;
  content: string;
}

export interface WhyYouContent {
  eyebrow: string;
  heading: string;
  lead?: string;
}

export interface Memory {
  id: string;
  date?: string;
  title?: string;
  caption?: string;
  image: string;
  alt: string;
}

export interface DateChoice {
  id: string;
  optionA: string;
  optionB: string;
  specialInteraction?: MemeInteraction;
}

export interface MemeInteraction {
  type: "meme";
  statusLabel: string;
  image: string;
  imageAlt: string;
  audio: SoundEffectConfig;
  text: string;
  dismissLabel: string;
}

export interface DateChoiceSectionContent {
  eyebrow: string;
  heading: string;
  lead?: string;
  completeEyebrow: string;
  completeMessage: string;
}

export interface LetterContent {
  systemLabel?: string;
  heading?: string;
  body: string[];
  date?: string;
  signOff?: string;
}

export interface EndingContent {
  systemLabel?: string;
  completionLabel?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  image: string;
  imageAlt: string;
}

export interface AudioConfig {
  src: string;
  title: string;
  artist: string;
  cover?: string;
  coverAlt?: string;
  unavailableLabel?: string;
  volume?: number;
}

export interface SoundEffectConfig {
  src: string;
  volume: number;
}

export interface FooterContent {
  systemLabel?: string;
  annotation: string;
  year: string;
  restartLabel: string;
}

export interface SurpriseConfig {
  mode: SurpriseMode;
  recipient: string;
  audio?: AudioConfig;
  soundEffects?: {
    noButton: SoundEffectConfig;
  };
  opening: OpeningContent;
  envelope: EnvelopeContent;
  question: QuestionContent;
  quiz: {
    name: QuizContent;
    favorite: QuizContent;
  };
  transition: TransitionContent;
  whyYou: WhyYouContent;
  reasons: Reason[];
  memories: Memory[];
  dateChoice: DateChoiceSectionContent;
  dateChoices: DateChoice[];
  letter: LetterContent;
  ending: EndingContent;
  footer: FooterContent;
}

export const surpriseConfig: SurpriseConfig = {
  mode: "just-because",
  recipient: "you",
  audio: {
    src: "/audio/river-flow.mp3",
    title: "River Flow",
    artist: "",
    unavailableLabel: "music belum tersedia",
    volume: 0.45
  },
  soundEffects: {
    noButton: {
      src: "/audio/cat.mp3",
      volume: 0.7
    }
  },
  opening: {
    eyebrow: "hey.",
    systemLabel: "LOVE SYSTEM / 01",
    bootInitializing: "initializing...",
    bootOnline: "LOVE SYSTEM ONLINE",
    title: "aku bikin sesuatu.",
    subtitle: "cuma sebentar kok.",
    cta: "START →",
    previewImage: "/images/05.webp",
    previewImageAlt: "A placeholder for the opening memory"
  },
  envelope: {
    systemLabel: "LOVE FILE",
    label: "for you.",
    message: "hi.",
    instruction: "tap to open"
  },
  question: {
    systemLabel: "01 / QUESTION",
    text: "Maukah kamu jadi pacarku?",
    yesLabel: "Iya",
    noLabel: "Nggak",
    noEscapeLabels: ["yakin?", "hehe", "hampir", "nggak bisa"]
  },
  quiz: {
    name: {
      eyebrow: "LOVE DATABASE / 02",
      question: "Siapa nama orang yang kamu suka?",
      answer: "dani",
      placeholder: "ketik di sini...",
      submitLabel: "confirm →",
      wrongFeedback: ["hmm... coba lagi.", "masa lupa?"],
      successLabel: "iya, betul.",
      helper: "sedikit petunjuk sebelum cerita ini dibuka.",
      inputLabel: "jawaban rahasia",
      successStatus: "STATUS: MATCH FOUND"
    },
    favorite: {
      eyebrow: "CAFE MEMORY FILE / 03",
      question: "Apa kesukaan dia?",
      answer: "kopi",
      placeholder: "jawab pelan-pelan...",
      submitLabel: "lanjut →",
      wrongFeedback: ["hampir.", "coba inget lagi."],
      successLabel: "okay. sekarang lanjut.",
      helper: "pilih yang paling dia suka, lalu kita lanjut.",
      inputLabel: "catatan kecil",
      successStatus: "MATCH COMPLETE"
    }
  },
  transition: {
    acceptedLine1: "okay.",
    acceptedLine2: "sekarang lanjut.",
    thinkingLine1: "alright.",
    thinkingLine2: "aku tetap mau cerita."
  },
  whyYou: {
    eyebrow: "MEMORY FILE / 01",
    heading: "bingung nulisnya.",
    lead: "jadi ya... aku tulis seadanya aja."
  },
  reasons: [
    {
      title: "sebenernya...",
      content: "aku ga terlalu bisa ngomong ginian sih, cuma ya... aku seneng aja kalo ada kamu."
    },
    {
      title: "agak malu bilangnya",
      content: "kadang aku pengen ngajak voice duluan, tapi ujung ujungnya cuma nunggu kamu di discord wkwk."
    },
    {
      title: "gatau jelasinnya",
      content: "main roblox, voice , ngobrol ga jelas... kayaknya hal biasa, tapi kalo sama kamu beda aja."
    }
  ],
  memories: [
    {
      id: "m1",
      date: "pertama kenal",
      image: "/images/01.webp",
      alt: "Placeholder for the first memory"
    },
    {
      id: "m2",
      date: "pertama kali kirim foto kamu :)",
      image: "/images/02.webp",
      caption: "my favorite person.",
      alt: "Placeholder for a long conversation memory"
    },
    {
      id: "m3",
      title: "mulai sering nyariin kamu",
      image: "/images/03.webp",
      caption: "foto biasa, orangnya nggak.",
      alt: "Placeholder for an everyday photo memory"
    },
    {
      id: "m4",
      title: "entah kapan mulai nyaman",
      image: "/images/04.webp",
      alt: "Placeholder for a comfortable moment"
    },
    {
      id: "m5",
      title: "and now you're here.",
      image: "/images/05.webp",
      alt: "Placeholder for the final memory"
    }
  ],
  dateChoice: {
    eyebrow: "DATE SELECT",
    heading: "pick our next date.",
    lead: "go with your first instinct.",
    completeEyebrow: "sealed.",
    completeMessage: "I'll keep this safe."
  },
  dateChoices: [
    {
      id: "d1",
      optionA: "Main Roblox",
      optionB: "Main BS"
    },
    {
      id: "d2",
      optionA: "Nonton Film Action",
      optionB: "Nonton Film Horor"
    },
    {
      id: "d3",
      optionA: "Ngopi Bareng",
      optionB: "Jajan Bareng",
      specialInteraction: {
        type: "meme",
        statusLabel: "LOVE SYSTEM / REQUEST DENIED",
        image: "/images/cat-laugh.gif",
        imageAlt: "A laughing cat reacting to the unavailable virtual date",
        audio: {
          src: "/audio/cat.mp3",
          volume: 0.7
        },
        text: "Gabisa yee kan Virtual",
        dismissLabel: "oke deh"
      }
    }
  ],
  letter: {
    systemLabel: "END OF FILE",
    heading: "one last thing.",
    date: "17 / 08 / 26",
    signOff: "Dani.",
    body: [
      "Terima kasih udah jadi bagian dari hari-hariku akhir-akhir ini.",
      "Mungkin ini cara yang agak aneh buat bilang, tapi aku cuma pengen memastikan kamu tau kalau kamu spesial buat aku.",
      "Semoga ini bikin kamu tersenyum hari ini."
    ]
  },
  ending: {
    systemLabel: "LOVE SYSTEM",
    completionLabel: "COMPLETE",
    title: "Bukan Jalak Bukan Jarak, Only ZARA",
    subtitle: "Rindu itu berat, biar aku saja (DANI, 1991)",
    cta: "miss u sayang.",
    image: "/images/jarak.webp",
    imageAlt: "Placeholder for the final shared memory"
  },
  footer: {
    systemLabel: "LOVE SYSTEM / 2026",
    annotation: "made for you.",
    year: "2026",
    restartLabel: "ulang dari awal"
  }
};
