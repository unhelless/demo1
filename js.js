
$(document).ready(function () {
    var input = $('.field').find('input, textarea');
    input.keyup(function () {
        inputTest(this);
    });
});

function inputTest(that) {
    var field = $(that).closest('.field');
    var form = $(that).closest('form, .form');
    var length = $.trim($(that).val()).length;

    //  FILLED
    if (length > 0) field.addClass('filled');else field.removeClass('filled');

    //  VALIDATED
    if (length >= 4) {
        field.addClass('validated');
        form.addClass('validated');
    } else {
        field.removeClass('validated');
        form.removeClass('validated');
    }
}
var Timer = {
    length: null,
    time: null,
    selector: null,
    interval: null,
    callback: null,

    //  RUN
    run: function (selector, callback, length) {
        Timer.length = length;
        Timer.time = Timer.length;
        Timer.selector = selector;
        Timer.callback = callback;
        $(Timer.selector).text(Timer.length);
        Timer.interval = setInterval(Timer.count, 1000);
    },

    //  COUNT
    count: function () {
        Timer.time = Timer.time - 1;
        $(Timer.selector).text(Timer.time);
        if (Timer.time <= 0) {
            if (typeof Timer.callback === 'function' && Timer.callback) Timer.callback();
            Timer.reset();
        }
    },

    //  RESET
    reset: function () {
        clearInterval(Timer.interval);
        Timer.length = null;
        Timer.time = null;
        Timer.selector = null;
        Timer.interval = null;
        Timer.callback = null;
    }
};
var Identity = {
    duration: 1400,
    delay: 500,
    iteration: 0,
    processing: false,
    enough: false,
    interval: null,
    callback: null,
    status: 'loading',
    id: '#identity',
    selector: '#identity div',
    classes: 'working rest robot',

    //  WORK
    work: function () {
        if (Identity.status != 'loading') Identity.status = 'working';
        Identity.wait(function () {
            $(Identity.id).addClass('working');
        });
    },

    //  ROBOT
    robot: function () {
        Identity.status = 'robot';
        Identity.wait(function () {
            $(Identity.id).addClass('robot');
        });
    },

    //  REST
    rest: function () {
        Identity.abort();
        Identity.status = 'rest';
        setTimeout(function () {
            Identity.abort();
            $(Identity.id).addClass('rest');
        }, Identity.delay);
    },

    //  WAIT
    wait: function (call) {
        if (Identity.processing != true) {
            Identity.abort();
            Identity.processing = true;

            setTimeout(function () {
                if (typeof call === 'function' && call) call();
                Identity.waiting();
                Identity.interval = setInterval(Identity.waiting, Identity.duration);
            }, Identity.delay);
        }
    },

    //  WAITING
    waiting: function () {
        if (Identity.enough != true) {
            ++Identity.iteration;
            return;
        }

        Identity.stopping();
    },

    //  STOP
    stop: function (callback) {
        setTimeout(function () {
            if (Identity.processing == true) {
                Identity.enough = true;
                Identity.callback = callback;

                $(Identity.selector).attr('style', 'animation-iteration-count: ' + Identity.iteration + '; -webkit-animation-iteration-count: ' + Identity.iteration + ';');
            }
        }, Identity.delay);
    },

    //  STOPPING
    stopping: function () {
        clearInterval(Identity.interval);
        Identity.rest();

        if (typeof Identity.callback === 'function' && Identity.callback) Identity.callback();
        Identity.reset();
    },

    //  ABORT
    abort: function () {
        if (Identity.status == 'robot') $(Identity.id).removeClass('robot');else if (Identity.status != 'loading' && Identity.processing != true) $(Identity.id).removeClass(Identity.classes + ' loading');else $(Identity.id).removeClass(Identity.classes);
    },

    //  RESET
    reset: function () {
        Identity.iteration = 0;
        Identity.processing = false;
        Identity.enough = false;
        Identity.interval = null;
        Identity.callback = null;

        $(Identity.selector).removeAttr('style');
    }
};
var Stars = {
    canvas: null,
    context: null,
    circleArray: [],
    colorArray: ['#4c1a22', '#4c1a23', '#5d6268', '#1f2e37', '#474848', '#542619', '#ead8cf', '#4c241f', '#d6b9b1', '#964a47'],

    mouseDistance: 50,
    radius: .5,
    maxRadius: 1.5,

    //  MOUSE
    mouse: {
        x: undefined,
        y: undefined,
        down: false,
        move: false
    },

    //  INIT
    init: function () {
        this.canvas = document.getElementById('stars');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.display = 'block';
        this.context = this.canvas.getContext('2d');

        window.addEventListener('mousemove', this.mouseMove);
        window.addEventListener('resize', this.resize);

        this.prepare();
        this.animate();
    },

    //  CIRCLE
    Circle: function (x, y, dx, dy, radius, fill) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
        this.minRadius = this.radius;

        this.draw = function () {
            Stars.context.beginPath();
            Stars.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            Stars.context.fillStyle = fill;
            Stars.context.fill();
        };

        this.update = function () {
            if (this.x + this.radius > Stars.canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
            if (this.y + this.radius > Stars.canvas.height || this.y - this.radius < 0) this.dy = -this.dy;

            this.x += this.dx;
            this.y += this.dy;

            //  INTERACTIVITY
            if (Stars.mouse.x - this.x < Stars.mouseDistance && Stars.mouse.x - this.x > -Stars.mouseDistance && Stars.mouse.y - this.y < Stars.mouseDistance && Stars.mouse.y - this.y > -Stars.mouseDistance) {
                if (this.radius < Stars.maxRadius) this.radius += 1;
            } else if (this.radius > this.minRadius) {
                this.radius -= 1;
            }

            this.draw();
        };
    },

    //  PREPARE
    prepare: function () {
        this.circleArray = [];

        for (var i = 0; i < 1200; i++) {
            var radius = Stars.radius;
            var x = Math.random() * (this.canvas.width - radius * 2) + radius;
            var y = Math.random() * (this.canvas.height - radius * 2) + radius;
            var dx = (Math.random() - 0.5) * 1.5;
            var dy = (Math.random() - 1) * 1.5;
            var fill = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];

            this.circleArray.push(new this.Circle(x, y, dx, dy, radius, fill));
        }
    },

    //  ANIMATE
    animate: function () {
        requestAnimationFrame(Stars.animate);
        Stars.context.clearRect(0, 0, Stars.canvas.width, Stars.canvas.height);

        for (var i = 0; i < Stars.circleArray.length; i++) {
            var circle = Stars.circleArray[i];
            circle.update();
        }
    },

    //  RESIZE
    resize: function () {
        Stars.canvas.width = window.innerWidth;
        Stars.canvas.height = window.innerHeight;
    }
};






