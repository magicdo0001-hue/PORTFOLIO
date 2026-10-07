// Map a DOM rectangle onto the four projected corners of a physical display.
export function quadMatrix([p0,p1,p2,p3], width, height) {
  const dx1=p1[0]-p2[0],dx2=p3[0]-p2[0],dx3=p0[0]-p1[0]+p2[0]-p3[0];
  const dy1=p1[1]-p2[1],dy2=p3[1]-p2[1],dy3=p0[1]-p1[1]+p2[1]-p3[1];
  const determinant=dx1*dy2-dx2*dy1;
  const g=Math.abs(determinant)<1e-8?0:(dx3*dy2-dx2*dy3)/determinant;
  const h=Math.abs(determinant)<1e-8?0:(dx1*dy3-dx3*dy1)/determinant;
  return [(p1[0]-p0[0]+g*p1[0])/width,(p1[1]-p0[1]+g*p1[1])/width,0,g/width,
    (p3[0]-p0[0]+h*p3[0])/height,(p3[1]-p0[1]+h*p3[1])/height,0,h/height,
    0,0,1,0,p0[0],p0[1],0,1];
}

export function panelCorners(mesh, T) {
  const {position,uv}=mesh.geometry.attributes;
  // glTF flips Blender's V coordinate: top-left is (0,0).
  return [[0,0],[1,0],[1,1],[0,1]].map(([u,v])=>{
    let index=0,distance=Infinity;
    for(let i=0;i<uv.count;i++){
      const d=(uv.getX(i)-u)**2+(uv.getY(i)-v)**2;
      if(d<distance){distance=d;index=i;}
    }
    return new T.Vector3(position.getX(index),position.getY(index),position.getZ(index));
  });
}
