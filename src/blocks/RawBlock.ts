export class RawBlock {
  public constructor(
    public titleLine: string,
    public metadataLine: string,
    public contentLines: string
  ) {}

  /**
   * Lines for a My Clippings block entry.
   *
   * Lines are expected to be as follows:
   * - Line 0 - title
   * - Line 1 - metadata
   * - Lines 2+ - content
   */
  public static parse(lines: string[]): RawBlock {
    const [title, metadata, ...content] = lines.filter(
      (el) => el.trim() !== ''
    );
    return new RawBlock(title, metadata, content.join('\n'));
  }
}
