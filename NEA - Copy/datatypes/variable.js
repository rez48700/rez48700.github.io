export class pVariable {
    constructor(givenName, givenValue) {
        this.name = givenName;
        this.value = givenValue;
    }

    getName() {
        return this.name;
    }

    getValue() {
        return this.value;
    }

    setValue(newValue) {
        this.value = newValue;
    }
}