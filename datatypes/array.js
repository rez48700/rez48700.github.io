export class pArray {
    constructor(name, size, values = []) {
        this.name = name;
        this.size = size;
        this.values = new Array(size).fill(null);

        // populate initial values if provided
        for (let i = 0; i < values.length && i < size; i++) {
            this.values[i] = values[i];
        }
    }

    getName() {
        return this.name;
    }

    getSize() {
        return this.size;
    }

    getValue(index) {
        if (index < 0 || index >= this.size) return null;
        return this.values[index];
    }

    setValue(index, value) {
        if (index < 0 || index >= this.size) return;
        this.values[index] = value;
    }
}
