// ==============================================================================
// Program: board.cpp
// Programmer: Ethan-da-Tech-Wizard
// Last Modified: November 18, 2026
// Purpose: C++ entry point initializing Qt GUI application and mounting ArchiBoard QML view.
//          Binds native backend engine instances (DocumentFiles, MathEngine,
//          DocumentSync) into the QML root context for bidirectional QML/C++ bridge.
// ==============================================================================
#include "DocumentFiles.h"
#include "../../archi/src/MathEngine.h"
#include "../../archi/src/DocumentSync.h"
#include <QGuiApplication>
#include <QIcon>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>

/**
 * Main application bootstrap for the Archi interactive board visualization.
 * Parses command-line arguments to locate the target QML template and launches the event loop.
 */
int main(int argc, char *argv[]) {
    // 1. Initialize Qt GUI Application lifecycle and identity attributes
    QGuiApplication app(argc, argv);
    app.setOrganizationName("ArchiBrainstorm");
    app.setApplicationName("Desktop Sidekick Brainstorm");

    // 2. Set cross-platform look-and-feel style and icon theme fallback
    QQuickStyle::setStyle("Fusion");
    QIcon::setFallbackThemeName("breeze");

    // 3. Command-line argument validation: expects exactly 1 argument (path to QML file)
    if (app.arguments().size() != 2)
        return 2;

    // 4. Instantiate native C++ controller models for document I/O, math execution, and sync
    DocumentFiles files;
    MathEngine math;
    DocumentSync sync;

    // 5. Initialize the QML declarative engine and inject C++ context properties
    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty("boardFiles", &files);
    engine.rootContext()->setContextProperty("mathEngine", &math);
    engine.rootContext()->setContextProperty("projectSync", &sync);

    // 6. Connect QML quit/exit signals to the primary Qt event loop termination slots
    QObject::connect(&engine, &QQmlEngine::quit, &app, &QCoreApplication::quit);
    QObject::connect(&engine, &QQmlEngine::exit, &app, &QCoreApplication::exit);

    // 7. Load target QML visual layout from the designated local filesystem path
    engine.load(QUrl::fromLocalFile(app.arguments().at(1)));
    if (engine.rootObjects().isEmpty())
        return 1;

    // 8. Start blocking GUI event loop execution
    return app.exec();
}
