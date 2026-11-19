// ==============================================================================
// Program: board.cpp
// Programmer: Ethan-da-Tech-Wizard
// Last Modified: November 19, 2026
// Purpose: C++ entry point and runtime bootstrap for the Archi interactive board visualization engine.
//          Initializes the Qt Quick / QML rendering subsystem, configures cross-platform GUI styling,
//          validates input CLI file descriptors, and registers native C++ backend engines
//          (DocumentFiles, MathEngine, DocumentSync) into the root QML context for bidirectional
//          procedural interaction, transactional file state tracking, and symbolic math evaluation.
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
 * 
 * Concurrency & Memory Management Architecture:
 *   - The main GUI thread owns the Qt event loop (`app.exec()`) and manages the lifetime of all top-level QML objects.
 *   - Backend service instances (`files`, `math`, `sync`) are stack-allocated in the main stack frame and outlive
 *     the declarative `QQmlApplicationEngine`. Exposing them via un-owned raw pointers (`setContextProperty`)
 *     is safe because `engine` is destructed before the stack frame unwinds upon application termination.
 *   - Asynchronous worker threads spawned by backend engines synchronize state back to the GUI thread
 *     via Qt queued signal-slot connections.
 * 
 * @param argc Number of command-line arguments.
 * @param argv Null-terminated array of command-line argument strings.
 * @return Exit status integer (0 for clean termination, 1 for QML load errors, 2 for invalid arguments).
 */
int main(int argc, char *argv[]) {
    // --------------------------------------------------------------------------
    // 1. Qt GUI Application Lifecycle Initialization
    // --------------------------------------------------------------------------
    // Construct the central QGuiApplication instance managing the desktop windowing system,
    // event dispatching, session management, and system palette integration.
    QGuiApplication app(argc, argv);
    app.setOrganizationName("ArchiBrainstorm");
    app.setApplicationName("Desktop Sidekick Brainstorm");

    // --------------------------------------------------------------------------
    // 2. Windowing System Look-and-Feel & Visual Theming Configuration
    // --------------------------------------------------------------------------
    // Enforce the high-performance, compact "Fusion" QuickStyle across all platforms
    // to guarantee consistent widget geometry, padding, and layout bounds across Linux/macOS/Windows.
    QQuickStyle::setStyle("Fusion");
    // Fall back to the Breeze icon theme if system icon lookup fails on minimal Wayland/X11 compositors.
    QIcon::setFallbackThemeName("breeze");

    // --------------------------------------------------------------------------
    // 3. Command-Line Argument Verification & Boundary Invariant Enforcement
    // --------------------------------------------------------------------------
    // Invariant: The CLI caller must provide exactly one target QML template file argument (argv[1]).
    // Return error code 2 immediately if invocation syntax is malformed.
    if (app.arguments().size() != 2)
        return 2;

    // --------------------------------------------------------------------------
    // 4. Native C++ Controller Model Instantiation
    // --------------------------------------------------------------------------
    // Allocate core native subsystems on the execution stack:
    //   - DocumentFiles: File read/write transactions, directory queries, atomic save operations.
    //   - MathEngine: Symbolic calculus, linear algebra, and logic expression verification bridge.
    //   - DocumentSync: State hash tracking, draft change detection, and alignment auditing.
    DocumentFiles files;
    MathEngine math;
    DocumentSync sync;

    // --------------------------------------------------------------------------
    // 5. QML Declarative Engine Initialization & C++ Context Property Injection
    // --------------------------------------------------------------------------
    // Create the QML engine hosting the JavaScript runtime, scene graph, and declarative object trees.
    QQmlApplicationEngine engine;
    
    // Bind native C++ subsystems into the global QML root context namespace.
    // This allows QML scripts to invoke C++ slots and access Q_PROPERTY values directly without plugin overhead.
    engine.rootContext()->setContextProperty("boardFiles", &files);
    engine.rootContext()->setContextProperty("mathEngine", &math);
    engine.rootContext()->setContextProperty("projectSync", &sync);

    // --------------------------------------------------------------------------
    // 6. Signal-Slot Event Loop Termination Handshake
    // --------------------------------------------------------------------------
    // Forward QML declarative quit/exit requests directly to the underlying QCoreApplication event loop,
    // ensuring graceful destruction of graphical windows and persistent state flushes.
    QObject::connect(&engine, &QQmlEngine::quit, &app, &QCoreApplication::quit);
    QObject::connect(&engine, &QQmlEngine::exit, &app, &QCoreApplication::exit);

    // --------------------------------------------------------------------------
    // 7. QML Scene Graph Loading & Null Object Safety Check
    // --------------------------------------------------------------------------
    // Resolve the filesystem path into a canonical QUrl and parse the QML file tree.
    engine.load(QUrl::fromLocalFile(app.arguments().at(1)));
    
    // Safety check: If root object instantiation failed (e.g., syntax errors or missing QML components),
    // abort immediately with non-zero exit code 1 to prevent hanging headless processes.
    if (engine.rootObjects().isEmpty())
        return 1;

    // --------------------------------------------------------------------------
    // 8. Blocking GUI Event Loop Execution
    // --------------------------------------------------------------------------
    // Enter the primary event dispatching loop, processing mouse, keyboard, and timer events
    // until application exit is triggered.
    return app.exec();
}
