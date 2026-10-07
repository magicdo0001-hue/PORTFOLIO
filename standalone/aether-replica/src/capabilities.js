export function supportsWebGL2() {
  let context;
  try {
    if(!window.WebGL2RenderingContext)return false;
    context=document.createElement('canvas').getContext('webgl2');
    return !!context;
  } catch {
    return false;
  } finally {
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
