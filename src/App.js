import "./App.scss";
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
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial map={props.map} />
        </mesh>
    );
}

function App() {
    const defaultTextures = ["textures/1.jpg", "textures/2.jpg", "textures/3.jpg", "textures/4.png", "textures/5.jpg", "textures/6.jpg"];

    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(10);
    const [depth, setDepth] = useState(10);
    const [query, setQuery] = useState("");
    const [textures, setTextures] = useState(defaultTextures);

    const loadedTextures = useLoader(TextureLoader, textures);

    const positions = [];
    for (let z = 0; z < depth; z++) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                positions.push([gsap.utils.mapRange(0, width, -8, 8, x), gsap.utils.mapRange(0, height, -8, 8, y), gsap.utils.mapRange(0, depth, -8, 8, z)]);
            }
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=19&client_id=IxRD9wlbmoqRRf2LXCc-iurxRGsNKo8zcloqCJQmaGQ`)
            .then((response) => response.json())
            .then((data) => {
                setTextures(data.results.map((result) => result.urls.regular));
            });
    };

    return (
        <>
            <header>
                <div>
                    <label>Width</label>
                    <br />
                    <input type="range" min="1" max="15" step="1" onChange={(e) => setWidth(e.target.value)} />
                </div>
                <div>
                    <label>Height</label>
                    <br />
                    <input type="range" min="1" max="15" step="1" onChange={(e) => setHeight(e.target.value)} />
                </div>
                <div>
                    <label>Depth</label>
                    <br />
                    <input type="range" min="1" max="15" step="1" onChange={(e) => setDepth(e.target.value)} />
                </div>
                <form onSubmit={handleSearch}>
                    <label>Search</label>
                    <br />
                    <input type="text" onChange={(e) => setQuery(e.target.value)} />
                    <input type="submit" style={{ marginLeft: "10px" }} />
                </form>
            </header>
            <Canvas>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                {positions.map((position, i) => {
                    return <Box key={i} position={position} map={gsap.utils.wrap(loadedTextures, i)} />;
                })}

                <OrbitControls />
            </Canvas>
        </>
    );
}

export default App;
