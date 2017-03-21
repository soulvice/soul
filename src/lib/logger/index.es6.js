/*
  soul

  the soul of your applications in one place.
*/

import SoulLogger from './SoulLogger'

export default function (opts={}) {
  let adapter = new SoulLogger({
    domain: opts.domain,
    env: opts.env,
    mode: opts.mode,
    level: opts.level,
    transports: opts.transports,
    rotation: opts.rotation,
    path: opts.path,
    loggly: opts.loggly,
  });

  return adapter;
}
