// ==============================================================================
// Program: DocumentFiles.h
// Programmer: Ethan-da-Tech-Wizard
// Last Modified: November 19, 2026
// Purpose: Platform abstraction layer and file I/O bridge for Archi architectural board documents.
//          Delegates directly to the core native DocumentFiles implementation in the Archi engine,
//          providing declarative QML bindings with atomic read/write semantics, path normalization,
//          and transactional file locking across concurrent UI sessions.
// ==============================================================================

#pragma once

// Include the foundational DocumentFiles header from the core Archi systems library.
// Invariant: Paths must be normalized to standard URL or absolute POSIX representations
// before dispatching disk read/write requests to maintain cross-platform safety.
#include "../../archi/src/DocumentFiles.h"
