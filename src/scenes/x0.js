import * as B from '@babylonjs/core'
import { BaseN } from 'js-combinatorics'

let shuf = xs => {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = 0 | Math.random() * (i + 1);
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
  return xs
}

let createScene = async (canvas, cb = _ => { }) => {
  let engine = new B.Engine(canvas)
  let scene = new B.Scene(engine)
  scene.clearColor = B.Color3.Black()

  let camera = new B.ArcRotateCamera('camera1', Math.PI / 4, Math.PI / 3, 10, B.Vector3.Zero(), scene)
  camera.attachControl(canvas, true)

  let light = new B.HemisphericLight('light', new B.Vector3(0, 1, .5), scene)

  let gl = new B.GlowLayer('glow', scene, {
    mainTextureSamples: 4,
  })

  let boxSize = .2
  let box = B.MeshBuilder.CreateBox('box', { size: boxSize }, scene)

  let ixc = 10
  let poss = [...new BaseN(
    [...new Array(ixc).keys()].map(x => (x - ixc / 2) * boxSize * 2),
    3
  )]
  let matrixBuf = new Float32Array(poss.length * 16)
  let colorBuf = new Float32Array(poss.length * 4)
  poss.map((p, i) => {
    B.Matrix.Translation(...p).copyToArray(matrixBuf, i * 16)
    colorBuf.set([...shuf([0, 1, 1]), 1], i * 4)
  })

  box.thinInstanceSetBuffer('matrix', matrixBuf, 16)
  box.thinInstanceSetBuffer('instanceColor', colorBuf, 4)

  // B.Animation.CreateAndStartAnimation(
  //   'anim-rot',
  //   box,
  //   'rotation',
  //   1,
  //   60,
  //   box.rotation,
  //   new B.Vector3(Math.PI * 2, Math.PI * 2, Math.PI * 2),
  //   B.Animation.ANIMATIONLOOPMODE_CYCLE
  // )

  scene.onBeforeRenderObservable.add(_ => {

  })

  engine.runRenderLoop(() => {
    scene.render()
  })

  addEventListener('resize', _ => {
    engine.resize()
  })

  cb({ engine, scene })
}

export { createScene }