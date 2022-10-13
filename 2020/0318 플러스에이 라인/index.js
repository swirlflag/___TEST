        Math.radians = function(degrees) {
            return degrees * Math.PI / 180;
        };

        class Pnt {
            constructor(i, y, a) {
                this.idx = i;
                this.x = 0;
                this.y = y;
                this.ty = y;
                this.a = a;
                this.ta = a;
            }

            pushInterval(val){
                this.y += val;
                // this.ty += val;
            }

            draw(){
                this.y += (this.ty - this.y) * (0.3 - this.idx * 0.01);
                this.a += (this.ta - this.a) * (0.06 - (this.idx * 0.002));
            }
        }

        var pntArray = [];

        class Canvas {
            constructor(id, width, height){
                this.canvas = document.getElementById(id);
                this.canvas.width = width;
                this.canvas.height = height;
                this.ctx = this.canvas.getContext('2d');
                this.cx = width / 2;
                this.cy = height / 2;
                this.cnt = 1;
                this.dir = -1;
                this.init();

                this.scrollgap = 0;
                this.targetPoint = 0;
            }

            init(){
                this.num = 23;
                this.lineStep = 15;
                // var sty = this.cy + -100 - this.num * this.lineStep / 2;
                var sty = this.cy - ((this.num * this.lineStep)/2);

                for(var i = 0; i < this.num; i++){
                    var pnt = new Pnt(i, sty + i * (this.lineStep + i * 0.2), 30)
                    pntArray.push(pnt)
                }
            }

            draw(){
                this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.strokeStyle = 'rgba(0, 26, 255, 1)';
                var lineWeightStep = 0.2;
                var lineWeight = 1 + pntArray.length * lineWeightStep;
                var nta = 0;
                if(this.cnt % 200 == 0){
                    nta = (Math.random() * 40 + 5) * this.dir;
                    this.dir *= -1;
                }


                for(var i = 0; i < pntArray.length; i++){
                    var pnt = pntArray[i];

                    if(this.cnt % 200 == 0){
                        pnt.ta = nta;
                    }
                    pnt.draw();
                    var ay = Math.tan(Math.radians(pnt.a)) * this.canvas.width;

                    // console.log(pnt.y + this.scrollgap);

                    // pnt.y = this.scrollgap;

                    var pnty1 = pnt.y + ay / 2;
                    var pnty2 = pnt.y - ay / 2;

                    this.ctx.lineWidth = lineWeight;
                    this.ctx.beginPath();
                    this.ctx.moveTo(pnt.x, pnty1);
                    this.ctx.lineTo(this.canvas.width, pnty2);
                    lineWeight -= lineWeightStep;
                    this.ctx.stroke();
                }

                this.cnt++;
            }
        }

        // Scroll Event
        var nowScrollY = 0;
        var prevScrollY = 0;

        var loopManager = new DX_loopManager();
        var canvas = new Canvas('union-plusa-canvas', 1000, ref_section.current.getBoundingClientRect().height);

        window.addEventListener('scroll', function(e) {
            prevScrollY = nowScrollY;
            nowScrollY = window.scrollY;
            var interval = nowScrollY - prevScrollY;
            for(var i = 0; i < pntArray.length; i++){
                var pnt = pntArray[i];
                pnt.pushInterval(interval);
            }
        });

        loopManager.register(canvas, 'draw');