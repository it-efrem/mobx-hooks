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
                          } = {}) => {
  function createGetters(value) {
    if (value !== undefined) {
      Object.entries(value).forEach(([prop_name, value]) => {
        if (this[prop_name] === undefined) {
          Object.defineProperty(this, prop_name, {
            get: function () {
              if (this.value !== undefined) {
                return this.value[prop_name]
              } else {
                return undefined
              }
            }
          })
        }
      })
    }
  }

  const obj = {
    value,
    status,

    get isNotUsed() {
      return this.status === Status.NOT_USED_YET
    },
    get isPending() {
      return this.status === Status.PENDING
    },
    get isReady() {
      return this.status === Status.READY
    },
    get isError() {
      return this.status === Status.ERROR
    },

    set(status, newValue) {
      createGetters.call(this, newValue)

      if (status) {
        this.status = status;
      }

      if (newValue) {
        this.value = newValue;
      }

      if (status === Status.ERROR) {
        console.error(newValue);
      }
    },
    setValue(newValue) {
      createGetters.call(this, newValue)

      return this.value = newValue
    },
    setStatus(newValue) {
      this.status = newValue
    },
    reset() {
      this.value = value;
      this.status = status;
    }
  }

  // constructor
  createGetters.call(this, obj.value)

  // ToDo: use makeAutoObservable
  return observable(
    obj,
    {
      set: action.bound,
      setValue: action.bound,
      setStatus: action.bound,
      reset: action.bound,
    }
  )
};
