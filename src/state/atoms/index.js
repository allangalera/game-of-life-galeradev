import { atom, atomFamily } from "recoil";

export const cellsAtom = atom({
  key: "cells",
  default: [],
});

export const boardSizeAtom = atom({
  key: "boardSize",
  default: {
    width: 30,
    height: 30,
    cellSize: 25,
    interval: 100,
  },
});

export const cellAtom = atomFamily({
  key: "cell",
  default: false,
});

export const actionsAtom = atom({
  key: "actions",
  default: {
    type: "idle",
    payload: null,
  },
});

export const gameStateAtom = atom({
  key: "gameState",
  default: "idle",
});

export const generationAtom = atom({
  key: "generation",
  default: 0,
});
