import anisiEscapes from "ansi-escapes";
export class BaseUi {
    constructor() {
        this.stdout = process.stdout;
    }
    print(text) {
        process.stdout.write.bind(process.stdout)(text);
    }
    setCursorAd({ x, y }) {
        this.print(anisiEscapes.cursorTo(x, y));
    }
    printAt(message, position) {
        this.setCursorAd(position);
        this.print(message);
    }
    clearLine(row) {
        this.printAt(anisiEscapes.eraseLine, { x: 0, y: row });
    }
    get terminalSize() {
        return {
            columns: this.stdout.columns,
            rows: this.stdout.rows
        };
    }
}
