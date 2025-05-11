// ground.frag
uniform float uTime;
varying vec2 vUv;

void main() {
  float effect = sin(vUv.y * 10.0 + uTime) * 0.05;
  gl_FragColor = vec4(0.2 + effect, 0.2, 0.1, 1.0);
}
