import './App.css';
import React, { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { SoftShadows, Float, CameraControls, Sky, useGLTF } from "@react-three/drei"
import { Model as Room, Model_material as Room_materials } from './Room-transformed'
import { Model as LightVectary } from './Light_without_stand'
import { easing } from "maath"
import InputColor from 'react-input-color';
import { Button, Container, Row, Col } from 'reactstrap';

function Light() {
  const ref = useRef()
  useFrame((state, delta) => {
    easing.dampE(ref.current.rotation, [(state.pointer.y * Math.PI) / 50, (state.pointer.x * Math.PI) / 20, 0], 0.2, delta)
  })
  return (
    <group ref={ref}>
      <directionalLight position={[5, 5, -8]} castShadow intensity={5} shadow-mapSize={2048} shadow-bias={-0.001}>
        <orthographicCamera attach="shadow-camera" args={[-8.5, 8.5, 8.5, -8.5, 0.1, 20]} />
      </directionalLight>
    </group>
  )
}

function LoadGLB({ url, position, rotation }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} position={position} rotation={rotation}/>
}

function Box(props) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  /*useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });*/
  
  return (
    <mesh
      {...props}
      ref={mesh}
      castShadow material={props.material}>
      <boxBufferGeometry />
    </mesh>
  );
}

function PlainRoom({width, height, depth, thickness, materials}) {
  return ( 
    <group dispose={null} >
      <Box scale={[thickness, height, depth ]} material={materials.Material_2146804362} position={[(-1 * (width/2)), (height/2), 0]}/> { /*left-side wall*/ }
      <Box scale={[width, height, thickness]} material={materials.Material_2146804362} position={[0, (height/2), (-1 * (depth/2))]}/> { /*back-side wall*/ }
      <Box scale={[thickness, height, depth]} material={materials.Material_2146804362} position={[(width/2), (height/2), 0]} /> { /*right-side wall*/ }
      <Box scale={[width, thickness, depth]} material={materials.Material_2146804362} position={[0,0,0]}/> { /*base wall*/ }
      { /*<Box scale={[thickness, thickness, thickness]} position={[0,0,0]}/>  origin (for debugging purposes) */ }

      {/*for light setup */}
      <LightVectary position={[(-1 * (width/2)), height, 0]}  rotation-y={Math.PI}/> { /*left-side wall*/ }
      <LightVectary position={[0, height, (-1 * (depth/2))]}  rotation-y={Math.PI / 2}/> { /*back-side wall*/ }
      <LightVectary position={[(width/2), height, 0]} /> { /*right-side wall*/ }
      {/* <LoadGLB url="/light_without_stand/light_without_stand.gltf" position={[(width/2), height, 0]} rotation-y={0}/> */}
    </group>
  );
}

function App() {
  const { nodes, materials } = useGLTF('/silvania_e_adilson.glb');
  // const materials = Room_materials();

  const [color, setColor] = React.useState({});

  const [width, setWidth] = React.useState(5);
  const [height, setHeight] = React.useState(5);
  const [depth, setDepth] = React.useState(5);
  const [thickness, setThickness] = React.useState(0.2);

  const handleColorChange = (newColor) => {
      setColor(newColor.hex);
  };

  const onChangeWidth = (newWidth) => {
    setWidth(parseInt(newWidth.target.value));
  };

  const onChangeHeight = (newHeight) => {
    setHeight(parseInt(newHeight.target.value));
  };

  const onChangeDepth = (newDepth) => {
    setDepth(parseInt(newDepth.target.value));
  };

  const onChangeThickness = (newThickness) => {
    setThickness(parseInt(newThickness.target.value));
  };

  return (
    <Container>
      <Row>
        <Col md={3}>
          <div className='crd'>
            <div className="login-page">
              <div className="form test-form">
                <form className="login-form" >
                  {/* <h6 className='display_flex'>Dimension</h6> */}
                  <div className='property'>
                    <input type="text" placeholder="Height(cm)" onChange={onChangeHeight} />
                    <input type="text" placeholder='Width(cm)' onChange={onChangeWidth}/>
                    <input type="text" placeholder='Depth(cm)' onChange={onChangeDepth}/>
                  </div>
                  <div>
                    {/* <h6 className='display_flex'>Color picker</h6>
                    <div className='property'>
                      <InputColor
                          initialValue="#5e72e4"
                          onChange={handleColorChange}
                          placement="left"
                      />
                    </div> */}
                    {/* <h6 className='display_flex'>Wall Thickness</h6> */}
                    <input type="text" placeholder='Wall Thickness(cm)' onChange={onChangeThickness} />
                  </div>
                  <div className='btns property'>
                      <Button className="save" >Save</Button> <span> &nbsp;</span>
                      <Button className="save">Reset</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Col>
        <Col md={9}>
          <div id="canvas-container">
            <Canvas shadows camera={{ position: [0, 0, 80], fov: 10 }}> \
              <SoftShadows />
              <CameraControls makeDefault />
              {/* <color attach="background" args={["#d0d0d0"]} /> */}
              {/* <fog attach="fog" args={["#d0d0d0", 8, 35]} /> */}
              
              {/* <ambientLight intensity={0.4} /> */}
              {/* <Light /> */}
              {/* <Room scale={0.5} position={[0, -1, 0]} /> */}
              {/* <Silvania scale={0.5} position={[0, -1, 0]} /> */}
              

              <PlainRoom width={width} height={height} depth={depth} thickness={thickness} materials={materials} />

              {/* <Sky inclination={0.52} scale={20} /> */}
            </Canvas>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

function Sphere({ color = "hotpink", floatIntensity = 15, position = [0, 5, -8], scale = 1 }) {
  return (
    <Float floatIntensity={floatIntensity}>
      <mesh castShadow position={position} scale={scale}>
        <sphereGeometry />
        <meshBasicMaterial color={color} roughness={1} />
      </mesh>
    </Float>
  )
}

export default App;
