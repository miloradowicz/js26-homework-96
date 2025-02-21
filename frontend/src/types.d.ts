export interface Ingredient {
  name: string;
  qty?: string;
}

export interface Rating {
  user: string;
  rating: number;
}

export interface Cocktail {
  _id: string;
  user: string;
  name: string;
  imageUrl: string;
  recipe: string;
  isPublished: boolean;
  ingredients: Ingredient[];
  ratings: Rating[];
}

export type CocktailBrief = Omit<
  Cocktail,
  'recipe' | 'ingredients' | 'ratings'
> & { rating: number };

export type CocktailMutation = Omit<
  Cocktail,
  '_id' | 'user' | 'imageUrl' | 'isPublished' | 'ratings'
> & { image: File | null };

export interface User {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  role: 'user' | 'admin';
  token: string;
}

export type StrippedUser = Omit<User, 'role' | 'token'>;

export type SignUpMutation = Omit<
  User,
  '_id' | 'avatarUrl' | 'role' | 'token'
> & {
  password: string;
  avatar: File | null;
};

export type SignInMutation = Omit<
  User,
  '_id' | 'displayName' | 'avatarUrl' | 'role' | 'token'
>;

export interface Session {
  user: User | null;
}

export interface AuthenticationError {
  type: 'AuthenticationError';
  error: {
    name: string;
    message: string;
  };
}

export interface ValidationError {
  type: 'ValidationError';
  errors: {
    [key: string]: {
      name: string;
      messages: string[];
    };
  };
}

export interface GenericError {
  type: string;
  error: string;
}
