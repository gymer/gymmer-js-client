export default {
  merge(...objects: Object[]) {
    var dst = {},
        src, p;

    while (objects.length > 0) {
      src = objects.splice(0, 1)[0];
      if (toString.call(src) == '[object Object]') {
        for (p in src) {
          if (src.hasOwnProperty(p)) {
            if (toString.call(src[p]) == '[object Object]') {
              dst[p] = this.merge(dst[p] || {}, src[p]);
            } else {
              dst[p] = src[p];
            }
          }
        }
      }
    }

    return dst;
  },

  stringify(...params: any[]) {
    return params.map(p => {
      if (typeof p === "object") {
        return JSON.stringify(p);
      } else if (p.toString) {
        return p.toString();
      }
      return "";
    }).join(" ");
  }
};
