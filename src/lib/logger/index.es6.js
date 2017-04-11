/*
  soul

  the soul of your applications in one place.
*/

import SoulLogger from './SoulLogger'

export default function (opts={}) {
  let adapter = new SoulLogger({
    domain: opts.domain || null,
    env: opts.env || null,
    mode: opts.mode || null,
    level: opts.level || null,
    transports: opts.transports || null,
    rotation: opts.rotation || null,
    path: opts.path || null,
    loggly: opts.loggly || null,
  });

  return adapter;
}
