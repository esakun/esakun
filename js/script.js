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
		['position'],
		[3],
		[],
		[]
	);

	var position = [
		-0.5,  0.5,  0.0,
		0.5, 0.5,  0.0,
		0.5, -0.5,  0.0,
		-0.5, -0.5,  0.0
        -0.5,  0.5,  0.0
	];

	// vertex buffer object
    // 配列になっている理由はglcubicライブラリのせい
	var VBO = [
		gl3.create_vbo(position)
	];

	// rendering
	render();

	function render(){
		// 背景クリア(背景描画)
		gl3.scene_clear([0.7, 0.7, 0.7, 1.0]);
		/**
		 * 第1引数 : カメラ
		 * 第2引数 : x座標
		 * 第3引数 : y座標
		 * 第4引数 : 描画width
		 * 第5引数 : 描画height
		 */
		gl3.scene_view(null, 0, 0, gl3.canvas.width, gl3.canvas.height);
		
		prg.set_program();
        // シェーダーに頂点バッファを渡す
		prg.set_attribute(VBO);
		// 描画開始
		gl3.draw_arrays(gl3.gl.TRIANGLE_STRIP, position.length/3);
	}
};

