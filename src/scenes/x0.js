import * as B from '@babylonjs/core'

const createScene = canvas => {
  const engine = new B.Engine(canvas)
  const scene = new B.Scene(engine)
  scene.clearColor = B.Color3.Black()

  const camera = new B.ArcRotateCamera('camera1', Math.PI / 4, Math.PI / 3, 10, B.Vector3.Zero(), scene)
  camera.attachControl(canvas, true)

  const light = new B.HemisphericLight('light', new B.Vector3(0, 1, .5), scene)

  const box = B.MeshBuilder.CreateBox('box', { size: 1 }, scene)
  const material = new B.StandardMaterial('box-material', scene)
  material.diffuseColor = B.Color3.White()
  material.emissiveColor = new B.Color3(0, 1, 1)
  box.material = material

  const gl = new B.GlowLayer("glow", scene)

  engine.runRenderLoop(() => {
    scene.render()
  })
}

export { createScene }