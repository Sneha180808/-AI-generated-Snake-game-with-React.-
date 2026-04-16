import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'CYBER_PULSE_01',
    artist: 'NEURAL_LINK',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73456.mp3', // Synthwave
    cover: 'https://picsum.photos/seed/cyber1/400/400',
  },
  {
    id: '2',
    title: 'GLITCH_CORE_X',
    artist: 'VOID_WALKER',
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_3174222270.mp3', // Techno
    cover: 'https://picsum.photos/seed/cyber2/400/400',
  },
  {
    id: '3',
    title: 'NEON_DREAMS_V2',
    artist: 'DATA_GHOST',
    url: 'https://cdn.pixabay.com/audio/2021/11/23/audio_0398d8a011.mp3', // Ambient
    cover: 'https://picsum.photos/seed/cyber3/400/400',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const GAME_SPEED = 100;
