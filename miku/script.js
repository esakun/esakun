/**
 * 
 * 初音ミクをロードする
 * 
 */
window.onload = function ()
{
	gl3.initGL("canvas");
	if (gl3.ready == false) {
		console.log("error");
		return;
	}
	var size = Math.min(window.innerWidth, window.innerHeight);
	gl3.canvas.width = size;
	gl3.canvas.height = size;
	
	var files = {};
	var loadFile = function(url, name, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				files[name] = xhr.responseText;
				callback();
			}
		};
		xhr.open("GET", url, true);
		xhr.send("");
	};
	loadFile("miku.obj", "obj", function (){
		initialize (files);
	});
	
};

function initialize (files)
{
	var obj = objParser.objParse(files.obj);
	var glObj = objParser.createGLObject(obj);
	
	// create ProgramObject
	var prg = gl3.program.create (
		"vs", 
		"fs", 
		["position", "normal"], 
		[3, 3], 
		["mvpMatrix"], 
		["matrix4fv"]	
	);
	
	var VBO = [
		gl3.create_vbo(glObj.vertices),
		gl3.create_vbo(glObj.normals)
	];
	
	gl3.gl.enable (gl3.gl.DEPTH_TEST);
	gl3.gl.depthFunc(gl3.gl.LEQUAL);
	gl3.gl.clearDepth(1.0);
	
	var mMatrix = gl3.mat4.identity(gl3.mat4.create());
	var vMatrix = gl3.mat4.identity(gl3.mat4.create());
	var pMatrix = gl3.mat4.identity(gl3.mat4.create());
	var vpMatrix = gl3.mat4.identity(gl3.mat4.create());
	var mvpMatrix = gl3.mat4.identity(gl3.mat4.create());
	
	
	var count = 0;
	render ();
	
	function render ()
	{
		count ++;
		
		prg.set_attribute(VBO);
		prg.set_program();
		var cameraPos = [0, 2, 6];
		var cameraUpDir = [0, 0.5, 0];
		var camera = gl3.camera.create(cameraPos, [0,2,0], cameraUpDir, 40, 1, 0.1, 10);
		
		gl3.mat4.vpFromCamera(camera, vMatrix, pMatrix, vpMatrix);
		
		gl3.mat4.identity(mMatrix);
		var radian = gl3.TRI.rad[count%360];
		gl3.mat4.rotate(mMatrix, radian, [0, 1, 0], mMatrix);
		gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
		
		gl3.scene_clear([0.3,0.3,0.3,1]);
		gl3.scene_view(camera, 0, 0, gl3.canvas.width, gl3.canvas.height);
		
		prg.push_shader ([mvpMatrix]);
		gl3.gl.drawArrays(gl3.gl.TRIANGLES, 0, glObj.vertices.length/3);	
		
		requestAnimationFrame (render);
	}
}
