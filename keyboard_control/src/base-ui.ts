import anisiEscapes from "ansi-escapes";

export interface Position {
  x: number;
  y: number;
}

export abstract class BaseUi {
  private readonly stdout: NodeJS.WriteStream = process.stdout;

  protected print(text: string) {
    process.stdout.write.bind(process.stdout)(text);
  }

  protected setCursorAd({ x, y }: Position) {
    this.print(anisiEscapes.cursorTo(x, y));
  }

  protected printAt(message: string, position: Position) {
    this.setCursorAd(position);
    this.print(message);
  }

  protected clearLine( row: number) {
    this.printAt(anisiEscapes.eraseLine, { x: 0, y: row })
  }

  get terminalSize(): { columns: number; rows: number } {
    return {
      columns: this.stdout.columns,
      rows: this.stdout.rows
    }
  }

  abstract render(): void
}
