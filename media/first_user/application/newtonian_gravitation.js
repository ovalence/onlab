var world = {
	objects : [],
	lookAtPosition : [0,0,0],

	create : function(canvas_element_id) {
		this.scene = new THREE.Scene();
		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
		this.scene.add(this.ambientLight);
		this.clock = new THREE.Clock();

		this.light = new THREE.PointLight(0xffffff, 0.8, 50);
		this.light.position.set(3,10,0);
		this.light.shadow.camera.near = 0.1;
		this.light.shadow.camera.far = 100;
		this.scene.add(this.light);

		this.axes = new THREE.AxisHelper( 20 );
		this.scene.add(this.axes);

		this.gridXZ = new THREE.GridHelper(10, 10);
		this.scene.add(this.gridXZ);

		this.setRenderer(canvas_element_id);
		this.setCamera(1);

	},

	setCamera : function(perspective) {
		this.lookAtPosition = new THREE.Vector3(0,10,0);
		if (perspective==false) {
			this.camera = new THREE.OrthographicCamera(
				leftlimit,
				(this.viewport.scrollWidth/this.scrollHeight)*(toplimit - bottomlimit) + leftlimit,
				toplimit,
				bottomlimit,
				+500,
				-500);
			this.position.x = 0;
			this.position.y = 0;
			this.position.z = 50;
		}
		else {
			this.camera = new THREE.PerspectiveCamera(40, this.viewport.scrollWidth / this.viewport.scrollHeight, 0.1, 1000);
			this.camera.position.x = 0;
			this.camera.position.y = 5;
			this.camera.position.z = -30;
			this.camera.lookAt(this.lookAtPosition);
		}
	},

	setRenderer : function(canvas_element_id) {
		this.viewport = document.getElementById(canvas_element_id);
		this.renderer = new THREE.WebGLRenderer( {canvas: this.viewport } );
		this.renderer.setClearColor(0x88AAAA);
		this.renderer.setSize(this.viewport.scrollWidth, this.viewport.scrollHeight);	
	},

	render : function() {
		world.renderer.render(this.scene, this.camera);
		this.camera.lookAt(this.objects[1].mesh.position);
	},

	addObject : function (object) {
		this.objects[this.objects.length] = object;
		this.scene.add(object.mesh);
	},

	animate : function() {
		var delta = world.clock.getDelta();
		for (var i = 0 ; i<world.objects.length; i++) {
			world.objects[i].mesh.translateX(world.objects[i].velocity[0] * delta);
			world.objects[i].mesh.translateY(world.objects[i].velocity[1] * delta);
			world.objects[i].mesh.translateZ(world.objects[i].velocity[2] * delta);
		}
	}
}


function animate() {
	universe.applyGravity(world.objects);
	world.animate();
	world.render();
	time.value = world.clock.getDelta();
	requestAnimationFrame(animate);
}

var universe = {
	applyGravity : function(objects) {
		var G = 0.01;
		for (var i = 0; i < objects.length; i++) {
			var m1 = objects[i].mass;
			var xyz1 = [objects[i].mesh.position.x, objects[i].mesh.position.y, objects[i].mesh.position.z]
			var m2;
			var xyz2;
			var f = 0;
			var fx = 0;
			var fy = 0;
			var fz = 0;
			for (var j = 0; j< objects.length; j++) {
				if (j!= i) {
					m2 = objects[j].mass;
					xyz2 = [objects[j].mesh.position.x, objects[j].mesh.position.y, objects[j].mesh.position.z];
					dx = xyz2[0]-xyz1[0];
					dy = xyz2[1]-xyz1[1];
					dz = xyz2[2]-xyz1[2];
					d = Math.sqrt((dx**2) + (dy**2) + (dz**2))
					if (d > (objects[i].radius+objects[j].radius)) {
						f = (G* m1 * m2)/(d**2);
						fx += f*dx/(Math.abs(dx+dy+dz));
						fy += f*dy/(Math.abs(dx+dy+dz));
						fz += f*dz/(Math.abs(dx+dy+dz));
					}
				};
			}
			objects[i].applyForce(fx,fy,fz);
			object1vx.value = d;
		}
	},
	addObject : function(object) {
		this.objects[this.objects.length] = object;
	}
}

function matter(name, position_x, position_y, position_z, radius, hSegment, vSegment) {
	this.name = name;
	this.geometry = new THREE.SphereGeometry(radius, hSegment, vSegment);
	this.color = 0xff2222;
	this.material = new THREE.MeshPhongMaterial({color: this.color});		
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position.x = position_x;
	this.mesh.position.y = position_y;
	this.mesh.position.z = position_z;
	this.mass = 10;
	this.radius = radius;
	this.velocity = [0,0,0];
	this.applyForce = function(Fx, Fy, Fz) {
		this.velocity[0] += Fx/(this.mass);
		this.velocity[1] += Fy/(this.mass);
		this.velocity[2] += Fz/(this.mass);	
	};
	this.line = [];
}

function sliderXChange(value) {
	adjustX(parseInt(value));
	world.render();
	xDisplay = document.getElementById("x-value");
	xDisplay.value = world.camera.position.x;
}

function adjustX(value) {
	world.camera.position.x = value;
}

function sliderYChange(value) {
	adjustY(parseInt(value));
	world.render();
	yDisplay = document.getElementById("y-value");
	yDisplay.value = world.camera.position.y;
}

function adjustY(value) {
	world.camera.position.y = value;
}

function sliderZChange(value) {
	adjustZ(parseInt(value));
	world.render();
	zDisplay = document.getElementById("z-value");
	zDisplay.value = world.camera.position.z;
}

function adjustZ(value) {
	world.camera.position.z = value;
}

function init() {
	world.create("viewport");
	var matter1 = new matter("ball1", 0, 0, 0, 1, 20, 20);
	var matter2 = new matter("ball2", 10, 0, 0, 0.5, 20, 20);
	var matter3 = new matter("ball3", 5, 10, 10, 1, 20, 20);
	matter1.material.color.setHex(0x000088);
	matter2.material.color.setHex(0xff3333);
	world.addObject(matter1);
	world.addObject(matter2);
	//world.addObject(matter3);
	matter1.mass= 100;
	matter2.mass= 5;
	world.render();
	matter2.applyForce(0.1,2,2);
}

var playbutton = document.getElementById("PLAY_BUTTON");
playbutton.addEventListener("click", animate);

var object1vx = document.getElementById("OBJECT1VX");
var time = document.getElementById("TIME");

window.onload = init();
