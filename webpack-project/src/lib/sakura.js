//全屏樱花飘落
let stop, staticx; // eslint-disable-line no-unused-vars
let img = new Image();
img.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAYAAACbU/80AAAEWklEQVRIiZXWPYwdVxUH8N+5M7tv367X6w8cO05EmshSZCmNixTgDgmIoEHIXRQ+0lGCQk2PFPFRUVLQIEtIUCGUIoACUgqkoAQhgrCLSMTGH4v3670391LMnd3x7sOYI41m5t475///n3PumRtveypbxx7KkxbFkrEWTUu3YH5sTVfn/5ddwedxN7iJ2ZNAl5HQ9ePH55qnIHA9+AXO4R94GTeD954KeBgv/32+eX35+Bm8GXwXLwxjwWcTG4m/BHcGVcucB9JoLpCXrEtLxi7h2/gerg6Lhiv4UvBNrA2OYzTf1KudMHnxpPPjRXQ8BVfxM7w8VnXseSu4kXgfPw2yIKbECtESiVir7yPQtCQKA4Fn8S18NTjkPQ7v+DnxfDrnzbTij5IPoz0Ct1JDkLAgJpSDk0LGBBJewddxeTx5PL+BZkpskTa91Ky5ofGWxvZh7FeJhjzHdh+JJxFoXmcDzwa3E6fxXFRfY/UJaZ3mHGmrkjjlcpxyL53yp1gnNkhrpA3MKfvkPfLOkZjjKWi+xiz4CL8LbgdngysnimuL5izpDGmTNCFNnW+mLsfEu7Hqk1jtm06sUOaUR5iRt48AlxEYh/ijxN9qoV0dSLSXeuXNZlW5QbNBWsXEpWhcjsafI9wRtfA68iN0dPeOIpkdFmWLleYbHtti8DFuJV5pGhfT+V55s0k61Vd7Wq+hbtFKGi9JnlGcNndbZ69kul1tLOju9pgRPXhmPbgWPIh3Rnke3VdS67X2rB+nTdM4Qwxhr9vrcP8M94zO3TLzduk8yPt+n3fctm0x+7tcdm1lzheuFb5c+s76uXYotphgWgEm5ho3m6kvxsRXbEjNRN961kbFMbaEzqckNyyw8IVYiC67kE5ru133Cws8U2gyP8SkXX2xVxHHrtJ4KPwowsU0dT1NKZPaZMY56yg1uZGxoCzQ+XSZYb8vwswFNf/Rf/LXYNY2Fx3tkUQUNH2+ovFOhJ+kqaux4tzQa2NYX2pB5Uqk9OD5gLzQb8UDHJxowQdRf+9trFVFjhzHQKZvLr80caWE7wjTQ/X58ZIuWf+j7moEdiuRPXL3eA8ovF94AG0zqUDVcWkqoaNf3UPFDzSuRXg1BvCuOiv1ed7v/TzDHnmfbpeyc1j5h1EofFC4BW1sjsCG2zhefdL+lYq3aqG9CrnmX+mV5wPKrFdc9vq77T4Fg7s4cjk3RGA8ehj+Ic/jr/hNyR6V4lZkb2BFrvmdV/D9Xn33iPLvnsjAcbDMrLAzvLdp5QRQX0yVVCmPefgDPizZP0vxhpnnzegOKvgOebeqnve5H1tNwy4+qYilPQRadlxZbg8tfN/Cu+au532v5V3P2bGT90XedTrf70lUwA5d6TdY0p+2fjXIav8P4N6C0tmR/bosvFd2/TwWLuRHPpNnzuaPbZU+zBuFTf2JelZV38F9fDC4e5pT8UlrkSncKwv30C7u+60euNL0Alb1Ib+b2V/m6j/+9pdaopo6yAAAAABJRU5ErkJggg==";

let img2 = new Image();
img2.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAaCAYAAAC6nQw6AAADc0lEQVQ4jWWVT8imUxjGf9d9zitmqFn510xTUhYkSbJRk9kLRcmSFVuytrCzIlsrkSwsGCVlMaVEk3+hoQkxWdghvO85931ZPM/7fd/k1Ok89Tznd677us99P/rl3MOAwayrwQjqOYgPifgCYaKjCGiBIlB0KoKIgAg6AAjkZUU3Is5B3IF0v8SzVr94AGmB1K6A0ILgYAjgMYW+c8TdtH4VrT/g6E8q4rr/QVpbIR1oxBrTKUnvEP0top+IvkGto96OqbfH6f2sWmykhg8gbYUIJELS04S+stpDioba8oH6skFtc5LWXrb6zW7r+1jVrBABYbWNYnNCraFNQ32DeoO2wW0DvROtnYoeLyriau19OQIBCCJepek9bZoV3T6QvUG9o+jQNhCbJxT9KUcDhI5AbIjoraJtXnD0n2hNio5aW8KKTiyKUO92xKMQpyQdpsggF6Ho5WgXo7XzRDetEW0DrUFbzHU0UEgR90jcdggxdkEV4WioxZ9Ef0Wt/ax1MxGg1VQFhEA6hvSazK0LxFBF1STUgvXWXqC1l1DsUAOtZu6fiXVyA/hB250qKgdkEouZSxig84QuaQUsXtShoy6wr7L9iKuOVw6UuYDcGorlVEX7FuJ1VjO1JvZwePGl5n3O8bwy5Spck1gg7ENISS8LvmHVYies04ehNGWerczTrkGNSRyB7I8tw/u2TRW4WE4tmBPWUJzzdnJeXyPRHITUj0Kw828738b5FzVRevFhDMgBM3FNPOdx5nhGc1zjGouiIxCwIPMzZb5JpisnnjsqB85BjR0eE8/EmXdVjmspHzq5hygnlFWZH7tmem4hE+VYAJV47CC3OPNO2WdkCNtXQOzCNezcvevd7oLHpHbbZfNMmDuoiatQpWXfWzUJKCgfheAxYWz/cI5PmMPOgefE81+cE2ehKsBy5Vms40EZVS6QVT5zS2Vl7XYfkFNkrSYvdSUXS4kltq+TPPshZFJjoBzUTJgDVV2y/Ztr3oS9tHWSKi85shGctn1LuBaId7sFMibMAZWQ47JzXFTVeqOLKh/8bQQYT+BSdy0Qai6QnJBjNXP+g/WD4Qyufev43fCr4WvB55iPwLvu7Rac5G6gRcUegu0CfemlWM8BbwCfAj9ip7UWpKHjJLdb5IJ9RjyxjUtAfg+cBC5zdEhLR1hh/wE0531RLpgFlwAAAABJRU5ErkJggg==";

function Sakura(x, y, s, r, fn, img) {
  this.x = x;
  this.y = y;
  this.s = s;
  this.r = r;
  this.fn = fn;
  this.img = img;
}

Sakura.prototype.draw = function (cxt) {
  cxt.save();
  //这个数值是花瓣大小,电脑端网页 40 效果最好
  let xc = 20 * this.s;
  cxt.translate(this.x, this.y);
  cxt.rotate(this.r);
  cxt.drawImage(this.img, 0, 0, xc, xc);
  cxt.restore();
};

Sakura.prototype.update = function () {
  this.x = this.fn.x(this.x, this.y);
  this.y = this.fn.y(this.y, this.y);
  this.r = this.fn.r(this.r);
  if (
    this.x > window.innerWidth ||
    this.x < 0 ||
    this.y > window.innerHeight ||
    this.y < 0
  ) {
    this.r = getRandom("fnr");
    if (Math.random() > 0.4) {
      this.x = getRandom("x");
      this.y = 0;
      this.s = getRandom("s");
      this.r = getRandom("r");
    } else {
      this.x = window.innerWidth;
      this.y = getRandom("y");
      this.s = getRandom("s");
      this.r = getRandom("r");
    }
  }
};

let SakuraList;
SakuraList = function () {
  this.list = [];
};
SakuraList.prototype.push = function (sakura) {
  this.list.push(sakura);
};
SakuraList.prototype.update = function () {
  let i = 0,
    len = this.list.length;
  for (; i < len; i++) {
    this.list[i].update();
  }
};
SakuraList.prototype.draw = function (cxt) {
  let i = 0,
    len = this.list.length;
  for (; i < len; i++) {
    this.list[i].draw(cxt);
  }
};
SakuraList.prototype.get = function (i) {
  return this.list[i];
};
SakuraList.prototype.size = function () {
  return this.list.length;
};

function getRandom(option) {
  let ret, random;
  switch (option) {
    case "x":
      ret = Math.random() * window.innerWidth;
      break;
    case "y":
      ret = Math.random() * window.innerHeight;
      break;
    case "s":
      ret = Math.random();
      break;
    case "r":
      ret = Math.random() * 6;
      break;
    case "fnx":
      random = -0.5 + Math.random();
      ret = function (x) {
        return x + 0.5 * random;
      };
      break;
    case "fny":
      random = 1 + Math.random() * 0.7;
      ret = function (x, y) {
        return y + random;
      };
      break;
    case "fnr":
      random = Math.random() * 0.03;
      ret = function (r) {
        return r + random;
      };
      break;
  }
  return ret;
}

export function startSakura() {
  let requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;
  let canvas = document.createElement("canvas"),
    cxt;
  staticx = true;
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.setAttribute(
    "style",
    "position: fixed;left: 0;top: 0;pointer-events: none;z-index: 1"
  );
  canvas.setAttribute("id", "canvas_sakura");
  document.getElementsByTagName("body")[0].appendChild(canvas);
  cxt = canvas.getContext("2d");
  let sakuraList = new SakuraList();
  for (let i = 0; i < 10; i++) {
    let sakura,
      randomX,
      randomY,
      randomS,
      randomR,
      randomFnx,
      randomFny,
      randomFnR,
      imgSrc;
    randomX = getRandom("x");
    randomY = getRandom("y");
    randomR = getRandom("r");
    randomS = getRandom("s");
    randomFnx = getRandom("fnx");
    randomFny = getRandom("fny");
    randomFnR = getRandom("fnr");
    imgSrc = Math.random() > 0.5 ? img : img2;
    sakura = new Sakura(
      randomX,
      randomY,
      randomS,
      randomR,
      {
        x: randomFnx,
        y: randomFny,
        r: randomFnR,
      },
      imgSrc
    );
    sakura.draw(cxt);
    sakuraList.push(sakura);
  }
  stop = requestAnimationFrame(function reverse() {
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    sakuraList.update();
    sakuraList.draw(cxt);
    stop = requestAnimationFrame(reverse);
  });
}

window.onresize = function () {
  let canvasSnow = document.getElementById("canvas_sakura");
  canvasSnow.width = window.innerWidth;
  canvasSnow.height = window.innerHeight;
};

// img.onload = function() {
//    startSakura();
// }

let imgArr = [img, img2];
imgArr.forEach((item, index) => {
  item.onload = function () {
    if (index == 1) {
      startSakura();
    }
  };
});

export function stopp() {
  if (staticx) {
    let child = document.getElementById("canvas_sakura");
    child.parentNode.removeChild(child);
    window.cancelAnimationFrame(stop);
    staticx = false;
  } else {
    startSakura();
  }
}
