// ==============================================================================
// Program: ArchiBoard.qml
// Programmer: Ethan-da-Tech-Wizard
// Last Modified: November 18, 2026
// Purpose: QML interactive canvas entry component for rendering and interacting with EA architectural boards.
// ==============================================================================
import QtQuick
import "../../archi/qml" as Archi

Archi.ProjectWorkspace {
    documentUrl: Qt.resolvedUrl("assistant-expanded.archi.json")
    restoreLastProject: false
}
