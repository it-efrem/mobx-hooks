import {useEffect, useState} from "react";

// ToDo: Переписать без использования React
export function usePromiseLoop({
                                   updaters = [],
                                   timeout = 2000,
                               }) {
    const [pendingGroup, setPendingGroup] = useState(true);
    let updaterId;

    useEffect(() => {
        handleUpdater(updaters);
        return () => clearTimeout(updaterId)
    }, []);

    useEffect(() => {
        if (!pendingGroup) {
            setPendingGroup(true);
            updaterId = setTimeout(() => handleUpdater(updaters), timeout);
        }
    }, [pendingGroup]);

    function handleUpdater(updaters) {
        Promise.allSettled(updaters.map(updater => createPromise(updater)))
            .then(() => {
                setPendingGroup(false)
            })
            .catch((e) => {
                console.error(e);
                setPendingGroup(false);
            })
    }
}

function createPromise(asyncCallback) {
    return new Promise(async (resolve, reject) => {
        try {
            await asyncCallback(resolve, reject);
            resolve()
        } catch (e) {
            reject(e);
            console.error(e);
        }
    })
}