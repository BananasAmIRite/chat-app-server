export default class WebError extends Error {
  public code: number;
  constructor(err: string, code: number) {
    super(err);
    this.code = code;
  }
}
