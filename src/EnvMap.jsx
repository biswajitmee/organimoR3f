function EnvMap() {
  const envMap = useLoader(CubeTextureLoader, [
    '/env/px.png',
    '/env/nx.png',
    '/env/py.png',
    '/env/ny.png',
    '/env/pz.png',
    '/env/nz.png'
  ])

  return (
    <>
      <primitive attach="background" object={envMap} />
      <primitive attach="environment" object={envMap} />
    </>
  )
}
