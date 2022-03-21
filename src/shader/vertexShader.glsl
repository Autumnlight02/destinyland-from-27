attribute vec3 aRandom;

varying vec3 vPosition;

uniform float uTime;

void main() {
  vPosition = position;

  float time = uTime + 4.0;

  vec3 pos = position;
  pos.y += cos(time * aRandom.y) * 0.012; 
  pos.x += sin(time * aRandom.x) * 0.012; 
  pos.z += cos(time * aRandom.z) * 0.012; 



  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 16.0 / -mvPosition.z;
}