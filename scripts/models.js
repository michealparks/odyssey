import { promisify } from 'node:util';
import { exec as _exec } from 'node:child_process'

const exec = promisify(_exec)

const models = ['ship']

for (let model of models) {
  let cmd = `npx @threlte/gltf@0.0.5 public/glb/${model}.glb`
  cmd += ` --output src/models/${model}.svelte`
  cmd += ` --types`
  cmd += ` --keepnames`
  cmd += ` --meta`
  cmd += ` --shadows`
  cmd += ` --debug`
  console.log(cmd)
  await exec(cmd)
}
