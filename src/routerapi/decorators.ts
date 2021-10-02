export function get(route: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(
      'request:type',
      {
        type: 'GET',
        route,
      },
      target,
      propertyKey
    );
    // console.log(target.get);
  };
}

export enum RequestType {
  GET,
  POST,
}
