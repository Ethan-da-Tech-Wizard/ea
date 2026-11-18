// Program: ea - board.cpp
// Programmer: Ethan-da-Tech-Wizard (written with Claude, an AI assistant)
// Last Modified: 2026-11-18
// Purpose: Small Qt program that loads a QML file given on the command line and exposes file, math, and sync helper objects to it.

// === Includes: the archi helper classes, then Qt GUI/QML pieces ===
#include "DocumentFiles.h"
#include "../../archi/src/MathEngine.h"
#include "../../archi/src/DocumentSync.h"
#include <QGuiApplication>
#include <QIcon>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>

// Program entry point; the one required argument is the QML file to open.
int main(int argc, char *argv[]) {
    // Create the Qt application object (needed before any window).
    QGuiApplication app(argc, argv);
    // Set names Qt uses for settings storage.
    app.setOrganizationName("ArchiBrainstorm");
    app.setApplicationName("Desktop Sidekick Brainstorm");
    // Use the Fusion look for controls, with the breeze icon theme as a fallback.
    QQuickStyle::setStyle("Fusion");
    QIcon::setFallbackThemeName("breeze");
    // Expect exactly the program name plus one QML path; otherwise exit with code 2.
    if (app.arguments().size() != 2)
        return 2;

    // === Helper objects that QML code can call ===
    DocumentFiles files;
    MathEngine math;
    DocumentSync sync;
    QQmlApplicationEngine engine;
    // Make each helper visible to QML under a global name.
    engine.rootContext()->setContextProperty("boardFiles", &files);
    engine.rootContext()->setContextProperty("mathEngine", &math);
    engine.rootContext()->setContextProperty("projectSync", &sync);
    // Let QML ask the application to quit or exit with a code.
    QObject::connect(&engine, &QQmlEngine::quit, &app, &QCoreApplication::quit);
    QObject::connect(&engine, &QQmlEngine::exit, &app, &QCoreApplication::exit);
    // Load the QML file named on the command line.
    engine.load(QUrl::fromLocalFile(app.arguments().at(1)));
    // If the QML failed to load, exit with code 1.
    if (engine.rootObjects().isEmpty())
        return 1;
    // Run the event loop until the window closes.
    return app.exec();
}
