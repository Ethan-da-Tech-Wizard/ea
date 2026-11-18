// Program: ea - ArchiBoard.qml
// Programmer: Ethan-da-Tech-Wizard (written with Claude, an AI assistant)
// Last Modified: 2026-11-18
// Purpose: QML root file that opens the Archi project workspace with the assistant-expanded board document loaded.

// Import the basic QtQuick types.
import QtQuick
import "../../archi/qml" as Archi

// The window content is the ProjectWorkspace component from the sibling archi project.
Archi.ProjectWorkspace {
    // Load this board file, located next to this QML file.
    documentUrl: Qt.resolvedUrl("assistant-expanded.archi.json")
    // Do not reopen whichever project was used last time; always show the file above.
    restoreLastProject: false
}
