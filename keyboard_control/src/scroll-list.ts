import { BaseUi } from "./base-ui.js";
import chalk from "chalk";

export class ScrollList extends BaseUi { 
  curSelectIndex = 0;
  scrollTop = 0;

  constructor( private list: string[] = []) {
    super();
    this.render();
  }
  
  onKeyInput(name: string) {
    if (name!= "up" && name != "down") {
      return;
    }

    const action: Function = this.KEYS[name];
    action();
    this.render();
  }

  private readonly KEYS = {
    up: () => this.cursorUp(),
    down: () => this.cursorDown()
  }

  cursorUp() {
    this.moveCursor(-1);
  }

  cursorDown(){
    this.moveCursor(1);
  }

  private moveCursor(offset: number) {
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

    if (shouldScrollUp){
      this.scrollTop -= 1;
    }

    if (shouldScrollDown) {
      this.scrollTop +=1;
    }

    this.clear();
  }

  clear() {
    for (let i = 0; i < this.terminalSize.rows; i++) {
      this.clearLine(i)
    }
  }

  bgRow(text: string) {
    return chalk.bgBlue(text + ' '.repeat(this.terminalSize.columns - text.length));
  }

  render(): void {
    const visibleList = this.list.slice(this.scrollTop, this.scrollTop + this.terminalSize.rows);

    visibleList.forEach((item, idx) => {
      const row = idx;

      this.clearLine(row);
      let content = item;

      if (this.curSelectIndex === this.scrollTop + idx) {
        this.printAt(this.bgRow(""), {x: 0, y: row})
        content = chalk.bgBlue(content);
      }

      this.printAt(content, { x: 0, y: row });
    }) 
  }
 }