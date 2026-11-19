// ==============================================================================
// Program: ArchiBoard.qml
// Programmer: Ethan-da-Tech-Wizard
// Last Modified: November 19, 2026
// Purpose: Declarative QML interactive canvas and workspace mount point for Archi architectural boards.
//          Instantiates the foundational Archi.ProjectWorkspace visual component, resolves local
//          relative schema document URLs, and enforces deterministic initial state by disabling
//          transient session caching across application restarts.
// ==============================================================================

import QtQuick
import "../../archi/qml" as Archi

// Primary declarative workspace host binding the interactive diagram canvas to the native engine
Archi.ProjectWorkspace {
    // Resolve canonical filesystem URL to the comprehensive expanded assistant architecture specification
    documentUrl: Qt.resolvedUrl("assistant-expanded.archi.json")
    
    // Explicitly disable restoring previous session project state to ensure test reproducibility
    // and prevent stale in-memory edits from contaminating a fresh application launch.
    restoreLastProject: false
}
