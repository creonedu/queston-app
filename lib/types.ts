// ===== Core Types =====
export type Track = '공학' | '자연과학' | '의약' | '경상' | '사회과학' | '인문' | '교육' | '예체능';
export type Grade = '중3' | '고1' | '고2' | '고3';
export type SchoolType = '일반고' | '자공고' | '자사고' | '외고/국제고' | '과학고' | '중학교';
export type GradeRank = '1.0~1.5' | '1.5~2.0' | '2.0~2.5' | '2.5~3.0' | '3.0~' | '모름';

export interface Profile {
  name: string;
  grade: Grade | '';
  school: SchoolType | '';
  tracks: Track[];
  major: string;
  gradeRank: GradeRank | '';
}

export interface Diagnosis {
  score: number;
  breakdown: {
    교과: number;
    세특: number;
    창체: number;
    독서: number;
  };
}

export interface Mission {
  id: string;
  icon: string;
  iconClass?: 'gold' | 'green' | 'blue';
  text: string;
  sub: string;
  target: 'topic' | 'reading' | 'match' | 'chat';
  done: boolean;
}

export interface Topic {
  subj: string;
  sub: string;
  title: string;
  desc: string;
  diff: string;
  uniq: number;
  fit: number;
  featured: boolean;
}

export interface SavedSebteuk {
  title: string;
  subj: string;
  sub: string;
  draft: string;
  savedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Stats {
  topics: number;
  books: number;
  sebteuks: number;
  chats: number;
}

export interface AppState {
  profile: Profile;
  diag: Diagnosis;
  missions: Mission[];
  savedSebteuks: SavedSebteuk[];
  chatHistory: ChatMessage[];
  userEssay: string;
  stats: Stats;
  onboarded: boolean;
}

export interface BookData {
  topword: string;
  title: string;
  author: string;
  name: string;
  meta: string;
  desc: string;
}

export interface MatchData {
  name: string;
  meta: string;
  score: number;
}

export interface University {
  name: string;
  major: string;
  prob: number;
  target: boolean;
}
