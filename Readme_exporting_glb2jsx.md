### exporting .glb file as .jsx file ###
1) download the .glb file

2) export that .glb file to .gltf, using vs-code extension

3) convert the .gltf file to .jsx file using the following command:
    "npx gltfjsx <glTF model source file>"

    if gltfjsx package is not installed, install it with the following command:
        "npm install gltfjsx"
    
4) thats all, now you will have that .jsx file. Use it in the canvas