import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createZustandContext } from "./zustand-context";
import React from "react";

type State = {
    generating: boolean,
    setGenerating: (generating: boolean) => void
}

/**
 * Creates a Zustand store with persistence for managing image generation state.
 * 
 * The store contains a `generating` boolean to track the image generation status 
 * and a `setGenerating` function to update this status. The state is persisted 
 * in localStorage under the key "image-store".
 * 
 * @returns A Zustand store with state and persistence configured for image generation.
 */
const getStore = (initialState: {
    generating: boolean
}) => {
    return createStore<State>()(
        persist(
            (set) => ({
                generating: initialState.generating,
                setGenerating: (generating: boolean) => set({ generating })
            }),
            { name: "image-store", storage: createJSONStorage(() => localStorage) }
        )
    )
}

export const ImageStore = createZustandContext(getStore)

/**
 * Hook to get the image store state.
 *
 * The selector function is passed the full state and should return the value
 * that you want to use in your component.
 *
 * @template T
 * @param {function(State):T} selector
 * @returns {T}
 */
export function useImageStore<T>(selector: (state: State) => T): T {
    const store = React.useContext(ImageStore.Context)
    if (!store) {
        throw new Error("useImageStore must be used within a Provider")
    }
    return useStore(store, selector)
}