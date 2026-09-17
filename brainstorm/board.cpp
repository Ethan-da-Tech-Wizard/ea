#include "DocumentFiles.h"
#include "../../archi/src/MathEngine.h"
#include "../../archi/src/DocumentSync.h"
#include <QGuiApplication>
#include <QIcon>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickStyle>

int main(int argc, char *argv[]) {
    QGuiApplication app(argc, argv);
    app.setOrganizationName("ArchiBrainstorm");
    app.setApplicationName("Desktop Sidekick Brainstorm");
    QQuickStyle::setStyle("Fusion");
    QIcon::setFallbackThemeName("breeze");
    if (app.arguments().size() != 2)
        return 2;

    DocumentFiles files;
    MathEngine math;
    DocumentSync sync;
    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty("boardFiles", &files);
    engine.rootContext()->setContextProperty("mathEngine", &math);
    engine.rootContext()->setContextProperty("projectSync", &sync);
    QObject::connect(&engine, &QQmlEngine::quit, &app, &QCoreApplication::quit);
    QObject::connect(&engine, &QQmlEngine::exit, &app, &QCoreApplication::exit);
    engine.load(QUrl::fromLocalFile(app.arguments().at(1)));
    if (engine.rootObjects().isEmpty())
        return 1;
    return app.exec();
}
