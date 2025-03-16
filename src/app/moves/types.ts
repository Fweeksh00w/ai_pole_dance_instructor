export type Move = {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  requirements: string[];
  muscles: string[];
}; 