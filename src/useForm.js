import {action, observable} from "mobx";

/**
 *
 * @param fields {
 *     initialValue,
 *     validate,
 *     checkErrorsOnMount,
 * }
 */
export const useForm = (fields = {}) => {
    const fieldsTransformed = {};

    Object.entries(fields).forEach(([filedName, fieldProps]) => {
        fieldsTransformed[filedName] = {
            ...fieldProps,
            value: fieldProps.initialValue,
            setter: () => {
                console.log('setter', filedName)
            }
        }
    });

    return observable(
        {
            fields: fieldsTransformed,
            setValue(nameField, newValue) {
                try {
                    if (typeof this.fields[nameField].setValueProxy === "function") {
                        const result = this.fields[nameField].setValueProxy(newValue);
                        this.fields[nameField].value = result;
                    } else {
                        this.fields[nameField].value = newValue;
                    }

                    this.fields[nameField].$$_firstChanged = true;
                } catch (e) {
                    console.error('useForm.setValue error', e);
                }
            },
            setValues(fieldsObject) {
                Object.entries(fieldsObject).forEach(([fieldName, fieldValue]) => {
                    this.fields[fieldName] = {
                        ...this.fields[fieldName],
                        value: fieldValue,
                    }
                });
            },

            // ToDo: computed?
            get values() {
                const values = {};

                Object.entries(this.fields).forEach(([fieldName, field]) => {
                    // ToDo: 'transform' Rename it?
                    if (typeof field.transform === "function") {
                        values[fieldName] = field.transform(field.value);
                    } else {
                        values[fieldName] = field.value;
                    }
                });

                return values;
            },

            // ToDo: computed?
            // ToDo: Добавить возможность валидации взаимозависимых полей
            validate() {
                let fields = {};
                let isValid = true;
                let countErrors = 0;
                let countNotFilledRequiredFields = 0;

                Object.entries(this.fields).forEach(([fieldName, fieldProps]) => {
                    try {
                        // ToDo: Можно убрать required, т.к. по сути это дублирование логики validate,
                        //  лучше написать функцию для required в validate
                        if (fieldProps.required && !fieldProps.value) {
                            ++countNotFilledRequiredFields;
                        }

                        // ToDo: Когда уберу required условие станет не верным, валидация не будет происходить без
                        //  изменений
                        // ToDo: Возможно стоит переименовать validate, т.к. он по факту возвращает ошибку
                        if (typeof fieldProps.validate === "function") {
                            if (fieldProps.checkErrorsOnMount || fieldProps.$$_firstChanged) {
                                const error = fieldProps.validate(fieldProps.value);
                                fields[fieldName] = error;

                                if (error) {
                                    ++countErrors;
                                }
                            }
                        }
                    } catch (e) {
                        console.error('useForm.validate error', e);
                    }
                });

                if (countNotFilledRequiredFields || countErrors) {
                    isValid = false;
                }

                return {
                    fields,
                    isValid,
                    countErrors,
                    countNotFilledRequiredFields
                };
            },
            resetValues() {
                Object.keys(this.fields).forEach((fieldName) => {
                    try {
                        const resetObj = {
                            ...this.fields[fieldName],
                            value: this.fields[fieldName].initialValue,
                            $$_firstChanged: false
                        };

                        this.fields[fieldName] = resetObj;
                    } catch (e) {
                        console.error('useForm.resetValues error', e);
                    }
                });
            }
        },
        {
            setValue: action.bound,
            setValues: action.bound,
            resetValues: action.bound,
        }
    );
};
