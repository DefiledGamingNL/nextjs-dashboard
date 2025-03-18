import { create } from "zustand";

interface AvatarState {
  avatars: Record<string, string>; // { userId: avatarUrl }
  setAvatar: (userId: string, url: string) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  avatars: {},
  setAvatar: (userId, url) =>
    set((state) => ({
      avatars: { ...state.avatars, [userId]: url },
    })),
}));
