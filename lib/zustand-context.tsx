import { StoreApi } from "zustand";
import React from "react";

/**
 * Creates a zustand context
 * @param {function} getStore A function that takes an initial value and returns a zustand store
 * @returns An object with the following properties:
 *   - `Context`: A React context
 *   - `Provider`: A React component that takes a `children` prop and an `initialValue` prop
 *   - `useContext`: A hook to get the context value
 */
export const createZustandContext = <TInitial, TStore extends StoreApi<any>>(
    getStore: (initial: TInitial) => TStore
) => {
    const Context = React.createContext<TStore | null>(null);

    const Provider = (props: {
        children?: React.ReactNode;
        initialValue: TInitial;
    }) => {
        const [store] = React.useState(getStore(props.initialValue));

        return (
            <Context.Provider value={store}>
                {props.children}
            </Context.Provider>
        );
    };

    return {
        useContext: () => React.useContext(Context),
        Context,
        Provider
    };
};
