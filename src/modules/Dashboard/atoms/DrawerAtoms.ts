import { atom } from 'jotai';

export const DrawerOpenAtom = atom<boolean>(localStorage.getItem('drawerOpen') === 'true');