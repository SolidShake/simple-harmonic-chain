function main_dl_example_Radio() {

	var mathMethods = Object.getOwnPropertyNames(Math);
	for (var i in mathMethods)
		this[mathMethods[i]] = Math[mathMethods[i]];
	
    var ctx = canva.getContext("2d");
	var w = canva.width;
	var h = canva.height;

	var ctx_u = canva_u.getContext("2d");
	var w_u = canva_u.width;
	var h_u = canva_u.height;

	var ctx_energy = canva_energy.getContext("2d");
	var w_energy = canva_energy.width;
	var h_energy = canva_energy.height;

	var step = +(document.getElementById('Step').value);
	var Mid = +(document.getElementById('Middle').value);

	var particles = [];

	var hold_check_left = 0;
	var hold_check_right = 0;
	var hold_check_both = 0;

	var memory_kin = 0;
	var memory_pot = 0;
	var memory_kin_after = 0;
	var memory_pot_after = 0;

	var T0 = 1;
	var C0 = 1;
	var m0 = 1;
	
	var N = 0;
	var EMax = 0;
	var U_Max = 0;
	var R = 1;
	var dt  = step * T0;
	var t = 0;
	var tMax = 20 * T0;	
	var fps = 40;	
	var N = +(document.getElementById('Quantity').value);
	
	hold_left.onchange = function() {hold_check_left = 1; hold_check_right = 0; hold_check_both = 0;}
	hold_right.onchange = function() {hold_check_right = 1; hold_check_left = 0; hold_check_both = 0;}
	hold_both.onchange = function() {hold_check_both = 1; hold_check_left = 0; hold_check_right = 0; }
	free_both.onchange = function() {hold_check_left = 0; hold_check_right = 0; hold_check_both = 0;}	
	
	New.onclick = function() {
		N = +(document.getElementById('Quantity').value);
		step = +(document.getElementById('Step').value);
		dt  = step * T0;
		particles = [];
		count();
		particles[+(document.getElementById('Number').value)].v = +(document.getElementById('Speed').value);
		particles[+(document.getElementById('Number').value)].u = +(document.getElementById('u').value) / 180 * PI;
		ctx_energy.clearRect(0,0,w_energy,h_energy);	
	}
	
	Rand.onclick = function() {
	t = 0;
	particles = [];
	count();
	ctx_energy.clearRect(0,0,w_energy,h_energy);
	Mid = +(document.getElementById('Middle').value);
	for (var i = 1; i < particles.length - 1; i++)
		particles[i].v = random() * Mid - random() * Mid;	
		console.log(Mid);	
	}

	function control(){	
		phys();
		draw1();
		draw2();
		draw3();
	}

	function count(){
	for (var i = 1; i < N + 1; i++) {
        var b = [];
        b.x0 = R * i;             // расчетные координаты начального положения частицы
        b.F = 0;   b.v = 0;  b.u = 0;   //  момент; угловая скорость; угол поворота
        particles[i] = b;               // добавить элемент в массив
    }
	if ((hold_check_right != 1) || (hold_check_left != 1) || (hold_check_both != 1)){
		particles[0] = particles[N]; 
		particles[N+1] = particles[1];
	}
	else{
	b.x0 = R * i;
	b.F = 0;   b.v = 0;  b.u = 0;
	prtciles[0] = b;
	particles[N+1] = b;
	}

    memory_kin_after = 0;
	memory_pot_after = 0;
	t = 0
	EMax = 0		
    U_Max = 0;

	for (var i=1; i<particles.length-1; i++) {
			if (abs(particles[i].u) > U_Max)
				U_Max = abs(particles[i].u);	
			}
	}

	function phys(){
		memory_kin = memory_kin_after;
		memory_pot = memory_pot_after;
		memory_kin_after = 0;
		memory_pot_after = 0;
		for (var i=1; i<particles.length-1; i++) {
				particles[i].F = C0 * (particles[i+1].u - 2 * particles[i].u + particles[i-1].u);
				particles[i].v += particles[i].F / m0 * dt;
				memory_kin_after += m0 * particles[i].v * particles[i].v / 2;
				memory_pot_after +=  - C0 * (cos(particles[i+1].u - particles[i].u) - 1);
			}
		
		if (memory_kin_after > EMax)
			EMax = memory_kin_after;
		

		if (hold_check_left == 1){
			particles[1].v = 0;
		}	

		if (hold_check_right == 1){
			particles[N].v  = 0;
		}
		
		if (hold_check_both == 1){
			particles[1].v = 0;
			particles[N].v  = 0;
		}
		
		
			
			
		for (var i = 1; i < particles.length-1; i++) {
			particles[i].u += particles[i].v * dt;
			if (abs(particles[i].u) > U_Max)
				U_Max = abs(particles[i].u);
		}

		t += dt;
		if (t >= 5 * tMax){
			t = 0;
			ctx_energy.clearRect(0, 0, w_energy, h_energy);
		}
	}


    function draw1(){	
		ctx.clearRect(0,0,w,h);
		ctx.beginPath();
		ctx.fillStyle="#00ffff"; 

		for (var i=1; i<particles.length - 1; i++)
		{
    		ctx.arc((particles[i].x0 + particles[i].u) * w / (N+2), h/2, 30, 0, 2*Math.PI);
    		ctx.stroke();
		}
		
		ctx.fill();

	}	

	function draw2(){	
		ctx_u.clearRect(0,0,w_u,h_u);

		ctx_u.beginPath();
		ctx_u.moveTo(0, h_u/2);
		ctx_u.lineTo(w_u, h_u/2);
		ctx_u.strokeStyle = '#bbbbbb';
		ctx_u.lineWidth = '3';
		ctx_u.stroke();
		
		
		ctx_u.beginPath();		
		ctx_u.moveTo(particles[1].x0 * w_u / (N+2), h_u/2 - particles[1].u * h_u / U_Max / 2);
		for (var i = 2; i<particles.length - 1; i++){	
			ctx_u.lineTo(particles[i].x0 * w_u / (N+2), h_u/2 - particles[i].u * h_u / U_Max / 2);
		}
		
		ctx_u.strokeStyle = '#bb0000';
		ctx_u.lineWidth = '3';	
		ctx_u.stroke();
	}

	function draw3(){
		ctx_energy.beginPath();		
		ctx_energy.moveTo((t - dt) * w_energy / (5 * tMax), h_energy - memory_kin * h_energy / EMax);			
		ctx_energy.lineTo(t * w_energy / (5 * tMax), h_energy - memory_kin_after * h_energy / EMax);
		
		ctx_energy.strokeStyle = '#bb0000';
		ctx_energy.lineWidth = '2';	
		ctx_energy.stroke();

		ctx_energy.beginPath();		
		ctx_energy.moveTo((t - dt) * w_energy / (5 * tMax), h_energy - memory_pot * h_energy / EMax);			
		ctx_energy.lineTo(t * w_energy / (5 * tMax), h_energy - memory_pot_after * h_energy / EMax);
		
		ctx_energy.strokeStyle = '#00bb00';
		ctx_energy.lineWidth = '2';	
		ctx_energy.stroke();
    }
	
	count();
	particles[+(document.getElementById('Number').value)].u = +(document.getElementById('u').value) / 180 * PI;
	setInterval(control, 1000 / fps);
	
}