import {makeAutoObservable} from "mobx";

export const Status = {
  NOT_USED_YET: 'NOT_USED_YET',
  PENDING: 'PENDING',
  READY: 'READY',
  ERROR: 'ERROR',
};

export const useStatus = ({
                            value: initial_value,
                            status: initial_status
                          } = {}) => {
  // ToDo: use autobind for methods

  const symbol_value = "value" //Symbol("value")
  const symbol_status = "status" //Symbol("status")

  function createGetters(value) {
    // ToDo: check for other types
    if (typeof value === "object") {
      Object.keys(value).forEach((prop_name) => {
        if (this[prop_name] === undefined) {
          Object.defineProperty(this, prop_name, {
            configurable: true,
            get: function () {
              if (this[symbol_value] !== undefined) {
                return this[symbol_value][prop_name]
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
    [symbol_value]: initial_value,
    [symbol_status]: initial_status,

    get isNotUsed() {
      return this[symbol_status] === Status.NOT_USED_YET
    },
    get isPending() {
      return this[symbol_status] === Status.PENDING
    },
    get isReady() {
      return this[symbol_status] === Status.READY
    },
    get isError() {
      return this[symbol_status] === Status.ERROR
    },

    getStatus() {
      return this[symbol_status]
    },
    getValue() {
      return this[symbol_value]
    },

    // ToDo: if newValue is string, observer don't react on change
    set(newStatus, newValue) {
      this.setStatus(newStatus);
      this[symbol_value] = newValue;
      createGetters.call(this, newValue)
    },
    setValue(newValue) {
      this[symbol_value] = newValue
      createGetters.call(this, newValue)
    },
    setStatus(newValue) {
      // ToDo: enum check
      this[symbol_status] = newValue
    },
    reset() {
      this[symbol_value] = initial_value;
      this[symbol_status] = initial_status;
    }
  }

  // constructor
  createGetters.call(obj, obj[symbol_value])

  // ToDo: makeAutoObservable didn't work with Symbol
  //  See: https://github.com/mobxjs/mobx/issues/2628
  return makeAutoObservable(obj)
};