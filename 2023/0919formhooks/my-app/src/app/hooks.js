import {
    useState,
    useMemo,
    useCallback,
    useReducer,
    useRef,
    useEffect,
} from "react";

export const useAsyncStatus = (options = { status: null, name: "" }) => {
    const INITIAL = "initial";
    const PENDING = "pending";
    const SUCCESS = "success";
    const FAILURE = "failure";

    const _stayList = useRef([]);
    const name = useRef(options.name);
    const isLock = useRef(false);

    const [status, setStatus] = useState(options.status || INITIAL);
    const [error, setError] = useState(null);

    const isInitial = useMemo(() => status === INITIAL);
    const isPending = useMemo(() => status === PENDING);
    const isSuccess = useMemo(() => status === SUCCESS);
    const isFailure = useMemo(() => status === FAILURE);

    const initial = () => {
        if (isLock.current) {
            return;
        }
        setStatus(INITIAL);
        setError(null);
    };
    const pending = () => {
        if (isLock.current) {
            return;
        }
        setStatus(PENDING);
        setError(null);
    };
    const success = () => {
        if (isLock.current) {
            return;
        }
        setStatus(SUCCESS);
        setError(null);
    };
    const failure = (newError = null) => {
        if (isLock.current) {
            return;
        }
        setStatus(FAILURE);
        setError(newError);
    };
    const custom = (customType = "custom", newError = null) => {
        if (isLock.value) {
            return;
        }
        setStatus(customType);
        setError(newError);
    };

    const lock = () => {
        isLock.current = true;
    };
    const unlock = () => {
        isLock.current = false;
    };

    const stay = (...types) => {
        return new Promise((resolve) => {
            if (types.includes(status)) {
                resolve();
                return;
            }
            _stayList.current.push({
                types: [...types],
                action: () => {
                    resolve();
                },
            });
        });
    };

    useEffect(() => {
        if (_stayList.current.length) {
            const leftList = [];
            for (let i = 0, l = _stayList.current.length; i < l; ++i) {
                const target = _stayList.current[i];
                if (target.types.includes(status)) {
                    target.action();
                } else {
                    leftList.push(target);
                }
            }
            _stayList.current = leftList;
        }
    }, [status]);

    return {
        status,
        name: name.current,
        error,
        isInitial,
        isPending,
        isSuccess,
        isFailure,
        initial,
        pending,
        success,
        failure,
        lock,
        unlock,
        custom,
        stay,
    };
};

export const useRegistForm = (initialState = {}) => {
    initialState = {
        phone: "",
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
        os: (ref) => {},
    }));

    const validater = useRef({
        all: (state) => {
            console.log(state);
            return false;
        },
        phone: (state) => {
            const regexp = /^[0-9]{11}$/;
            const value = regexp.test(state.phone);
            return value;
        },
        email: (state) => {
            const regexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
            const value = regexp.test(state.email);
            return value;
        },
    });

    const setValidater = useCallback((type, fn) => {
        validater.current = {
            ...validater.current,
            [type]: () => fn(state),
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

    const valid = useMemo(() => {
        return Object.entries(validater.current).reduce((p, [k, v]) => {
            p[k] = v ? v(state, k) : true;
            return p;
        }, {});
    }, [state]);

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

    // const airplanes = {
    //     verifyPhone: () => {
    //         /v1/Event/${$p.eventId}/msms/m/save
    //         const baseURL = "https://";
    //         return {
    //             key: 1,
    //             method: "POST",
    //         };
    //     },
    // };

    // const flight = async (type) => {
    //     const airplane = airplanes[type]();
    //     console.log(airplane);
    //     const response = await fetch();
    // };

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
        // flight,
    };
};
