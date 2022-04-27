import "./App.css";
import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { gsap } from "gsap";

function Box(props) {
    // This reference will give us direct access to the mesh
    const mesh = useRef();

    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame(() => (mesh.current.rotation.x += !hovered ? 0.01 : 0));

    return (
        <mesh {...props} ref={mesh} scale={active ? 1.5 : 0.5} onClick={() => setActive(!active)} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
            <boxGeometry args={[1.4, 1, 0.1]} />
            <meshStandardMaterial map={props.map} />
        </mesh>
    );
}

function App() {
    const rows = 20;
    const columns = 20;

    const textures = useLoader(TextureLoader, ["textures/1.jpg", "textures/2.jpg", "textures/3.jpg", "textures/4.png", "textures/5.jpg", "textures/6.jpg"]);

    const positions = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            positions.push([gsap.utils.mapRange(0, columns, -8, 8, x), gsap.utils.mapRange(0, rows, -6, 6, y), 0]);
        }
    }

    console.log(positions);

    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 100]} />

            {positions.map((position, i) => {
                console.log(positions[i]);
                return <Box key={i} position={position} map={gsap.utils.wrap(textures, i)} />;
            })}

            <OrbitControls />
        </Canvas>
    );
}

export default App;
