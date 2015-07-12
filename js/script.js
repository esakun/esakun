var qt = gl3.qtn.create();
gl3.qtn.identity(qt);

window.onload = function(){
	// initialize
	gl3.initGL('canvas');
	if(!gl3.ready){
		console.log('initialize error');
		return;
	}

	gl3.canvas.width  = window.innerWidth;
	gl3.canvas.height = window.innerHeight;

	// program
	var prg = gl3.program.create(
		'vs',
		'fs',
		['position', 'color', 'normal'],
		[3, 4, 3],
		['mvpMatrix'],
		['matrix4fv']
	);
	
	var cube = gl3.mesh.cube(1, [1, 1, 1, 1]);
	
	var VBO = [
		gl3.create_vbo (cube.position),
		gl3.create_vbo (cube.color),
		gl3.create_vbo (cube.normal)
	];
	var IBO = gl3.create_ibo(cube.index);
	
	var mMatrix = gl3.mat4.identity(gl3.mat4.create());
	var vMatrix = gl3.mat4.identity(gl3.mat4.create());
	var pMatrix = gl3.mat4.identity(gl3.mat4.create());
	var vpMatrix = gl3.mat4.identity(gl3.mat4.create());
	var mvpMatrix = gl3.mat4.identity(gl3.mat4.create());
	var invMatrix = gl3.mat4.identity(gl3.mat4.create());
	
	gl3.gl.enable (gl3.gl.DEPTH_TEST);
	gl3.gl.depthFunc (gl3.gl.LEQUAL);
	gl3.gl.clearDepth (1.0);
	
	render();
	
	var count = 0;

	function render(){
		count ++;
		var lightDirection = [1,1,1];
		var cameraPosition = [];
		var centerPoint = [0, 0, 0];
		var cameraUpDirection = [];
		
		// 第１引数をqtで回転したら第三引数に代入される
		gl3.qtn.toVecIII ([0,0,5], qt, cameraPosition);
		gl3.qtn.toVecIII([0,1,5], qt, cameraUpDirection);
		
		var camera = gl3.camera.create(
			cameraPosition,
			[0,0,0],
			cameraUpDirection,
			45,1,0.1,10
		);
		
		// 背景クリア(背景描画)
		gl3.scene_clear([1, 1, 1, 1], 1.0);
		gl3.scene_view(camera, 0, 0, gl3.canvas.width, gl3.canvas.height);
		
		gl3.mat4.vpFromCamera(camera, vMatrix, pMatrix, vpMatrix);
		
		
		prg.set_program();
		prg.set_attribute(VBO, IBO);
		
		var radian = gl3.TRI.rad[count % 360];
		var axis = [1, 0.3, 0.1];
		gl3.mat4.identity (mMatrix);
		gl3.mat4.rotate(mMatrix, radian, axis, mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
		
		prg.push_shader([mvpMatrix]);
		
		// 描画開始
		gl3.draw_elements(gl3.gl.TRIANGLES, cube.index.length);
		
		requestAnimationFrame (render);
	}
};

