interface IAlphabet {
  [key: string]: IAlphabet | string;
}

class Vigenere {
  _key: string = "AYUSH";
  _ignoreKeys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    " ",
    "\r",
    ",",
    ".",
  ];
  _alphabets: IAlphabet = {};

  constructor() {
    const baseAlphabet = [];
    for (let charCode = 65; charCode <= 90; charCode++) {
      const letter = String.fromCharCode(charCode);
      baseAlphabet.push(letter);
    }
    let alphabet = baseAlphabet.slice(0);
    for (let col = 0; col < alphabet.length; col++) {
      const line: IAlphabet = {};
      for (let row = 0; row < alphabet.length; row++) {
        line[baseAlphabet[row]] = alphabet[row];
      }

      this._alphabets[alphabet[0]] = Object.assign(line);
      const firstChar = alphabet[0];
      alphabet = alphabet.slice(1);
      alphabet.push(firstChar);
    }
  }

  setKey(key: string) {
    this._key = key.toUpperCase();
  }

  getKeyForInput(input: string) {
    let key = this._key;
    while (key.length < input.length) {
      key += this._key;
    }
    return key.substring(0, input.length);
  }

  encode(input: string): string {
    if (!this._key) {
      return input;
    }

    input = input.toLocaleUpperCase();
    let result = "";
    const key = this.getKeyForInput(input);

    for (let index = 0; index < input.length; index++) {
      if (this._ignoreKeys.indexOf(input[index]) !== -1) {
        result += input[index];
        continue;
      }

      const cipherRow = input[index];
      const cipherCol = key[index];

      result += (this._alphabets[cipherRow] as IAlphabet)[cipherCol];
    }

    return result;
  }

  decode(input: string): string {
    if (!this._key) {
      return input;
    }
    var key = this.getKeyForInput(input);
    let result = "";
    for (let index = 0; index < key.length; index++) {
      if (this._ignoreKeys.indexOf(input[index]) !== -1) {
        result += input[index];
        continue;
      }
      const alphabetSelector = key[index];
      const currentAlphabet = this._alphabets[alphabetSelector] as IAlphabet;
      const keySelector = input[index];

      result += Object.getOwnPropertyNames(currentAlphabet).filter(
        (key) => currentAlphabet[key] === keySelector
      )[0];
    }

    return result;
  }
}

export default new Vigenere();
