var canvas1;
var animationID;
var renderer1_width;
var renderer1_height;
var scene, pers_camera1, ortho_camera1, renderer1;
var view_all = false;
var simulationHasStarted = false;
var simulationIsPlayed = false;
var redballcreated = false;
var yellowgreenballcreated = false;
var blueballcreated = false;
var created = false;
var clock;

var ambientLight, light;
var plane;
var redball, yellowgreenball, blueball;

var balls = [];
var arrows = [];
var redscale =1;
var yellowgreenscale =1;
var bluescale =1;
var position1 = new THREE.Vector3();
var position2 = new THREE.Vector3();
var position3 = new THREE.Vector3();
var dis = [[0,0,0],[0,0,0],[0,0,0]];
var vi = [[0,0,0],[0,0,0],[0,0,0]];
var vpi = [[0,0,0],[0,0,0],[0,0,0]];
var acc = [[0,0,0],[0,0,0],[0,0,0]];
var disf = [[0,0,0],[0,0,0],[0,0,0]];
var vf = [[0,0,0],[0,0,0],[0,0,0]];
var vpf = [[0,0,0],[0,0,0],[0,0,0]];
var an = [[0,0,0],[0,0,0],[0,0,0]];

var six_given = true;
var vix_given = true;
var ax_given = true;
var tf_given = true;
var sfx_given = false;
var vfx_given = false;

var siy_given = true;
var viy_given = true;
var ay_given = true;

var sfy_given = false;
var vfy_given = false;

var active_text;
var active_element;

var t0 = Date.now()/1000;
var t_previousDisplay;
var tf;
var maxTime;
var t_played = 0;

var keyboard = {};

var disp_loc = [];
var disp_vel = [];

//html elements

var eq1;
var text_dis = [[],[],[]];
var text_vi = [[],[],[]];
var text_vpi = [[],[],[]];
var text_acc = [[],[],[]];
var text_disf = [[],[],[]];
var text_vf = [[],[],[]];
var text_vpf = [[],[],[]];
var select_dis_unit = [[],[],[]];
var select_disf_unit = [[],[],[]];
var select_vi_unit = [[[],[]],[[],[]],[[],[]]];
var select_vf_unit = [[[],[]],[[],[]],[[],[]]];
var select_vpi_unit = [[],[],[]];
var select_vpf_unit = [[],[],[]];
var select_acc_unit = [[[],[]],[[],[]],[[],[]]];
var select_t1_unit;
var text_tf;
var toplimit;
var bottomlimit;
var leftlimit;
var rightlimit;

var range_timeseeker;
var text_timevalue;
var text_maxtime;
var text_toplimit;
var text_bottomlimit;
var text_leftlimit;
var text_rightlimit;
var select_display_unit;
var button_view_all;

window.onload = init;

function init(){
	getElements();
	initializeInternalValues();
	createWorld();
	createObjects();
	renderWorld();
	displayValues();
}

function getElements(){
	canvas1 = document.getElementById("canvas1");
	range_timeseeker = document.getElementById("TIMESEEKER");
	text_timevalue = document.getElementById("timevalue");
	text_maxtime = document.getElementById("maxtime");
	text_leftlimit = document.getElementById("leftlimit");
	text_rightlimit = document.getElementById("rightlimit");
	text_toplimit = document.getElementById("toplimit");
	text_bottomlimit = document.getElementById("bottomlimit");
	select_display_unit = document.getElementById("DISPLAY_UNIT");

	text_dis[0][0] = document.getElementById("PX1");
	text_dis[0][1] = document.getElementById("PY1");
		select_dis_unit[0][0] = document.getElementById("PXL_UNIT1");
		select_dis_unit[0][1] = document.getElementById("PYL_UNIT1");
	text_vi[0][0] = document.getElementById("VX1");
	text_vi[0][1] = document.getElementById("VY1");
		select_vi_unit[0][0][0] = document.getElementById("VXL_UNIT1");
		select_vi_unit[0][0][1] = document.getElementById("VXT_UNIT1");
		select_vi_unit[0][1][0] = document.getElementById("VYL_UNIT1");
		select_vi_unit[0][1][1] = document.getElementById("VYT_UNIT1");
	text_vpi[0][0] = document.getElementById("VM1");
	text_vpi[0][1] = document.getElementById("VA1");
		select_vpi_unit[0][0] = document.getElementById("VML_UNIT1");
		select_vpi_unit[0][1] = document.getElementById("VMT_UNIT1");
	text_acc[0][0] = document.getElementById("AX1");
	text_acc[0][1] = document.getElementById("AY1");
		select_acc_unit[0][0][0] = document.getElementById("AXL_UNIT1");
		select_acc_unit[0][0][1] = document.getElementById("AXT_UNIT1");
		select_acc_unit[0][1][0] = document.getElementById("AYL_UNIT1");
		select_acc_unit[0][1][1] = document.getElementById("AYT_UNIT1");

	text_tf = document.getElementById("T1");
	select_t1_unit = document.getElementById("T1_UNIT");
	text_disf[0][0] = document.getElementById("PX1F");
	text_disf[0][1] = document.getElementById("PY1F");
		select_disf_unit[0][0] = document.getElementById("PXL_UNIT1F");
		select_disf_unit[0][1] = document.getElementById("PYL_UNIT1F");
	text_vf[0][0] = document.getElementById("VX1F");
	text_vf[0][1] = document.getElementById("VY1F");
		select_vf_unit[0][0][0] = document.getElementById("VXL_UNIT1F");
		select_vf_unit[0][0][1] = document.getElementById("VXT_UNIT1F");
		select_vf_unit[0][1][0] = document.getElementById("VYL_UNIT1F");
		select_vf_unit[0][1][1] = document.getElementById("VYT_UNIT1F");
	text_vpf[0][0] = document.getElementById("VM1F");
	text_vpf[0][1] = document.getElementById("VA1F");
		select_vpf_unit[0][0] = document.getElementById("VML_UNIT1F");
		select_vpf_unit[0][1] = document.getElementById("VMT_UNIT1F");



	text_dis[1][0] = document.getElementById("PX2");
	text_dis[1][1] = document.getElementById("PY2");
		select_dis_unit[1][0] = document.getElementById("PXL_UNIT2");
		select_dis_unit[1][1] = document.getElementById("PYL_UNIT2");
	text_vi[1][0] = document.getElementById("VX2");
	text_vi[1][1] = document.getElementById("VY2");
		select_vi_unit[1][0][0] = document.getElementById("VXL_UNIT2");
		select_vi_unit[1][0][1] = document.getElementById("VXT_UNIT2");
		select_vi_unit[1][1][0] = document.getElementById("VYL_UNIT2");
		select_vi_unit[1][1][1] = document.getElementById("VYT_UNIT2");
	text_vpi[1][0] = document.getElementById("VM2");
	text_vpi[1][1] = document.getElementById("VA2");
		select_vpi_unit[1][0] = document.getElementById("VML_UNIT2");
		select_vpi_unit[1][1] = document.getElementById("VMT_UNIT2");
	text_acc[1][0] = document.getElementById("AX2");
	text_acc[1][1] = document.getElementById("AY2");
		select_acc_unit[1][0][0] = document.getElementById("AXL_UNIT2");
		select_acc_unit[1][0][1] = document.getElementById("AXT_UNIT2");
		select_acc_unit[1][1][0] = document.getElementById("AYL_UNIT2");
		select_acc_unit[1][1][1] = document.getElementById("AYT_UNIT2");

	text_dis[2][0] = document.getElementById("PX3");
	text_dis[2][1] = document.getElementById("PY3");
		select_dis_unit[2][0] = document.getElementById("PXL_UNIT3");
		select_dis_unit[2][1] = document.getElementById("PYL_UNIT3");
	text_vi[2][0] = document.getElementById("VX3");
	text_vi[2][1] = document.getElementById("VY3");
		select_vi_unit[2][0][0] = document.getElementById("VXL_UNIT3");
		select_vi_unit[2][0][1] = document.getElementById("VXT_UNIT3");
		select_vi_unit[2][1][0] = document.getElementById("VYL_UNIT3");
		select_vi_unit[2][1][1] = document.getElementById("VYT_UNIT3");
	text_vpi[2][0] = document.getElementById("VM3");
	text_vpi[2][1] = document.getElementById("VA3");
		select_vpi_unit[2][0] = document.getElementById("VML_UNIT3");
		select_vpi_unit[2][1] = document.getElementById("VMT_UNIT3");
	text_acc[2][0] = document.getElementById("AX3");
	text_acc[2][1] = document.getElementById("AY3");
		select_acc_unit[2][0][0] = document.getElementById("AXL_UNIT3");
		select_acc_unit[2][0][1] = document.getElementById("AXT_UNIT3");
		select_acc_unit[2][1][0] = document.getElementById("AYL_UNIT3");
		select_acc_unit[2][1][1] = document.getElementById("AYT_UNIT3");

	text_tf2 = document.getElementById("T2");
	text_disf[1][0] = document.getElementById("PX2F");
	text_disf[1][1] = document.getElementById("PY2F");
	text_vf[1][0] = document.getElementById("VX2F");
	text_vf[1][1] = document.getElementById("VY2F");
	text_vpf[1][0] = document.getElementById("VM2F");
	text_vpf[1][1] = document.getElementById("VA2F");

	text_disf[2][0] = document.getElementById("PX3F");
	text_disf[2][1] = document.getElementById("PY3F");
	text_vf[2][0] = document.getElementById("VX3F");
	text_vf[2][1] = document.getElementById("VY3F");
	text_vpf[2][0] = document.getElementById("VM3F");
	text_vpf[2][1] = document.getElementById("VA3F");
	
	button_view_all = document.getElementById("BUTTON_VIEW_ALL");
	
	
	button_PLAYPAUSE = document.getElementById("PLAYPAUSE");
}

function initializeElementValues(){

}

function initializeInternalValues(){
	tf = 0;
	for (i=0; i<1; i++) {
		dis[i][0] = 0;
		vi[i][0] = 20;
		vpi[i][0] = "";
		acc[i][0] = "0";
		disf[i][0] = "";	
		vf[i][0] = "";
		vpf[i][0] = "";
		
		dis[i][1] = 40;
		vi[i][1] = 0;
		vpi[i][1] = "";
		acc[i][1] = "-9.8";
		disf[i][10] = "";	
		vf[i][1] = "";
		vpf[i][1] = "";
	}

	for (i=1; i<3; i++) {
		dis[i][0] = 0;
		vi[i][0] = 0;
		vpi[i][0] = "";
		acc[i][0] = "0";
		disf[i][0] = "";	
		vf[i][0] = "";
		vpf[i][0] = "";
		
		dis[i][1] = 0;
		vi[i][1] = 0;
		vpi[i][1] = "";
		acc[i][1] = "0";
		disf[i][10] = "";	
		vf[i][1] = "";
		vpf[i][1] = "";
	}		

	maxTime = 2;
	toplimit = 50;
	bottomlimit = -30;
	leftlimit = -10;
	rightlimit = "varying";
	active_element = canvas1;
}

function clearInputValues(){
	six_given = false;
	vix_given = false;
	ax_given = false;
	tf_given = false;
	sfx_given = false;
	vfx_given = false;

	siy_given = false;
	viy_given = false;
	ay_given = false;

	sfy_given = false;
	vfy_given = false;
	
	text_tf.value = "";
	for (i=0; i<3; i++) {
		for (j=0; j<2; j++) {
			text_dis[i][j].value = "";
			text_vi[i][j].value = "";
			text_vpi[i][j].value = "";		
			text_acc[i][j].value = "";
			text_disf[i][j].value = "";	
			text_vf[i][j].value = "";
			text_vpf[i][j].value = "";
		}		
	}	
	updateInternalValues();
	highlightEquation();
	solveParameters();
	moveObjects();
	renderer1.render(scene, ortho_camera1);
	displayValues();
}

function createWorld(){
	scene = new THREE.Scene();
	scene.updateMatrixWorld(true);

	ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	scene.add(ambientLight);

	light = new THREE.PointLight(0xffffff, 0.3, 18);
	light.position.set(3,10,0);
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 100;
	scene.add(light);

	var axes = new THREE.AxisHelper( 20 );
	scene.add(axes);

	var gridXZ = new THREE.GridHelper(100, 100);
	scene.add(gridXZ);
}

function renderWorld(){
	canvas1.width = window.outerWidth*0.99;
	canvas1.height = window.outerHeight*0.45;
	ortho_camera1 = new THREE.OrthographicCamera(
		leftlimit,
		(canvas1.width/canvas1.height)*(toplimit - bottomlimit) + leftlimit,
		toplimit,
		bottomlimit,
		+500,
		-500);
	ortho_camera1.position.x = 0;
	ortho_camera1.position.y = 0;
	ortho_camera1.position.z = 50;
	renderer1 = new THREE.WebGLRenderer( {canvas: canvas1 } );
	renderer1.setClearColor(0x88AAAA);
	//renderer1_width = window.outerWidth*0.90;
	//renderer1_height = window.outerHeight*0.50;
	renderer1.setSize(canvas1.width, canvas1.height);
	renderer1.render(scene, ortho_camera1);
}

function createObjects(){
	var geometry = new THREE.SphereGeometry(1,100,100);
	var material = new THREE.MeshPhongMaterial({color: 0xff2222});
	balls[0] = new THREE.Mesh(geometry, material);
	balls[0].position.x = dis[0][0];
	balls[0].position.y = dis[0][1];
	balls[0].position.z = dis[0][2];
	scene.add(balls[0]);

	var material = new THREE.LineBasicMaterial({
        color: 0xff2222
		});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(balls[0].position.x, balls[0].position.y, balls[0].position.z));
    geometry.vertices.push(new THREE.Vector3(balls[0].position.x + 2, balls[0].position.y + 0, balls[0].position.z + 0));
	arrows[0] = new THREE.Line(geometry, material);
	arrows[0].geometry.dynamic = true;
    scene.add(arrows[0]);	

	var geometry = new THREE.SphereGeometry(1,100,100);
	var material = new THREE.MeshPhongMaterial({color: 0x22ff22});
	balls[1] = new THREE.Mesh(geometry, material);
	balls[1].position.x = dis[1][0];
	balls[1].position.y = dis[1][1];
	balls[1].position.z = dis[1][2];
	scene.add(balls[1]);

	var material = new THREE.LineBasicMaterial({
        color: 0xffff22
		});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(balls[1].position.x, balls[1].position.y, balls[1].position.z));
    geometry.vertices.push(new THREE.Vector3(balls[1].position.x + 2, balls[1].position.y + 0, balls[1].position.z + 0));
	arrows[1] = new THREE.Line(geometry, material);
	arrows[1].geometry.dynamic = true;
    scene.add(arrows[1]);	
	
	var geometry = new THREE.SphereGeometry(1,100,100);
	var material = new THREE.MeshPhongMaterial({color: 0x2222ff});
	balls[2] = new THREE.Mesh(geometry, material);
	balls[2].position.x = dis[2][0];
	balls[2].position.y = dis[2][1];
	balls[2].position.z = dis[2][2];
	scene.add(balls[2]);
	
	var material = new THREE.LineBasicMaterial({
		color: 0x1111ff
		});
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(balls[2].position.x, balls[2].position.y, balls[2].position.z));
    geometry.vertices.push(new THREE.Vector3(balls[2].position.x + 2, balls[2].position.y + 0, balls[2].position.z + 0));
	arrows[2] = new THREE.Line(geometry, material);
	arrows[2].geometry.dynamic = true;
    scene.add(arrows[2]);	
	updateArrow();
}

function updateArrow(){
	var velx = vf[0][0];
	var vely = vf[0][1];
	var ang;
	
	if (Math.sign(velx) >= 0 && Math.sign(vely) >= 0){
		ang = (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) <= 0 && Math.sign(vely) >= 0){
		ang = 180 + (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) <= 0 && Math.sign(vely) <= 0){
		ang = 180 + (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) >= 0 && Math.sign(vely) <= 0){
		ang = 360 + (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) == 0 && Math.sign(vely) > 0){
		ang = (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) > 0 && Math.sign(vely) == 0){
		ang = (180/Math.PI)*(Math.atan(vely/velx));
	}
		
	arrows[0].geometry.verticesNeedUpdate = true;
	arrows[0].geometry.vertices[0].x = balls[0].position.x;
	arrows[0].geometry.vertices[0].y = balls[0].position.y;
	arrows[0].geometry.vertices[1].x = balls[0].position.x + 2*(redscale)*Math.cos((Math.PI/180)*ang);
	arrows[0].geometry.vertices[1].y = balls[0].position.y + 2*(redscale)*Math.sin((Math.PI/180)*ang);
	var velx = vf[1][0];
	var vely = vf[1][1];
	
	if (Math.sign(velx) >= 0 && Math.sign(vely) >= 0){
		ang = (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) <= 0 && Math.sign(vely) >= 0){
		ang = 180 + (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) <= 0 && Math.sign(vely) <= 0){
		ang = 180 + (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) >= 0 && Math.sign(vely) <= 0){
		ang = 360 + (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) == 0 && Math.sign(vely) > 0){
		ang = (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) > 0 && Math.sign(vely) == 0){
		ang = (180/Math.PI)*(Math.atan(vely/velx));
	}
	
	arrows[1].geometry.verticesNeedUpdate = true;
	arrows[1].geometry.vertices[0].x = balls[1].position.x;
	arrows[1].geometry.vertices[0].y = balls[1].position.y;
	arrows[1].geometry.vertices[1].x = balls[1].position.x + 2*(yellowgreenscale)*Math.cos((Math.PI/180)*ang);
	arrows[1].geometry.vertices[1].y = balls[1].position.y + 2*(yellowgreenscale)*Math.sin((Math.PI/180)*ang);
	
	var velx = vf[2][0];
	var vely = vf[2][1];
	
	if (Math.sign(velx) >= 0 && Math.sign(vely) >= 0){
		ang = (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) <= 0 && Math.sign(vely) >= 0){
		ang = 180 + (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) <= 0 && Math.sign(vely) <= 0){
		ang = 180 + (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) >= 0 && Math.sign(vely) <= 0){
		ang = 360 + (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) == 0 && Math.sign(vely) > 0){
		ang = (180/Math.PI)*(Math.atan(vely/velx));
	}
	if (Math.sign(velx) > 0 && Math.sign(vely) == 0){
		ang = (180/Math.PI)*(Math.atan(vely/velx));
	}
	
	arrows[2].geometry.verticesNeedUpdate = true;
	arrows[2].geometry.vertices[0].x = balls[2].position.x;
	arrows[2].geometry.vertices[0].y = balls[2].position.y;
	arrows[2].geometry.vertices[1].x = balls[2].position.x + 2*(bluescale)*Math.cos((Math.PI/180)*ang);
	arrows[2].geometry.vertices[1].y = balls[2].position.y + 2*(bluescale)*Math.sin((Math.PI/180)*ang);
}

function displayValues(){
	text_tf.value = unitConverter(tf, "s", select_t1_unit.options[select_t1_unit.selectedIndex].text);
	text_tf2.value = tf;
	var pol;
	for (i = 0; i< 1; i++) {
		for (j = 0; j < 2; j++) {
			text_dis[i][j].value = unitConverter(dis[i][j], "m", select_dis_unit[i][j].options[select_dis_unit[i][j].selectedIndex].text);
			text_vi[i][j].value = unitConverter(vi[i][j], "m", select_vi_unit[i][j][0].options[select_vi_unit[i][j][0].selectedIndex].text)/unitConverter(1, "s", select_vi_unit[i][j][1].options[select_vi_unit[i][j][1].selectedIndex].text);
			if (active_element.id == "VM1" || active_element.id == "VA1" || active_element.id == "VML_UNIT1" || active_element.id == "VMT_UNIT1") {
				text_vpi[i][0].value = text_vpi[i][0].value
				text_vpi[i][1].value = text_vpi[i][1].value
			}
			else {
				pol = convertToPolar(vi[i][0], vi[i][1]);
				text_vpi[i][0].value = unitConverter(pol.r, "m", select_vpi_unit[i][0].options[select_vpi_unit[i][0].selectedIndex].text)/unitConverter(1, "s", select_vpi_unit[i][1].options[select_vpi_unit[i][1].selectedIndex].text);;
				text_vpi[i][1].value = pol.theta;
			}

			text_acc[i][j].value = unitConverter(acc[i][j], "m", select_acc_unit[i][j][0].options[select_acc_unit[i][j][0].selectedIndex].text)/(unitConverter(1, "s^2", select_acc_unit[i][j][1].options[select_acc_unit[i][j][1].selectedIndex].text));
			text_disf[i][j].value = unitConverter(disf[i][j], "m", select_disf_unit[i][j].options[select_disf_unit[i][j].selectedIndex].text);					
			text_vf[i][j].value = unitConverter(vf[i][j], "m", select_vf_unit[i][j][0].options[select_vf_unit[i][j][0].selectedIndex].text)/unitConverter(1, "s", select_vf_unit[i][j][1].options[select_vf_unit[i][j][1].selectedIndex].text);	
			if (active_element.id == "VM1F" || active_element.id == "VA1F" || active_element.id == "VML_UNIT1F" || active_element.id == "VMT_UNIT1F") {
				text_vpf[i][0].value = text_vpf[i][0].value
				text_vpf[i][1].value = text_vpf[i][1].value	
			}
			else {
				pol = convertToPolar(vf[i][0], vf[i][1]);
				text_vpf[i][0].value = pol.r;
				text_vpf[i][1].value = pol.theta;
			}
		}
	}
		
	text_timevalue.value = unitConverter(tf, "s", select_t1_unit.options[select_t1_unit.selectedIndex].text);
	text_maxtime.value = unitConverter(maxTime, "s", select_t1_unit.options[select_t1_unit.selectedIndex].text);
	range_timeseeker.value = unitConverter(tf, "s", select_t1_unit.options[select_t1_unit.selectedIndex].text);
	range_timeseeker.max = unitConverter(maxTime, "s", select_t1_unit.options[select_t1_unit.selectedIndex].text);

	text_rightlimit.value = ortho_camera1.right;
	text_toplimit.value = ortho_camera1.top;
	text_bottomlimit.value = ortho_camera1.bottom;
	text_leftlimit.value = ortho_camera1.left;
	
	for (i = 1; i< 3; i++) {
		for (j = 0; j < 2; j++) {
			text_dis[i][j].value = dis[i][j];
			text_vi[i][j].value = vi[i][j];
			if (active_element.id == "VM2" || active_element.id == "VA2" || active_element.id == "VML_UNIT2" || active_element.id == "VMT_UNIT2") {
				text_vpi[1][0].value = text_vpi[1][0].value
				text_vpi[1][1].value = text_vpi[1][1].value
			}
			else {
				pol = convertToPolar(vi[1][0], vi[1][1]);
				text_vpi[1][0].value = pol.r;
				text_vpi[1][1].value = pol.theta;
			}
			if (active_element.id == "VM3" || active_element.id == "VA3" || active_element.id == "VML_UNIT3" || active_element.id == "VMT_UNIT3") {
				text_vpi[2][0].value = text_vpi[2][0].value
				text_vpi[2][1].value = text_vpi[2][1].value
			}
			else {
				pol = convertToPolar(vi[2][0], vi[2][1]);
				text_vpi[2][0].value = pol.r;
				text_vpi[2][1].value = pol.theta;
			}
			text_acc[i][j].value = acc[i][j];
			text_disf[i][j].value = disf[i][j];
			text_vf[i][j].value = vf[i][j];

			if (active_element.id == "VM2F" || active_element.id == "VA2F") {
				text_vpf[1][0].value = text_vpf[1][0].value
				text_vpf[1][1].value = text_vpf[1][1].value
			}
			else {
				pol = convertToPolar(vf[1][0], vf[1][1]);
				text_vpf[1][0].value = pol.r;
				text_vpf[1][1].value = pol.theta;
			}
			if (active_element.id == "VM3F" || active_element.id == "VA3F") {
				text_vpf[2][0].value = text_vpf[2][0].value
				text_vpf[2][1].value = text_vpf[2][1].value
			}
			else {
				pol = convertToPolar(vf[2][0], vf[2][1]);
				text_vpf[2][0].value = pol.r;
				text_vpf[2][1].value = pol.theta;
			}
		}
	}
}

function oninput_text_init_values(_this){
	active_element = _this;
	active_text = _this.value;
	updateInternalValues();
	setGiven();
	highlightEquation();
	solveParameters();
	moveObjects();
	renderer1.render(scene, ortho_camera1);
	displayValues();
	text_timevalue.value = 0;
	active_element.value = active_text;
}

function convertToRect(_r, _theta){
	var x_comp = _r * Math.cos((Math.PI/180)* _theta);
	var y_comp = _r * Math.sin((Math.PI/180)* _theta);
	if (_theta == 0 || Math.abs(_theta) == 180){
		y_comp = 0;
	}
	if (_theta == 90|| Math.abs(_theta) == 270){
		x_comp = 0;
	}
	return {
		x_comp: x_comp,
		y_comp: y_comp
	}
}

function convertToPolar(_x, _y) {
	var r;
	var theta;
	r = Math.sqrt((_x**2)+(_y**2))
	
	if (Math.sign(_x) >= 0 && Math.sign(_y) >= 0){
		theta = (180/Math.PI)*(Math.atan(_y/_x));
	}
	if (Math.sign(_x) <= 0 && Math.sign(_y) >= 0){
		theta = 180 + (180/Math.PI)*(Math.atan(_y/_x));
	}
	if (Math.sign(_x) <= 0 && Math.sign(_y) <= 0){
		theta = 180 + (180/Math.PI)*(Math.atan(_y/_x));
	}
	if (Math.sign(_x) >= 0 && Math.sign(_y) <= 0){
		theta = 360 + (180/Math.PI)*(Math.atan(_y/_x));
	}
	if (Math.sign(_x) == 0 && Math.sign(_y) > 0){
		theta = (180/Math.PI)*(Math.atan(_y/_x));
	}
	if (Math.sign(_x) > 0 && Math.sign(_y) == 0){
		theta = (180/Math.PI)*(Math.atan(_y/_x));
	}
	return {
		r: r,
		theta: theta
	}
}

function updateInternalValues(){

	for (i=0; i<1; i++) {
		for (j=0; j<2; j++) {
			dis[i][j] = unitConverter(parseFloat(text_dis[i][j].value), select_dis_unit[i][j].options[select_dis_unit[i][j].selectedIndex].text, "m");
			vi[i][j] = unitConverter(parseFloat(text_vi[i][j].value), select_vi_unit[i][j][0].options[select_vi_unit[i][j][0].selectedIndex].text, "m")/unitConverter(1,select_vi_unit[i][j][1].options[select_vi_unit[i][j][1].selectedIndex].text, "s");
			acc[i][j] = unitConverter(parseFloat(text_acc[i][j].value), select_acc_unit[i][j][0].options[select_acc_unit[i][j][0].selectedIndex].text, "m")/(unitConverter(1,select_acc_unit[i][j][1].options[select_acc_unit[i][j][1].selectedIndex].text, "s^2"));
			disf[i][j] = unitConverter(parseFloat(text_disf[i][j].value), select_disf_unit[i][j].options[select_disf_unit[i][j].selectedIndex].text, "m");			
			vf[i][j] = unitConverter(parseFloat(text_vf[i][j].value), select_vf_unit[i][j][0].options[select_vf_unit[i][j][0].selectedIndex].text, "m")/unitConverter(1,select_vf_unit[i][j][1].options[select_vf_unit[i][j][1].selectedIndex].text, "s");
		}		
	}
	for (i=1; i<3; i++) {
		for (j=0; j<2; j++) {
			dis[i][j] = unitConverter(parseFloat(text_dis[i][j].value), select_dis_unit[i][j].options[select_dis_unit[i][j].selectedIndex].text, "m");
			vi[i][j] = unitConverter(parseFloat(text_vi[i][j].value), select_vi_unit[i][j][0].options[select_vi_unit[i][j][0].selectedIndex].text, "m")/unitConverter(1,select_vi_unit[i][j][1].options[select_vi_unit[i][j][1].selectedIndex].text, "s");
			acc[i][j] = unitConverter(parseFloat(text_acc[i][j].value), select_acc_unit[i][j][0].options[select_acc_unit[i][j][0].selectedIndex].text, "m")/(unitConverter(1,select_acc_unit[i][j][1].options[select_acc_unit[i][j][1].selectedIndex].text, "s^2"));
		}		
	}
	if (active_element.id == "VM1" || active_element.id == "VA1" || active_element.id == "VML_UNIT1" || active_element.id == "VMT_UNIT1") {
		var rect;
		vpi[0][0] = unitConverter(parseFloat(text_vpi[0][0].value), select_vpi_unit[0][0].options[select_vpi_unit[0][0].selectedIndex].text, "m")/unitConverter(1,select_vpi_unit[0][1].options[select_vpi_unit[0][1].selectedIndex].text, "s");
		vpi[0][1] = text_vpi[0][1].value;
		rect = convertToRect(vpi[0][0], vpi[0][1]);
		vi[0][0] = rect.x_comp;
		vi[0][1] = rect.y_comp;
	}
	if (active_element.id == "VM1F" || active_element.id == "VA1F" || active_element.id == "VML_UNIT1F" || active_element.id == "VMT_UNIT1F") {
		var rect;
		vpf[0][0] = unitConverter(parseFloat(text_vpf[0][0].value), select_vpf_unit[0][0].options[select_vpf_unit[0][0].selectedIndex].text, "m")/unitConverter(1,select_vpf_unit[0][1].options[select_vpi_unit[0][1].selectedIndex].text, "s");
		vpf[0][1] = text_vpf[0][1].value;
		rect = convertToRect(vpf[0][0], vpf[0][1]);
		vf[0][0] = rect.x_comp;
		vf[0][1] = rect.y_comp;
	}
	if (active_element.id == "VM2" || active_element.id == "VA2" || active_element.id == "VML_UNIT2" || active_element.id == "VMT_UNIT2") {
		var rect;
		vpi[1][0] = unitConverter(parseFloat(text_vpi[1][0].value), select_vpi_unit[1][0].options[select_vpi_unit[1][0].selectedIndex].text, "m")/unitConverter(1,select_vpi_unit[1][1].options[select_vpi_unit[1][1].selectedIndex].text, "s");
		vpi[1][1] = text_vpi[1][1].value;
		rect = convertToRect(vpi[1][0], vpi[1][1]);
		vi[1][0] = rect.x_comp;
		vi[1][1] = rect.y_comp;
	}
	if (active_element.id == "VM3" || active_element.id == "VA3" || active_element.id == "VML_UNIT3" || active_element.id == "VMT_UNIT3") {
		var rect;
		vpi[2][0] = unitConverter(parseFloat(text_vpi[2][0].value), select_vpi_unit[2][0].options[select_vpi_unit[2][0].selectedIndex].text, "m")/unitConverter(1,select_vpi_unit[2][1].options[select_vpi_unit[2][1].selectedIndex].text, "s");
		vpi[2][1] = text_vpi[2][1].value;
		rect = convertToRect(vpi[2][0], vpi[2][1]);
		vi[2][0] = rect.x_comp;
		vi[2][1] = rect.y_comp;
	}
	
	tf = unitConverter(parseFloat(text_tf.value), select_t1_unit.options[select_t1_unit.selectedIndex].text, "s");
	maxTime = unitConverter(parseFloat(text_maxtime.value), select_t1_unit.options[select_t1_unit.selectedIndex].text, "s");
}

function moveObjects(){
	for (var i = 0; i< 3; i++){
		balls[i].position.x = dis[i][0];
		balls[i].position.y = dis[i][1];
		balls[i].position.z = dis[i][2];
	}
	for (var i = 0; i< 3; i++){
		moveObject(balls[i], disf[i][0]-dis[i][0], disf[i][1]-dis[i][1], 0);
	}
}

function setGiven(){
	if (active_element.id == "PX1"){
		if (isNaN(dis[0][0])){
			six_given = false;
		}
		else {
			six_given = true;
		}
	}
	
	if (active_element.id == "VX1"){
		if (isNaN(vi[0][0])){
			vix_given = false;
		}
		else {
			vix_given = true;
		}
	}

	if (active_element.id == "VM1" || active_element.id == "VA1"){
		if (isNaN(vpi[0][0]) || isNaN(vpi[0][1])) {
			vix_given = false;
			viy_given = false;
		}
		else {
			vix_given = true;
			viy_given = true;
		}
	}
	
	if (active_element.id == "AX1") {
		if (isNaN(acc[0][0])){
			ax_given = false;
		}
		else {
			ax_given = true;
		}
	}
	
	if (active_element.id == "T1") {
		if (isNaN(tf)){
			tf_given = false;
		}
		else {
			tf_given = true;
		}
	}
	if (active_element.id == "PX1F"){
		if (isNaN(disf[0][0])){
			sfx_given = false;
		}
		else {
			sfx_given = true;
		}
	}
	
	if (active_element.id == "VX1F"){
		if (isNaN(vf[0][0])){
			vfx_given = false;
		}
		else {
			vfx_given = true;
		}
	}
	
	if (active_element.id == "PY1"){
		if (isNaN(dis[0][1])){
			siy_given = false;
		}
		else {
			siy_given = true;
		}
	}
	
	if (active_element.id == "VY1"){
		if (isNaN(vi[0][1])){
			viy_given = false;
		}
		else {
			viy_given = true;
		}
	}
	
	if (active_element.id == "AY1") {
		if (isNaN(acc[0][1])){
			ay_given = false;
		}
		else {
			ay_given = true;
		}
	}
	
	if (active_element.id == "T1") {
		if (isNaN(tf)){
			tf_given = false;
		}
		else {
			tf_given = true;
		}
	}
	if (active_element.id == "PY1F"){
		if (isNaN(disf[0][1])){
			sfy_given = false;
		}
		else {
			sfy_given = true;
		}
	}
	
	if (active_element.id == "VY1F"){
		if (isNaN(vf[0][1])){
			vfy_given = false;
		}
		else {
			vfy_given = true;
		}
	}
}
function highlightEquation(){
	if (six_given || siy_given) {
		$(".si").css({"color": "yellowgreen"});
		text_dis[0][0].style.backgroundColor = "yellowgreen";
		text_dis[0][1].style.backgroundColor = "yellowgreen";
	}
	else {
		$(".si").css({"color": "black"});
		text_dis[0][0].style.backgroundColor = "#ffffff";
		text_dis[0][1].style.backgroundColor = "#ffffff";
	}
	if (vix_given || viy_given) {
		$(".vi").css({"color": "yellowgreen"});
		text_vi[0][0].style.backgroundColor = "yellowgreen";
		text_vi[0][1].style.backgroundColor = "yellowgreen";
		text_vpi[0][0].style.backgroundColor = "yellowgreen";
		text_vpi[0][1].style.backgroundColor = "yellowgreen";
	}
	else {
		$(".vi").css({"color": "black"});
		text_vi[0][0].style.backgroundColor = "#ffffff";
		text_vi[0][1].style.backgroundColor = "#ffffff";
		text_vpi[0][0].style.backgroundColor = "#ffffff";
		text_vpi[0][1].style.backgroundColor = "#ffffff";
	}
	if (ax_given || ay_given) {
		$(".acc").css({"color": "yellowgreen"});
		text_acc[0][0].style.backgroundColor = "yellowgreen";
		text_acc[0][1].style.backgroundColor = "yellowgreen";
	}
	else {
		$(".acc").css({"color": "black"});
		text_acc[0][0].style.backgroundColor = "#ffffff";
		text_acc[0][1].style.backgroundColor = "#ffffff";
	}
	if (sfx_given || sfy_given) {
		$(".sf").css({"color": "yellowgreen"});
		text_disf[0][0].style.backgroundColor = "yellowgreen";
		text_disf[0][1].style.backgroundColor = "yellowgreen";
	}
	else {
		$(".sf").css({"color": "black"});
		text_disf[0][0].style.backgroundColor = "#ffffff";
		text_disf[0][1].style.backgroundColor = "#ffffff";
	}
	if (vfx_given || vfy_given) {
		$(".vf").css({"color": "yellowgreen"});
		text_vf[0][0].style.backgroundColor = "yellowgreen";
		text_vf[0][1].style.backgroundColor = "yellowgreen";
		text_vpf[0][0].style.backgroundColor = "yellowgreen";
		text_vpf[0][1].style.backgroundColor = "yellowgreen";
	}
	else {
		$(".vf").css({"color": "black"});
		text_vf[0][0].style.backgroundColor = "#ffffff";
		text_vf[0][1].style.backgroundColor = "#ffffff";
		text_vpf[0][0].style.backgroundColor = "#ffffff";
		text_vpf[0][1].style.backgroundColor = "#ffffff";
	}
	if (tf_given) {
		$(".tf").css({"color": "yellowgreen"});
		text_tf.style.backgroundColor = "yellowgreen";
	}
	else {
		$(".tf").css({"color": "black"});
		text_tf.style.backgroundColor = "#ffffff";
	}
}

function solveParameters() {
	if (acc[0][0] == 0) {
		vf[0][0] = vi[0][0];
	}
	if (vix_given && tf_given && ax_given && sfx_given) {
		dis[0][0] =  - (vi[0][0] * tf) - (0.5 * acc[0][0]*tf*tf) + disf[0][0] ;
	}
	if (vfx_given && ax_given && tf_given) {
		vi[0][0] = vf[0][0] - (acc[0][0]*tf);
	}
	if (vfx_given && vix_given && sfx_given && six_given) {
		acc[0][0] = ((vf[0][0]**2) - (vi[0][0]**2))/(2*(disf[0][0] - dis[0][0]));
	}
	if (vfx_given && vix_given && ax_given && six_given) {
		disf[0][0] = (((vf[0][0]**2) - (vi[0][0]**2))/(2*acc[0][0])) + dis[0][0];
	}
	if (vfx_given && vix_given && ax_given) {
		tf = (vf[0][0] - vi[0][0])/(acc[0][0]);
	}
	if (vfx_given && vix_given && tf_given) {
		acc[0][0] = (vf[0][0] - vi[0][0])/tf;
	}
	if (vfx_given && six_given && sfx_given && ax_given) {
		vi[0][0] = Math.sqrt((vf[0][0]**2) - (2*acc[0][0]*(disf[0][0]-dis[0][0])));
	}
	if (six_given && vix_given && tf_given && ax_given) {
		disf[0][0] = dis[0][0] + (vi[0][0] * tf) + (0.5 * acc[0][0]*tf*tf);
	}
	if (six_given && vix_given && tf_given && sfx_given) {
		acc[0][0] = (2*(disf[0][0] - dis[0][0] - (vi[0][0] * tf)))/(tf**2);
				$(".BODYTEXT").text("hell");
	}
	if (vix_given && ax_given && tf_given) {
		vf[0][0] = vi[0][0] + (acc[0][0]*tf);
	}

	if (acc[0][1] == 0) {
		vf[0][1] = vi[0][1];
	}
	if (viy_given && tf_given && ay_given && sfy_given) {
		dis[0][1] =  - (vi[0][1] * tf) - (0.5 * acc[0][1]*tf*tf) + disf[0][1] ;
	}
	if (vfy_given && ay_given && tf_given) {
		vi[0][1] = vf[0][1] - (acc[0][1]*tf);
	}
	if (vfy_given && viy_given && sfy_given && siy_given) {
		acc[0][1] = ((vf[0][1]**2) - (vi[0][1]**2))/(2*(disf[0][1] - dis[0][1]));
	}
	if (vfy_given && viy_given && ay_given && siy_given) {
		disf[0][1] = (((vf[0][1]**2) - (vi[0][1]**2))/(2*acc[0][1])) + dis[0][1];
	}
	if (vfy_given && viy_given && ay_given) {
		tf = (vf[0][1] - vi[0][1])/(acc[0][1]);
	}
	if (vfy_given && viy_given && tf_given) {
		acc[0][1] = (vf[0][1] - vi[0][1])/tf;
	}
	if (vfy_given && siy_given && sfy_given && ay_given) {
		vi[0][1] = Math.sqrt((vf[0][1]**2) - (2*acc[0][1]*(disf[0][1]-dis[0][1])));
	}
	if (siy_given && viy_given && tf_given && ay_given) {
		disf[0][1] = dis[0][1] + (vi[0][1] * tf) + (0.5 * acc[0][1]*tf*tf);
	}
	if (siy_given && viy_given && tf_given && sfy_given) {
		acc[0][1] = (2*(disf[0][1] - dis[0][1] - (vi[0][1] * tf)))/(tf**2);
	}
	if (viy_given && ay_given && tf_given) {
		vf[0][1] = vi[0][1] + (acc[0][1]*tf);
	}
	
	for (i = 1; i < 3; i++) {
		for (j = 0; j< 2; j++) {
			disf[i][j] = dis[i][j] + (vi[i][j] * tf) + (0.5 * acc[i][j]*tf*tf);
			vf[i][j] = vi[i][j] + (acc[i][j]*tf);
		}
	}
}

function playSimulation(label){
	if (label == "Play"){
		simulationIsPlayed = true;
		updateInternalValues();
		for (i = 0; i< 1; i++) {
			for (j = 0; j < 2; j++) {
				if (isNaN(dis[i][j])){
					dis[i][j] = 0;
				}
				if (isNaN(vi[i][j])){
					vi[i][j] = 0;
				}
				if (isNaN(acc[i][j])){
					acc[i][j] = 0;
				}
			}
		}
		if (isNaN(maxTime) || tf == 0) {
			maxTime = 2;
		}
		six_given = true;
		siy_given = true;
		vix_given = true;
		viy_given = true;
		ax_given = true;
		ay_given = true;
		tf_given = true;
		vfx_given = false;
		vfy_given = false;
		sfx_given = false;
		sfy_given = false;
		tf = 0;
		t_played = Date.now()/1000;
		animate();	
		button_PLAYPAUSE.value = "Pause";
	}
	if (label == "Pause"){
		button_PLAYPAUSE.value = "Play";
		cancelAnimationFrame(animationID);
	}
}

function animate(){
	if (simulationIsPlayed == true && parseFloat(tf) <= maxTime){
		solveParameters();
		moveObjects();
		displayValues();
		tf = (Date.now()/1000 - t_played);
		animationID = requestAnimationFrame(animate);
	}
	if (simulationIsPlayed == true && parseFloat(tf) >= maxTime){
		tf = maxTime;
		solveParameters();
		moveObjects();
		displayValues();
		cancelAnimationFrame(animationID);
		button_PLAYPAUSE.value = "Play";
	}
	renderer1.render(scene, ortho_camera1);
}

function oninput_text_camera_adjust(_this){
	active_element = _this;
	active_text = _this.value;
	toplimit = unitConverter(parseFloat(text_toplimit.value), select_display_unit.options[select_display_unit.selectedIndex].text, "m");
	bottomlimit = unitConverter(parseFloat(text_bottomlimit.value), select_display_unit.options[select_display_unit.selectedIndex].text, "m");
	leftlimit = unitConverter(parseFloat(text_leftlimit.value), select_display_unit.options[select_display_unit.selectedIndex].text, "m");
	rightlimit = unitConverter(parseFloat(text_rightlimit.value), select_display_unit.options[select_display_unit.selectedIndex].text, "m");
	orthoCameraAdjust(ortho_camera1, canvas1, leftlimit, rightlimit, toplimit, bottomlimit);
	text_toplimit.value = unitConverter(ortho_camera1.top, "m", select_display_unit.options[select_display_unit.selectedIndex].text);
	text_bottomlimit.value = unitConverter(ortho_camera1.bottom, "m", select_display_unit.options[select_display_unit.selectedIndex].text);
	text_leftlimit.value = unitConverter(ortho_camera1.left, "m", select_display_unit.options[select_display_unit.selectedIndex].text);
	text_rightlimit.value = unitConverter(ortho_camera1.right, "m", select_display_unit.options[select_display_unit.selectedIndex].text);
	renderer1.setSize(canvas1.width, canvas1.height);
	renderer1.render(scene, ortho_camera1);
	active_element.value = active_text;
}

function orthoCameraAdjust(_camera, _canvas, _left, _right, _top, _bottom) {
	_camera.top = _top;
	_camera.bottom = _bottom;
	_camera.left = _left;
	_camera.right = (_canvas.width/_canvas.height)*(_camera.top - _camera.bottom) + _camera.left;
	_camera.updateProjectionMatrix();
}

function onclick_button_view_all() {
		toplimit = Math.max(balls[0].position.y, balls[1].position.y, balls[2].position.y) + 20;
		bottomlimit = Math.min(balls[0].position.y, balls[1].position.y, balls[2].position.y) - 20;
		leftlimit = Math.min(balls[0].position.x, balls[1].position.x, balls[2].position.x) - 20;
		rightlimit = Math.max(balls[0].position.x, balls[1].position.x, balls[2].position.x) + 20;
		orthoCameraAdjust(ortho_camera1, canvas1, leftlimit, rightlimit, toplimit, bottomlimit);
		text_toplimit.value = unitConverter(ortho_camera1.top, "m", select_display_unit.options[select_display_unit.selectedIndex].text);
		text_bottomlimit.value = unitConverter(ortho_camera1.bottom, "m", select_display_unit.options[select_display_unit.selectedIndex].text);
		text_leftlimit.value = unitConverter(ortho_camera1.left, "m", select_display_unit.options[select_display_unit.selectedIndex].text);
		text_rightlimit.value = unitConverter(ortho_camera1.right, "m", select_display_unit.options[select_display_unit.selectedIndex].text);
		renderer1.setSize(canvas1.width, canvas1.height);
		renderer1.render(scene, ortho_camera1);
}

function setMaxTime(){
	maxTime = parseFloat(text_maxtime.value);
	tf = parseFloat(text_maxtime.value);
	solveParameters();
	moveObjects();
	renderer1.render(scene, ortho_camera1);
	displayValues();
}

function seekTime(){
	tf = unitConverter(range_timeseeker.value, select_t1_unit.options[select_t1_unit.selectedIndex].text, "s");
	solveParameters();
	moveObjects();
	renderer1.render(scene, ortho_camera1);
	displayValues();
}

function oninput_text_timevalue(_this) {
	tf = parseFloat(_this.value);
	solveParameters();
	moveObjects();
	renderer1.render(scene, ortho_camera1);
	displayValues();
}

function resizeRedBall(_scaleFactor) {
	if (_scaleFactor != 0){
		balls[0].scale.set(_scaleFactor, _scaleFactor, _scaleFactor);
		renderer1.render(scene, ortho_camera1);
		redscale = _scaleFactor;
	}
}

function resizeyellowgreenBall(_scaleFactor) {
	if (_scaleFactor != 0){
		balls[1].scale.set(_scaleFactor, _scaleFactor, _scaleFactor);
		renderer1.render(scene, ortho_camera1);
		yellowgreenscale = _scaleFactor;
	}
}

function resizeBlueBall(_scaleFactor) {
	if (_scaleFactor != 0){
		balls[2].scale.set(_scaleFactor, _scaleFactor, _scaleFactor);
		renderer1.render(scene, ortho_camera1);
		bluescale = _scaleFactor;
	}
}