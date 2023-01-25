import { Engine, Scene, Vector3, MeshBuilder, StandardMaterial, Color3, HemisphericLight, ArcRotateCamera } from '@babylonjs/core'

const createScene = canvas => {
  const engine = new Engine(canvas)
  const scene = new Scene(engine)

  const camera = new ArcRotateCamera('camera1', Math.PI / 4, Math.PI / 3, 10, Vector3.Zero(), scene)
  camera.attachControl(canvas, true)

  new HemisphericLight('light', Vector3.Up(), scene)

  const box = MeshBuilder.CreateBox('box', { size: 2 }, scene)
  const material = new StandardMaterial('box-material', scene)
  material.diffuseColor = Color3.Blue()
  box.material = material

  engine.runRenderLoop(() => {
    scene.render()
  })
}

export { createScene }