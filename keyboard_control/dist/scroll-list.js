import { BaseUi } from "./base-ui.js";
import chalk from "chalk";
export class ScrollList extends BaseUi {
    constructor(list = []) {
        super();
        this.list = list;
        this.curSelectIndex = 0;
        this.scrollTop = 0;
        this.KEYS = {
            up: () => this.cursorUp(),
            down: () => this.cursorDown()
        };
        this.render();
    }
    onKeyInput(name) {
        if (name != "up" && name != "down") {
            return;
        }
        const action = this.KEYS[name];
        action();
        this.render();
    }
    cursorUp() {
        this.moveCursor(-1);
    }
    cursorDown() {
        this.moveCursor(1);
    }
    moveCursor(offset) {
        this.curSelectIndex += offset;
        if (this.curSelectIndex < 0) {
            this.curSelectIndex = 0;
        }
        if (this.curSelectIndex >= this.list.length) {
            this.curSelectIndex = this.list.length - 1;
        }
        this.fitScroll();
    }
    fitScroll() {
        const shouldScrollUp = this.curSelectIndex < this.scrollTop;
        const shouldScrollDown = this.curSelectIndex > this.scrollTop + this.terminalSize.rows;
        if (shouldScrollUp) {
            this.scrollTop -= 1;
        }
        if (shouldScrollDown) {
            this.scrollTop += 1;
        }
        this.clear();
    }
    clear() {
        for (let i = 0; i < this.terminalSize.rows; i++) {
            this.clearLine(i);
        }
    }
    bgRow(text) {
        return chalk.bgBlue(text + ' '.repeat(this.terminalSize.columns - text.length));
    }
    render() {
        const visibleList = this.list.slice(this.scrollTop, this.scrollTop + this.terminalSize.rows);
        visibleList.forEach((item, idx) => {
            const row = idx;
            this.clearLine(row);
            let content = item;
            if (this.curSelectIndex === this.scrollTop + idx) {
                this.printAt(this.bgRow(""), { x: 0, y: row });
                content = chalk.bgBlue(content);
            }
            this.printAt(content, { x: 0, y: row });
        });
    }
}
