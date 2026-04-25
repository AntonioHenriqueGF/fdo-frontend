import { atom } from 'jotai';
import { type RawImport } from '../interfaces/RawImport';
import type { SetStateAction } from 'jotai';

export const csvImportRawAtom = atom<RawImport | null>(null);
export const fileImportNameAtom = atom<string>('');
export const fileImportHashAtom = atom<string>('');
export const headerLineSelectedAtom = atom<number>(1);
export const dataStartLineSelectedAtom = atom<number>(2);

export const csvImportAddSpreadAtom = atom(
  (get) => get(csvImportRawAtom),
  (_get, set, newData: SetStateAction<RawImport | null>) => {
    set(csvImportRawAtom, newData);
  });

export const headerLineSelectedSpreadAtom = atom(
  (get) => get(headerLineSelectedAtom),
  (_get, set, newData: SetStateAction<number>) => {
    set(headerLineSelectedAtom, newData);
  });

export const dataStartLineSelectedSpreadAtom = atom(
  (get) => get(dataStartLineSelectedAtom),
  (_get, set, newData: SetStateAction<number>) => {
    set(dataStartLineSelectedAtom, newData);
  });

export const deleteFileImportAtom = atom(
  (get) => get(csvImportRawAtom),
  (_get, set) => {
    set(csvImportRawAtom, null);
    set(headerLineSelectedAtom, 1);
    set(dataStartLineSelectedAtom, 2);
  });
