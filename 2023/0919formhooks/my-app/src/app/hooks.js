import { useMemo, useCallback, useReducer, useRef } from "react";

export const useRegistForm = (initialState = {}) => {
    initialState = {
        phone: "",
        phoneCode: false,
        email: "",
        myNumber: 1,
        ...initialState,
    };

    const domDirectBindMap = useMemo(() => ({
        phone: (ref) => {
            const value = ref.target.value;
            return value;
        },
        email: (ref) => {
            const value = ref.target.value;
            return value;
        },
    }));

    const validater = useRef({
        phone: (string) => {
            const regexp = /^[0-9]{11}$/;
            const value = regexp.test(string);
            return value;
        },
        email: (string) => {
            const regexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
            const value = regexp.test(string);
            return value;
        },
    });

    const setValidater = useCallback((type, fn) => {
        validater.current = {
            ...validater.current,
            [type]: fn,
        };
    });

    const pattern = useRef({
        phone: (string) => {
            const isRightLength = string.length < 12;
            const isAllNumber = string === "" || /^\d+$/.test(string);
            const isPattern = isRightLength && isAllNumber;
            return isPattern;
        },
        email: () => {
            return true;
        },
    });

    const setPattern = useCallback((type, fn) => {
        pattern.current = {
            ...pattern.current,
            [type]: fn,
        };
    });

    const reducer = (state, action) => {
        return {
            ...state,
            [action.type]: action.value,
        };
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const valid = useMemo(
        () =>
            Object.entries(validater.current).reduce((p, [k, v]) => {
                console.log(v);
                p[k] = v ? v(state[k]) : true;
                console.log(p[k]);
                return p;
            }, {}),
        [state]
    );

    const set = useCallback(
        (type, value) => {
            const patternType = pattern.current[type];
            const isPatternOk = patternType ? patternType?.(value) : true;
            if (!isPatternOk) {
                return;
            }
            dispatch({ type, value });
        },
        [pattern]
    );

    const bind = useCallback((type) => (ref) => {
        const typeFn = domDirectBindMap?.[type];
        const value = typeFn?.(ref);
        typeFn && set(type, value);
    });

    const call = useCallback(async (key) => {
        return fetch(key);
    });

    return {
        state,
        valid,
        set,
        bind,
        dispatch,
        validater,
        pattern,
        setValidater,
        setPattern,
    };
};
