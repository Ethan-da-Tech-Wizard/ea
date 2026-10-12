# ea

EA is a free, self-hosted desktop assistant being defined in the analysis phase.
No EA assistant runtime is implemented or running in this repository.

- [Guided project workflow, phase ownership and current questions](PROJECT-WORKFLOW.md)
- [Analysis workspace and verification commands](brainstorm/README.md)
- [ZI scope and open decisions](brainstorm/ZI-SCOPE.md)
- [Complete feature inventory](brainstorm/END-STATE.md)
- [Alignment audit and remaining gaps](brainstorm/ALIGNMENT.md)
- [Pseudocode](brainstorm/PSEUDOCODE.md)
- [Flowchart reference](brainstorm/FLOW-REFERENCE.md)
- [Editable Archi project](brainstorm/assistant-expanded.archi.json)

ZI is scoped to permitted screen/local reading, explicitly requested public-source
research with local AI, guidance, internal computation and requested inert artifacts. External execution belongs to the separate future ZII edition.
Every included ZI feature targets 4 GB total machine RAM; feasibility is not yet
proven. Analysis has not been signed off or frozen.

The `brainstorm` folder contains the specifications, flowchart sources, saved
diagrams and planning checks. Native Archi tooling currently depends on a
separate sibling `archi` checkout and local Qt/SymPy setup described in the
workspace README; those dependencies and build outputs are not bundled here.
