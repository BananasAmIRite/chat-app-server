export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;

interface _Response<T, S extends boolean = boolean> {
  success: S;
  code: S extends true ? 200 : number;
  response?: [S] extends [true] ? T : [S] extends [false] ? undefined : T | undefined;
  error?: [S] extends [true] ? undefined : [S] extends [false] ? string : string | undefined;
}

export type Response<T, S extends boolean = boolean> = [S] extends [true]
  ? RequiredField<Omit<_Response<T, true>, 'error'>, 'response'>
  : [S] extends [false]
  ? RequiredField<Omit<_Response<T, false>, 'response'>, 'error'>
  : _Response<T, S>;

export type WebsocketResponse<T, S extends boolean = boolean> = Omit<Response<T, S>, 'code'>;

export type Acknowledgment = <T extends boolean>(res?: WebsocketResponse<any, T>) => void;
