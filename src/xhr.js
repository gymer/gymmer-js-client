export let xhr = {
  request(options = {url: null, method: "GET", async: true, headers: {}}) {
    let XHR = new XMLHttpRequest();
    XHR.open(options.method, options.url, options.async);
    // XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    XHR.send(JSON.stringify(options.data));

    return new Promise((resolve, reject) => {
      XHR.onreadystatechange = function() {
        if (XHR.readyState != 4) return;


        if (XHR.status != 200) {
          reject(XHR);
        } else {
          resolve(XHR);
        }
      };
    });
  }
};
