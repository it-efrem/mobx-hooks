import {action, observable} from "mobx";

// ToDo: Переименовать в reaction... useReaction... changeObserver... ???
export const useState = ({
                               value,
                               effect, // function
                           } = {}) => observable(
    {
        value,
        effect,

      // ToDo: Можно реагировать на присваивание через =
        set(newValue) {
            let postEffect;

            if (typeof effect === "function") {
                postEffect = effect(newValue, this.value);
            }

            this.value = newValue;

            if (typeof postEffect === "function") {
                postEffect(newValue, this.value);
            }
        },
        reset() {
            this.value = value;
        }
    },
    {
        set: action.bound,
        reset: action.bound,
    }
);
