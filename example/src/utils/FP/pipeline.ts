const pipeline =
  (...fns: Function[]) =>
  (data?: any) =>
    fns.reduce((p, c) => c(p), data);

export default pipeline;
