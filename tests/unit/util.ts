export const simpleMock = <T>(): T => {
  const cls = jest.fn<T, []>();
  return new cls();
};
