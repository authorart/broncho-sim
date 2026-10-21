# 1. Raymarched SDF airway instead of mesh geometry for the endoscopic view

Status: accepted

## Context
The intraluminal view needs smooth bifurcation spurs (carinae), horseshoe cartilage rings that stop at the posterior membranous wall, and a fisheye wide-angle optic of about 120°. It also has to support collision and "wedge" detection for the simulator. Joining overlapping tube meshes produces visible seams and open gaps at every bifurcation. Building a watertight tree mesh, either procedurally or from CT, would be a large separate project.

## Decision
The airway is a smooth-min union of tapered capsules, defined in `lib/airway/geometry.ts`. It is raymarched in a fullscreen fragment shader (`components/airway/endoscopeShader.ts`). Each frame the CPU sends only the 28 capsules nearest the scope tip. The CPU evaluates the same signed distance function (SDF) to drive scope kinematics, wall contact, wedging, location naming and label occlusion.

## Consequences
- Bifurcations, rings and mucosal noise come out of a single code path, and physics uses the same shape as rendering.
- The GPU cost is per pixel. A "Performance" toggle lowers the resolution and the number of ray steps for integrated GPUs.
- Swapping in a patient-specific CT airway would need either a capsule fit of the centreline or a 3D distance texture.
