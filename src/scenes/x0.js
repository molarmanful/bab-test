import * as B from '@babylonjs/core'
import { BaseN } from 'js-combinatorics'
import { easeInOutExpo } from 'js-easing-functions'

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

  let camera = new B.ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 2, 100, B.Vector3.Zero(), scene)
  camera.fov = .1
  camera.attachControl(canvas, true)

  let light = new B.HemisphericLight('light', new B.Vector3(0, 1, .5), scene)

  let gl = new B.GlowLayer('glow', scene, {
    mainTextureSamples: 4,
  })

  let boxSize = .5
  let box = B.MeshBuilder.CreateBox('box', { size: boxSize }, scene)

  let ixc = 3
  let mats = [...new BaseN([...new Array(ixc).keys()].map(x => (x - (ixc / 2 | 0)) * boxSize * 2), 3)]
  let matrixBuf = new Float32Array(mats.length * 16)
  let colorBuf = new Float32Array(mats.length * 3)

  let time = 0
  let mats0
  let mats1 = mats
  let cols0
  let cols1 = mats.map(_ => shuf([0, 1, 1]))

  let rst = _ => {
    time = 0
    mats0 = mats1
    mats1 = mats.map(p => p.map(n => n + (Math.random() < .5 ? 1 : -1) * boxSize / 2))
    cols0 = cols1
    cols1 = mats.map(_ => shuf([0, 1, 1]))
  }
  rst()

  let dur = 1000
  scene.registerBeforeRender(_ => {
    time += engine.getDeltaTime()
    if (time >= dur) rst()
    else {
      mats0.map((p, i) => {
        matrixBuf.set(B.Matrix.Translation(...p.map((n, j) =>
          easeInOutExpo(Math.min(time, dur), n, mats1[i][j] - n, dur)
        )).m, i * 16)
        colorBuf.set(cols0[i].map((n, j) =>
          easeInOutExpo(Math.min(time, dur), n, cols1[i][j] - n, dur)
        ), i * 3)
      })
    }
    box.thinInstanceSetBuffer('matrix', matrixBuf, 16)
    box.thinInstanceSetBuffer('color', colorBuf, 3)
  })

  B.Animation.CreateAndStartAnimation(
    'anim-rot',
    box,
    'rotation',
    1,
    60,
    box.rotation,
    new B.Vector3(Math.PI * 2, 0, Math.PI * 2),
    B.Animation.ANIMATIONLOOPMODE_CYCLE
  )

  engine.runRenderLoop(() => {
    scene.render()
  })

  addEventListener('resize', _ => {
    engine.resize()
  })

  cb({ engine, scene })
}

export { createScene }