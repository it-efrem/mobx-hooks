import {action, observable} from "mobx"

export const Status = {
  NOT_USED_YET: 'NOT_USED_YET',
  PENDING: 'PENDING',
  READY: 'READY',
  ERROR: 'ERROR',
};

export const useStatus = ({
                            value,
                            status
                          } = {}) => observable(
  {
    value,
    status,

    get isPending() {
      return this.status === Status.PENDING
    },
    get isReady() {
      return this.status === Status.READY
    },
    get isError() {
      return this.status === Status.ERROR
    },

    set(status, value) {
      if (status) {
        this.status = status;
      }

      if (value) {
        this.value = value;
      }

      if (status === Status.ERROR) {
        console.error(value);
      }
    },
    setValue(newValue) {
      return this.value = newValue
    },
    setStatus(newValue) {
      this.status = newValue
    },
    reset() {
      this.value = value;
      this.status = status;
    }
  },
  {
    set: action.bound,
    setValue: action.bound,
    setStatus: action.bound,
    reset: action.bound,
  }
);
