// Program: ea - setup.cpp
// Programmer: Ethan-da-Tech-Wizard (written with Claude, an AI assistant)
// Last Modified: 2026-11-18
// Purpose: Qt Quick Test setup that gives test QML code the same helper objects as the real board plus a window screenshot tool.

// === Includes: archi helper classes, Qt QML/Quick pieces, and the Quick Test macro ===
#include "../DocumentFiles.h"
#include "../../../archi/src/MathEngine.h"
#include "../../../archi/src/DocumentSync.h"
#include <QQmlContext>
#include <QQmlEngine>
#include <QQuickStyle>
#include <QQuickWindow>
#include <QtQuickTest/quicktest.h>
#include <memory>

/** Test fixture object: owns the helpers and registers them with the QML test engine. */
class BoardSetup : public QObject {
    // Required by Qt for signals, slots, and invokable methods.
    Q_OBJECT
    // Helper objects shared with the QML tests (DocumentSync is created fresh per engine).
    DocumentFiles files;
    MathEngine math;
    std::unique_ptr<DocumentSync> sync;
public:
    /** Save a screenshot of the window to path; returns false if there is no window or saving fails. Callable from QML. */
    Q_INVOKABLE bool captureWindow(QQuickWindow *window, const QString &path) {
        return window && window->grabWindow().save(path);
    }
public slots:
    /** Runs once when the test application starts: use the Fusion style. */
    void applicationAvailable() { QQuickStyle::setStyle("Fusion"); }
    /** Runs when the QML engine exists: create a new DocumentSync and expose the helpers to QML by name. */
    void qmlEngineAvailable(QQmlEngine *engine) {
        sync = std::make_unique<DocumentSync>();
        engine->rootContext()->setContextProperty("boardFiles", &files);
        engine->rootContext()->setContextProperty("mathEngine", &math);
        engine->rootContext()->setContextProperty("projectSync", sync.get());
        engine->rootContext()->setContextProperty("boardTestTools", this);
    }
};

// Generate main() for the test suite named "board" using the setup class above.
QUICK_TEST_MAIN_WITH_SETUP(board, BoardSetup)
// Include Qt's generated meta-object code for the class defined in this file.
#include "setup.moc"
