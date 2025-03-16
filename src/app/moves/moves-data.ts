import { type Move } from './types';

export const moves: Move[] = [
  {
    id: 'jade-split',
    name: 'Jade Split',
    difficulty: 'Advanced',
    description: 'An advanced split position on the pole combining flexibility and strength, where one leg is hooked on the pole while the other extends into a split.',
    requirements: [
      'Advanced flexibility (splits)',
      'Strong pole grip',
      'Core control',
      'Hip flexor flexibility',
      'Shoulder stability'
    ],
    muscles: ['Hip flexors', 'Hamstrings', 'Core', 'Shoulders', 'Inner thighs']
  },
  {
    id: 'twerk',
    name: 'Pole Twerk',
    difficulty: 'Intermediate',
    description: 'A dynamic movement combining pole grip with isolated hip and glute movements, creating a fluid twerking motion while maintaining pole contact.',
    requirements: [
      'Hip mobility',
      'Core control',
      'Basic pole grip',
      'Rhythm coordination',
      'Lower body isolation'
    ],
    muscles: ['Glutes', 'Core', 'Quadriceps', 'Lower back', 'Hip flexors']
  },
  {
    id: 'allegra',
    name: 'Allegra',
    difficulty: 'Advanced',
    description: 'A beautiful split-based move where the body is suspended sideways on the pole, creating a dramatic pose with one leg extended to the ceiling.',
    requirements: [
      'Split flexibility',
      'Strong upper body strength',
      'Advanced pole grip',
      'Core stability',
      'Balance control'
    ],
    muscles: ['Shoulders', 'Lats', 'Core', 'Hip flexors', 'Obliques']
  },
  {
    id: 'spatchcock',
    name: 'Spatchcock',
    difficulty: 'Expert',
    description: 'An extreme flexibility move where both legs are pushed behind the head while gripping the pole, requiring exceptional flexibility and strength.',
    requirements: [
      'Extreme flexibility',
      'Advanced upper body strength',
      'Strong core control',
      'Advanced pole grip',
      'Shoulder mobility'
    ],
    muscles: ['Shoulders', 'Core', 'Upper back', 'Hip flexors', 'Chest']
  },
  {
    id: 'fireman-spin',
    name: 'Fireman Spin',
    difficulty: 'Beginner',
    description: 'A basic spin around the pole using both hands and legs, perfect for beginners to learn pole grip and basic spinning mechanics.',
    requirements: ['Upper body strength', 'Basic grip strength', 'Core engagement'],
    muscles: ['Arms', 'Core', 'Thighs', 'Shoulders']
  }
]; 