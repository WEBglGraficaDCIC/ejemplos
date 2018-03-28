# Preguntas y ejercicios
## Shaders
En el pipeline programable de OpenGL(WebGL) *debemos* programar (al menos) dos etapas del mismo.
1. ¿Cuáles son estos dos tipos de shaders que son necesarios?
2. En una operación de dibujado ¿Cuántas veces se ejecuta cada uno?
3. ¿En que lenguage se programan estos shaders?
4. Indicar cuál de los shaders tiene como principal información de "salida":
	1. La posición del vértice/fragmento en coordenadas de clipping.
	2. El color final que tendrá el vértice/fragmento.
5. Indicar cuál de los calificadores de variables (webgl1) se utilizan para las siguientes funciones:
	1. Recibir información sobre un atributo de un vértice. (`attribute / uniform / varying`)
	2. Enviar información del shader de vértices al de fragmentos, pasando por el rasterizador. (`attribute / uniform / varying`)
	3. Recibir información que es igual (constante) para todos los vértices y fragmentos. (`attribute / uniform / varying`)

## Buffers
La información de los objetos que queremos dibujar debemos almacenarla en buffers de OpenGL(WebGL).
(Tambien existen buffers para otras operaciones, como veremos más adelante)
1. ¿Cuáles son estos tipos de buffers?
2. Indicar cual se utiliza para almacenar:
	1. Los indices. (`VAO / VBO / EBO`)
	2. La información de un atributo de vértice. (`VAO / VBO / EBO`)
	3. Información de layout de los buffers y de los indices. (`VAO / VBO / EBO`)

## Sobre este ejemplo
1. ¿Qué elemento HTML se utiliza para obtener un contexto para gráficos 3D con WebGL?
	1. Un elemento `<img>`
	2. Un elemento `<canvas>`
	3. Un elemento `<div>`
	4. Un elemento `<webgl>`
2. ¿Cuándo y cuántas veces se ejecutan los métodos **onLoad** y **onRender**?
3. ¿Cuándo (una única vez / cada vez que se dibuja) se ejecutan las siguientes tareas?
	1. Crear y compilar los shaders y el programa de shaders.
	2. Crear y llenar los buffers.
	3. Activar el buffer a utilizar.
	4. Activar el programa de shader a utilizar.
4. En el shader de vértices, ¿Cuántos attributos se utilizan para cada vértice?
5. En el shader de fragmentos, ¿Cómo se calcula el color de salida del fragmento?
6. ¿Cuál es la instrucción que efectivamente ordena a WebGL el dibujado?
	1. ¿Que primitiva de OpenGL es utilizada?
	2. ¿Que programa de shader es utilizado?
	3. ¿Que buffers son utilizados?

## Ejercicios sobre el ejemplo:
1. Agregar un nuevo atributo para cada vértice, el color:
	```glsl
	attribute vec3 vertexCol;
	```
	y utilizarlo para enviar al shader de fragmentos el color del vértice. En el shader de fragmentos, utilizar este color como información de salida.
2. Agregar otro atributo para cada vértice, un segundo color:
	```glsl
	attribute vec3 vertexCol2;
	```
	y hacer que el color que se le envíe al shader de fragmentos, sea la suma de `vertexCol`, y `vertexCol2`.
3. Agregar una variable uniform, (float, con valores entre 0 y 1)
	```glsl
	uniform float percent;
	```
	Para modificar la forma de calcular el color a enviarle al shader de fragmentos. En vez de utilizar la suma (punto 4), el color a enviar será:
	```glsl
	percent * vertexCol + (1 - percent) * vertexCol2
	```
	**TIP:** Existe una función en GLSL que realiza esta operación, la funcion GLSL `mix(...)`
4. Agregar al HTML, un control de slider:
	```html
	<input type="range" min="0" max="100" value="0" oninput="onSliderPercent(this);">
	```
	y su función oyente:
	```javascript
	function onSliderPercent(slider) {
		percentValue = parseFloat(slider.value) / 100;
		onRender();
	}
	```
	para modificar el valor de parámetro `percent` desde la UI.
