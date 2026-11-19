// ==============================================================================
// Program: setup.cpp
// Programmer: Ethan-da-Tech-Wizard
// Last Modified: November 19, 2026
// Purpose: Test fixture bootstrap and environment setup utility for headless QtQuickTest execution.
//          Instantiates mock native C++ controllers (DocumentFiles, MathEngine, DocumentSync),
//          configures Qt Quick styles, captures offscreen window buffers, and exposes testing tools
//          to declarative QML automated test cases.
// ==============================================================================

#include "../DocumentFiles.h"
#include "../../../archi/src/MathEngine.h"
#include "../../../archi/src/DocumentSync.h"
#include <QQmlContext>
#include <QQmlEngine>
#include <QQuickStyle>
#include <QQuickWindow>
#include <QtQuickTest/quicktest.h>
#include <memory>

/**
 * Test environment orchestrator hooking into QtQuickTest execution phases.
 * 
 * Provides mock service injection and headless offscreen window buffer frame-grabbing
 * capabilities for visual regression and integration testing.
 */
class BoardSetup : public QObject {
    Q_OBJECT
    
    // Concrete native engine instances maintained throughout test harness execution
    DocumentFiles files;
    MathEngine math;
    std::unique_ptr<DocumentSync> sync;

public:
    /**
     * Grabs a pixel buffer screenshot of the target Quick window and persists it to disk.
     * 
     * @param window Raw pointer to the active QQuickWindow.
     * @param path Target filesystem path for PNG image serialization.
     * @return True if grab and save succeeded; false if window is null or write failed.
     */
    Q_INVOKABLE bool captureWindow(QQuickWindow *window, const QString &path) {
        return window && window->grabWindow().save(path);
    }

public slots:
    /**
     * Invoked when QGuiApplication becomes available; sets standard look-and-feel style.
     */
    void applicationAvailable() { 
        QQuickStyle::setStyle("Fusion"); 
    }

    /**
     * Invoked when the QML engine is instantiated but before test case scripts evaluate.
     * Injects native mock backend singletons into the root context namespace.
     * 
     * @param engine Pointer to the active QQmlEngine instance.
     */
    void qmlEngineAvailable(QQmlEngine *engine) {
        // Allocate isolated DocumentSync instance per test engine run
        sync = std::make_unique<DocumentSync>();
        
        // Expose native backends to declarative QML test runner
        engine->rootContext()->setContextProperty("boardFiles", &files);
        engine->rootContext()->setContextProperty("mathEngine", &math);
        engine->rootContext()->setContextProperty("projectSync", sync.get());
        engine->rootContext()->setContextProperty("boardTestTools", this);
    }
};

// Macro expanding to main() harness entry point integrating with QtQuickTest runner
QUICK_TEST_MAIN_WITH_SETUP(board, BoardSetup)
#include "setup.moc"
