# Morphing Particles

An interactive 3D project that renders loaded models as particles and smoothly morphs between them. Transitions are calculated in the vertex shader, while colors and target shapes can be adjusted directly through the interface.

This learning and portfolio project was inspired by **Three.js Journey**. Both the particle morphing technique and the modular Experience architecture follow concepts introduced in the course.

## Features

- **Shader-based morphing:** Particles transition between four model shapes. Noise offsets the timing of individual particles to create organic transitions.
- **Interactive controls:** GUI controls for two particle colors, the background color, and morph progress, plus buttons for selecting target shapes.
- **Camera navigation:** OrbitControls with damping for exploring the scene.
- **Responsive rendering:** The camera, renderer, and shader resolution adapt to window resizing, with the pixel ratio capped at 2.

## Technical Highlights

The project combines JavaScript application architecture with GPU graphics programming:

- **Three.js and GLSL:** Custom vertex and fragment shaders, BufferGeometry, and custom attributes for target positions and particle sizes.
- **Data preparation:** Models with different vertex counts are normalized to a shared particle count so their positions can be interpolated.
- **Animation with GSAP:** An animated uniform controls morph progress in the shader.
- **Asynchronous asset loading:** GLTFLoader with Draco support; the particle scene is created once loading is complete.
- **Modular architecture:** Separate classes for the application, camera, renderer, resources, and particles, with a central cleanup method for listeners, animations, and GPU resources.

**Tech stack:** JavaScript (ES Modules), Three.js, WebGL / GLSL, GSAP, lil-gui, and Vite.

## Getting Started

Prerequisite: a current version of Node.js with npm.

```bash
npm install
npm run dev
```

In the browser, use `morph0` through `morph3` to select a target shape. The color controls adjust the appearance, while `uProgress` lets you explore the transition manually.

Create a production build:

```bash
npm run build
```

The built application is written to the `dist/` directory.

## Project Structure

```text
src/
├── script.js                 # Entry point
├── Experience/
│   ├── Experience.js         # Setup, lifecycle, and shared instance
│   ├── Camera.js             # Camera and OrbitControls
│   ├── Renderer.js           # Rendering and background color
│   ├── sources.js            # Asset configuration
│   ├── Utils/                # Resources, events, GUI, viewport sizing, and time
│   └── World/
│       ├── World.js          # Scene setup after assets have loaded
│       └── Particles.js      # Particle data, material, morphing, and controls
└── shaders/
    ├── particles/            # Vertex and fragment shaders
    └── includes/             # Shared shader functions
```

`Experience` coordinates the application. Once the models have loaded, `World` creates the particle system. `Particles` prepares the geometry and connects the GUI to the shader uniforms. Position interpolation runs on the GPU.

## Inspiration

This project draws on learning material from **Three.js Journey**. It provides hands-on practice with particle systems, shader animation, and Three.js application structure, documented as a portfolio project.
